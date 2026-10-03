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

float blob(vec2 p, vec2 c, float r) {
  vec2 d = p - c;
  return exp(-dot(d, d) / (r * r));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.12;

  vec2 warp = vec2(noise(p * 1.7 + t), noise(p * 1.7 - t + 7.3)) - 0.5;
  p += warp * 0.35;

  vec2 m = vec2(uMouse.x * aspect, uMouse.y);

  float s = mix(0.62, 1.0, clamp((aspect - 0.45) / 0.55, 0.0, 1.0));
  float lift = (1.0 - s) * 0.3;

  float a = blob(p, vec2(aspect * (0.68 + 0.10 * sin(t * 1.3)), 0.55 + lift + 0.12 * cos(t * 1.1)), 0.46 * s);
  float b = blob(p, vec2(aspect * (0.84 + 0.08 * cos(t * 0.9)), 0.30 + lift + 0.14 * sin(t * 1.4)), 0.34 * s);
  float c = blob(p, vec2(aspect * (0.52 + 0.12 * sin(t * 0.8 + 2.0)), 0.80 + lift * 0.5 + 0.10 * cos(t * 1.2)), 0.38 * s);
  float d = blob(p, vec2(aspect * (0.28 + 0.06 * cos(t)), 0.18 + lift + 0.08 * sin(t * 1.6)), 0.30 * s);
  float e = blob(p, m, 0.30 * s) * uMouseOn;

  vec3 bg = vec3(0.043, 0.051, 0.059);
  vec3 deep = vec3(0.05, 0.30, 0.27);
  vec3 teal = vec3(0.31, 0.70, 0.61);
  vec3 amber = vec3(0.94, 0.71, 0.35);

  vec3 col = bg;
  col += deep * a * 0.95;
  col += teal * b * 0.42;
  col += deep * c * 0.7;
  col += amber * d * 0.22;
  col += mix(teal, amber, 0.5) * e * 0.36;

  float vig = smoothstep(1.25, 0.35, length((uv - vec2(0.6, 0.5)) * vec2(1.0, 1.15)));
  col *= mix(0.55, 1.0, vig);

  float grain = hash(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5;
  col += grain * 0.035;

  gl_FragColor = vec4(col, 1.0);
}`;

export class AuroraField {
  private gl: WebGLRenderingContext;
  private canvas: HTMLCanvasElement;
  private uni: Record<string, WebGLUniformLocation | null> = {};
  private raf = 0;
  private running = false;
  private speed: number;
  private start = performance.now();
  private target = { x: 0.7, y: 0.5, on: 0 };
  private auto: boolean;
  private lastInput = 0;
  private mouse = { x: 0.7, y: 0.5, on: 0 };

  constructor(canvas: HTMLCanvasElement, opts: Options = {}) {
    this.canvas = canvas;
    this.speed = opts.calm ? 0.5 : 1;
    this.auto = window.matchMedia('(hover: none)').matches;
    const gl = getContext(canvas);
    this.gl = gl;
    const prog = createProgram(gl, VERT, FRAG);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    for (const u of ['uRes', 'uTime', 'uMouse', 'uMouseOn'])
      this.uni[u] = gl.getUniformLocation(prog, u);
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
    gl.viewport(0, 0, w, h);
    if (!this.running) this.draw(performance.now());
  }

  setPointer(x: number, y: number, active = true) {
    this.lastInput = performance.now();
    this.target = { x: (x + 1) / 2, y: (y + 1) / 2, on: active ? 1 : 0 };
  }

  burst() {
    this.mouse.on = 2;
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
    if (this.auto && now - this.lastInput > 2500) {
      const t = ((now - this.start) / 1000) * this.speed;
      target.x = 0.5 + 0.3 * Math.sin(t * 0.45);
      target.y = 0.55 + 0.22 * Math.cos(t * 0.33);
      target.on = 1;
    }
    mouse.x += (target.x - mouse.x) * 0.06;
    mouse.y += (target.y - mouse.y) * 0.06;
    mouse.on += (target.on - mouse.on) * 0.05;

    gl.uniform2f(this.uni.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uni.uTime, ((now - this.start) / 1000) * this.speed);
    gl.uniform2f(this.uni.uMouse, mouse.x, mouse.y);
    gl.uniform1f(this.uni.uMouseOn, mouse.on);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
