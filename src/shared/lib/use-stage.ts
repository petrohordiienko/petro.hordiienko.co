import { useEffect, useRef, useState } from 'react';

export type Stage = {
  resize(): void;
  play(): void;
  pause(): void;
  destroy(): void;
  setPointer(x: number, y: number, active?: boolean): void;
  burst(x: number, y: number): void;
};

type Options<T extends Stage> = {
  create: (canvas: HTMLCanvasElement, reducedMotion: boolean) => T;
  layout?: (stage: T) => void;
  pointer?: boolean;
};

export function useStage<T extends Stage>(options: Options<T>) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<T | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const [status, setStatus] = useState<'pending' | 'on' | 'off'>('pending');

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stage: T;
    try {
      stage = optionsRef.current.create(canvas, reduced);
    } catch {
      setStatus('off');
      return;
    }
    stageRef.current = stage;
    setStatus('on');

    const layout = () => {
      optionsRef.current.layout?.(stage);
      stage.resize();
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(canvas);

    const toNdc = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) / r.width) * 2 - 1,
        y: -(((e.clientY - r.top) / r.height) * 2 - 1),
      };
    };
    const onMove = (e: PointerEvent) => {
      const p = toNdc(e);
      stage.setPointer(p.x, p.y, true);
    };
    const onLeave = () => stage.setPointer(0, 0, false);
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a,button,input')) return;
      const p = toNdc(e);
      stage.burst(p.x, p.y);
    };
    const interactive = optionsRef.current.pointer !== false;
    if (interactive) {
      section.addEventListener('pointermove', onMove);
      section.addEventListener('pointerleave', onLeave);
      section.addEventListener('pointerdown', onDown);
    }

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) stage.play();
      else stage.pause();
    });
    io.observe(section);
    const onVis = () => (document.hidden || !visible ? stage.pause() : stage.play());
    document.addEventListener('visibilitychange', onVis);

    stage.play();

    return () => {
      ro.disconnect();
      io.disconnect();
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      section.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVis);
      stage.destroy();
      stageRef.current = null;
    };
  }, []);

  return { sectionRef, canvasRef, stageRef, status };
}
