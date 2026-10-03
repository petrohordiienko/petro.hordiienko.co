export function createProgram(gl: WebGLRenderingContext, vert: string, frag: string) {
  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('shader');
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(shader) ?? 'shader');
    return shader;
  };
  const prog = gl.createProgram();
  if (!prog) throw new Error('program');
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(prog) ?? 'link');
  // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL call, not a React hook
  gl.useProgram(prog);
  return prog;
}

export function getContext(canvas: HTMLCanvasElement) {
  const gl =
    (canvas.getContext('webgl', {
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
    }) as WebGLRenderingContext | null) ??
    (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
  if (!gl) throw new Error('WebGL unavailable');
  return gl;
}
