'use client';

import { useEffect, useRef, useState } from 'react';

export function CopyEmail({
  email,
  copy,
  copied,
}: {
  email: string;
  copy: string;
  copied: string;
}) {
  const [done, setDone] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const selectText = () => {
    const node = codeRef.current;
    const sel = window.getSelection();
    if (!node || !sel) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setDone(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setDone(false), 1600);
    } catch {
      selectText();
    }
  };

  return (
    <div className="mt-8.5 flex flex-wrap items-center gap-3">
      <a href={`mailto:${email}`} className="focus-ring-night no-underline">
        <code ref={codeRef} className="break-all font-mono text-email text-night-foreground">
          {email}
        </code>
      </a>
      <button
        type="button"
        onClick={onCopy}
        aria-live="polite"
        className="focus-ring-night cursor-pointer rounded-full border border-night-border bg-transparent px-3 py-2 font-medium font-mono text-night-foreground text-xs uppercase leading-none tracking-wide hover:border-night-muted"
      >
        {done ? copied : copy}
      </button>
    </div>
  );
}
