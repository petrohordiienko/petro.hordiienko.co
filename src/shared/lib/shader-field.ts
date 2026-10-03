import { createProgram, getContext } from './gl';

type Options = { calm?: boolean };

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseOn;
uniform vec3 uRipple[4];

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime;
  float glow = 0.0;

  vec2 d = p - uMouse;
  float md = dot(d, d);
  float well = exp(-md * 7.0) * uMouseOn;
  p += vec2(-d.y, d.x) * well * 1.4 + d * well * 0.35;
  glow += well * 0.35;

  for (int i = 0; i < 4; i++) {
    vec3 r = uRipple[i];
    if (r.z > 0.0) {
      vec2 rd = p - r.xy;
      float rl = length(rd) + 1e-4;
      float ring = exp(-pow((rl - r.z * 0.8) * 9.0, 2.0)) * exp(-r.z * 1.3);
      p += rd / rl * ring * 0.22;
      glow += ring * 0.8;
    }
  }

  vec2 q = vec2(fbm(p * 1.6 + vec2(0.0, t * 0.12)), fbm(p * 1.6 + vec2(5.2, 1.3) - t * 0.1));
  vec2 w = p + 1.7 * q;
  float f = fbm(w * 1.7 + vec2(t * 0.06, -t * 0.04));

  float x = abs(fract(f * 9.0 - t * 0.22) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.07, x);
  float fine = 1.0 - smoothstep(0.0, 0.025, abs(fract(f * 36.0 + t * 0.1) - 0.5));

  vec3 pine = vec3(0.38, 0.82, 0.70);
  vec3 mist = vec3(0.93, 0.95, 0.92);
  vec3 amber = vec3(0.94, 0.71, 0.35);
  vec3 deep = vec3(0.12, 0.42, 0.36);

  vec3 col = mix(deep, pine, smoothstep(0.25, 0.7, f));
  col = mix(col, mist, smoothstep(0.62, 0.9, f) * 0.7);
  col = mix(col, amber, smoothstep(0.55, 0.9, q.x) * smoothstep(0.4, 0.7, q.y) * 0.9);

  float a = line * 0.55 + fine * 0.14 + f * f * 0.12 + glow * 0.4;
  float side = mix(0.28, 1.0, smoothstep(-0.1, 0.55, gl_FragCoord.x / uRes.x));
  a *= side;
  gl_FragColor = vec4(col * a, a);
}`;

export class ShaderField {
  private gl: WebGLRenderingContext;
  private canvas: HTMLCanvasElement;
  private uni: Record<string, WebGLUniformLocation | null> = {};
  private raf = 0;
  private running = false;
  private speed: number;
  private start = performance.now();
  private aspect = 1;
  private target = { x: 0, y: 0, on: 0 };
  private mouse = { x: 0, y: 0, on: 0 };
  private ripples: { x: number; y: number; t0: number }[] = [];

  constructor(canvas: HTMLCanvasElement, opts: Options = {}) {
    this.canvas = canvas;
    this.speed = opts.calm ? 0.5 : 1;
    const gl = getContext(canvas);
    this.gl = gl;
    const prog = createProgram(gl, VERT, FRAG);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    for (const u of ['uRes', 'uTime', 'uMouse', 'uMouseOn', 'uRipple'])
      this.uni[u] = gl.getUniformLocation(prog, u);

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    this.resize();
  }

  resize() {
    const { canvas, gl } = this;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    this.aspect = w / h;
    gl.viewport(0, 0, w, h);
    if (!this.running) this.draw(performance.now());
  }

  setPointer(x: number, y: number, active = true) {
    this.target = { x: x * 0.5 * this.aspect, y: y * 0.5, on: active ? 1 : 0 };
  }

  burst(x: number, y: number) {
    this.ripples.push({ x: x * 0.5 * this.aspect, y: y * 0.5, t0: performance.now() });
    if (this.ripples.length > 4) this.ripples.shift();
  }

  play() {
    if (this.running) return;
    this.running = true;
    const loop = (t: number) => {
      if (!this.running) return;
      this.draw(t);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  pause() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.pause();
  }

  private draw(now: number) {
    const { gl, mouse, target } = this;
    mouse.x += (target.x - mouse.x) * 0.12;
    mouse.y += (target.y - mouse.y) * 0.12;
    mouse.on += (target.on - mouse.on) * 0.08;

    this.ripples = this.ripples.filter((r) => now - r.t0 < 3500);
    const ripple = new Float32Array(12);
    this.ripples.forEach((r, i) => {
      ripple[i * 3] = r.x;
      ripple[i * 3 + 1] = r.y;
      ripple[i * 3 + 2] = ((now - r.t0) / 1000) * this.speed + 0.001;
    });

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(this.uni.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uni.uTime, ((now - this.start) / 1000) * this.speed);
    gl.uniform2f(this.uni.uMouse, mouse.x, mouse.y);
    gl.uniform1f(this.uni.uMouseOn, mouse.on);
    gl.uniform3fv(this.uni.uRipple, ripple);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
