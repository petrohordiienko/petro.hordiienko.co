export function StackMarquee({ label, items }: { label: string; items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="pointer-events-none flex items-center gap-6 border-night-border border-t pt-4.5">
      <span className="font-mono text-night-muted text-xs uppercase tracking-wider max-md:hidden">
        {label}
      </span>
      <div className="marquee-mask min-w-0 flex-1 overflow-hidden">
        <ul className="flex w-max animate-marquee gap-10 font-mono text-night-foreground text-sm uppercase tracking-wide motion-reduce:animate-none">
          {loop.map((item, i) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: the list is intentionally duplicated for a seamless loop
              key={i}
              className="flex items-center gap-10"
            >
              {item}
              <span aria-hidden="true" className="size-1.5 rounded-full bg-night-amber" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
