/**
 * Distorsion type vague / liquide au survol sur l’image motfleche (WebGL).
 * Repli : image seule si WebGL indisponible ou prefers-reduced-motion.
 */

function createShader(gl, type, source) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, source);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function createProgram(gl, vsSrc, fsSrc) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

const VS = `
attribute vec2 a_pos;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
  v_uv = a_uv;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FS = `
precision mediump float;
uniform sampler2D u_tex;
uniform float u_time;
uniform float u_strength;
varying vec2 v_uv;

void main() {
  vec2 uv = v_uv;
  float t = u_time;
  float s = u_strength;

  if (s < 0.001) {
    gl_FragColor = texture2D(u_tex, uv);
    return;
  }

  float w1 = sin(uv.y * 24.0 + t * 1.8) * cos(uv.x * 18.0 - t * 1.2);
  float w2 = sin(uv.x * 22.0 + t * 1.4) * sin(uv.y * 16.0 + t * 0.9);
  vec2 liquid = vec2(w1, w2) * 0.018 * s;

  float ripple = sin(length(uv - 0.5) * 35.0 - t * 3.0) * 0.006 * s;
  liquid += vec2(ripple, -ripple * 0.6);

  vec2 d = uv + liquid;

  float grid = mix(0.0, 72.0, s * s);
  if (grid > 4.0) {
    vec2 g = vec2(grid);
    vec2 pq = (floor(uv * g) + 0.5) / g;
    d = mix(d, pq + liquid * 0.35, s * 0.38);
  }

  d = clamp(d, 0.001, 0.999);

  float ca = 0.0018 * s;
  vec4 cR = texture2D(u_tex, d + vec2(ca, 0.0));
  vec4 cG = texture2D(u_tex, d);
  vec4 cB = texture2D(u_tex, d - vec2(ca, 0.0));
  gl_FragColor = vec4(cR.r, cG.g, cB.b, cG.a);
}
`;

export function initMotflecheDistortion() {
  const wrap = document.querySelector('[data-motfleche-distortion]');
  if (!wrap) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const img = wrap.querySelector('img');
  if (!img) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'motfleche-distortion__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  // L’img peut être dans <picture> : insertBefore(img) échoue si img n’est pas enfant direct de wrap.
  const insertRef = img.closest('picture') || img;
  if (insertRef.parentNode === wrap) {
    wrap.insertBefore(canvas, insertRef);
  } else {
    wrap.prepend(canvas);
  }

  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true });
  if (!gl) {
    canvas.remove();
    return;
  }

  const program = createProgram(gl, VS, FS);
  if (!program) {
    canvas.remove();
    return;
  }

  gl.useProgram(program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const locPos = gl.getAttribLocation(program, 'a_pos');
  const locUv = gl.getAttribLocation(program, 'a_uv');
  const locTex = gl.getUniformLocation(program, 'u_tex');
  const locTime = gl.getUniformLocation(program, 'u_time');
  const locStrength = gl.getUniformLocation(program, 'u_strength');

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  /* Bas-gauche (0,0) → haut-droite (1,1) : même sens que le navigateur + upload FLIP_Y */
  const quad = new Float32Array([
    -1, -1, 0, 0,
     1, -1, 1, 0,
    -1,  1, 0, 1,
     1,  1, 1, 1,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(locPos);
  gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(locUv);
  gl.vertexAttribPointer(locUv, 2, gl.FLOAT, false, 16, 8);

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(locTex, 0);

  let uploaded = false;

  function uploadIfReady() {
    if (uploaded || !img.naturalWidth) return;
    uploaded = true;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  }

  let strength = 0;
  let targetStrength = 0;
  let raf = 0;
  let start = performance.now();

  function resize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    if (w < 2 || h < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function draw() {
    uploadIfReady();
    if (!uploaded) {
      raf = requestAnimationFrame(draw);
      return;
    }

    const t = (performance.now() - start) / 1000;
    strength += (targetStrength - strength) * 0.08;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(locTime, t);
    gl.uniform1f(locStrength, strength);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    const moving = Math.abs(strength - targetStrength) > 0.003;
    const active = targetStrength > 0.02 || strength > 0.025;
    if (moving || active) {
      raf = requestAnimationFrame(draw);
    }
  }

  function kick() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  }

  wrap.addEventListener('mouseenter', () => {
    targetStrength = 1;
    kick();
  });
  wrap.addEventListener('mouseleave', () => {
    targetStrength = 0;
    kick();
  });
  const ro = new ResizeObserver(() => {
    resize();
    kick();
  });
  ro.observe(wrap);

  if (img.complete) {
    uploadIfReady();
  } else {
    img.addEventListener('load', () => {
      uploadIfReady();
      resize();
      kick();
    });
  }

  img.classList.add('motfleche-distortion__img--hidden');
  resize();
  kick();
}
