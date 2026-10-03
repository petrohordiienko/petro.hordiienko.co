// biome-ignore-all lint/suspicious/noArrayIndexKey: decorative mock UI built from static positional elements
import type { PortfolioKind } from '@/content/types';
import type { Device } from './frames';
import { Avatar, Bars, Btn, Line, Num, Ring, Spark } from './primitives';

const rise = [30, 34, 33, 40, 38, 46, 44, 52, 49, 58, 55, 64, 60, 70, 66, 76];
const wave = [20, 28, 22, 40, 34, 50, 38, 62, 44, 56, 36, 48, 30, 42, 26];
const flat = [48, 52, 47, 55, 50, 58, 53, 49, 56, 52, 60, 54];

const Side = ({ items = 5 }: { items?: number }) => (
  <div className="flex w-28 flex-none flex-col gap-3 border-border border-r bg-surface p-3">
    <span className="h-5 w-12 rounded bg-primary" />
    {Array.from({ length: items }, (_, i) => (
      <span key={`s${i}`} className="flex items-center gap-2">
        <span className={`size-3 rounded ${i === 1 ? 'bg-accent' : 'bg-foreground/15'}`} />
        <Line w={i % 2 ? 'w-12' : 'w-16'} className={i === 1 ? 'bg-foreground/35' : undefined} />
      </span>
    ))}
  </div>
);

const Card = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <div className={`rounded-lg border border-border bg-surface-raised p-3 ${className ?? ''}`}>
    {children}
  </div>
);

const Candles = () => {
  const c = [
    [12, 26, 1],
    [20, 34, 1],
    [26, 32, 0],
    [28, 46, 1],
    [38, 48, 0],
    [36, 56, 1],
    [48, 58, 0],
    [46, 66, 1],
    [58, 68, 0],
    [56, 76, 1],
    [66, 80, 1],
    [70, 88, 1],
    [78, 86, 0],
    [74, 92, 1],
  ];
  return (
    <div className="flex h-full items-stretch gap-2 px-1">
      {c.map(([lo, hi, up]) => (
        <span key={`${lo}-${hi}`} className="relative flex-1">
          <span
            className="absolute left-1/2 w-px bg-foreground/25"
            style={{ bottom: `${lo - 6}%`, top: `${100 - hi - 6}%` }}
          />
          <span
            className={`absolute inset-x-0 rounded-sm ${up ? 'bg-primary' : 'bg-accent'}`}
            style={{ bottom: `${lo}%`, top: `${100 - hi}%` }}
          />
        </span>
      ))}
    </div>
  );
};

const Orders = ({ n = 6 }: { n?: number }) => (
  <div className="grid gap-1">
    {Array.from({ length: n }, (_, i) => (
      <span
        key={`o${i}`}
        className="relative flex h-4 items-center justify-between overflow-hidden rounded-sm px-1.5"
      >
        <span
          className={`absolute inset-y-0 right-0 ${i < n / 2 ? 'bg-accent/25' : 'bg-primary/20'}`}
          style={{ width: `${30 + ((i * 17) % 60)}%` }}
        />
        <Num className="relative">
          {(64210 + (i < n / 2 ? n / 2 - i : -(i - n / 2 + 1)) * 6.5).toFixed(1)}
        </Num>
        <Num className="relative text-foreground-muted">{(0.2 + i * 0.37).toFixed(2)}</Num>
      </span>
    ))}
  </div>
);

export const DEVICES: Record<PortfolioKind, Device[]> = {
  exchange: ['browser', 'browser', 'browser'],
  data: ['browser', 'browser', 'browser'],
  audio: ['browser', 'browser', 'browser'],
  chat: ['browser', 'browser', 'browser'],
  delivery: ['phone', 'phone', 'phone'],
  crm: ['browser', 'browser', 'browser'],
  mvp: ['phone', 'browser', 'browser'],
  cloud: ['browser', 'browser', 'browser'],
  webgl: ['browser', 'browser', 'browser'],
  wasm: ['browser', 'browser', 'browser'],
};

export const SCENES: Record<PortfolioKind, React.ReactNode[]> = {
  exchange: [
    <div key="a" className="flex h-full">
      <Side />
      <div className="grid min-w-0 flex-1 grid-cols-3 gap-3 p-3">
        <div className="col-span-2 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Num className="font-semibold text-sm">BTC/USDT</Num>
            <Num className="text-primary">64,210.5</Num>
            <Num className="text-accent">-1.2%</Num>
          </div>
          <Card className="min-h-0 flex-1">
            <Candles />
          </Card>
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <Card key={`k${i}`} className="grid gap-1.5 p-2">
                <Line w="w-8" />
                <Num>{(1.2 + i * 3.7).toFixed(1)}K</Num>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Orders n={10} />
          <Btn className="mt-auto">BUY</Btn>
          <Btn tone="accent">SELL</Btn>
        </div>
      </div>
    </div>,
    <div key="b" className="flex h-full">
      <Side items={4} />
      <div className="grid min-w-0 flex-1 gap-3 p-3">
        <div className="grid grid-cols-3 gap-3">
          {['BTC', 'ETH', 'USDT'].map((s, i) => (
            <Card key={s} className="grid gap-2">
              <Num className="text-foreground-muted">{s}</Num>
              <Num className="font-semibold text-base">{(2.4 + i * 4.1).toFixed(3)}</Num>
              <Spark data={i % 2 ? wave : rise} />
            </Card>
          ))}
        </div>
        <Card className="flex items-center gap-5">
          <Ring value={68}>68%</Ring>
          <div className="grid flex-1 gap-2">
            <Line w="w-2/3" />
            <Line w="w-1/2" />
            <Line w="w-3/4" />
          </div>
        </Card>
        <div className="grid gap-2">
          {[0, 1, 2].map((i) => (
            <div key={`t${i}`} className="flex items-center gap-3">
              <Avatar />
              <Line w="w-1/3" />
              <Num className="ml-auto">{(0.4 + i * 1.1).toFixed(2)}</Num>
            </div>
          ))}
        </div>
      </div>
    </div>,
    <div key="c" className="grid h-full place-items-center bg-surface">
      <Card className="grid w-64 gap-3 p-4 shadow-lg">
        <Line w="w-1/2" className="h-2.5" />
        <div className="grid gap-2">
          <span className="h-7 rounded-md border border-border" />
          <span className="h-7 rounded-md border border-border" />
        </div>
        <div className="flex gap-2">
          <Btn className="flex-1">BUY</Btn>
          <Btn tone="line" className="flex-1">
            SELL
          </Btn>
        </div>
        <div className="flex items-center gap-2">
          <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground text-xs">
            ✓
          </span>
          <Line w="w-2/3" />
        </div>
      </Card>
    </div>,
  ],
  data: [
    <div key="a" className="flex h-full">
      <Side />
      <div className="min-w-0 flex-1 p-3">
        <Card className="grid gap-2 p-2">
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Line key={`h${i}`} w="w-10" className="bg-foreground/30" />
            ))}
          </div>
          {Array.from({ length: 9 }, (_, r) => (
            <div key={`r${r}`} className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((c) => (
                <span
                  key={`c${c}`}
                  className={`h-4 rounded ${(r * 3 + c) % 7 === 0 ? 'bg-accent/60' : 'bg-foreground/8'}`}
                />
              ))}
            </div>
          ))}
        </Card>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {[88, 64, 92, 41, 77].map((v) => (
            <div key={v} className="h-10">
              <Bars data={[v, v - 12, v - 4]} />
            </div>
          ))}
        </div>
      </div>
    </div>,
    <div key="b" className="grid h-full grid-cols-3 gap-3 p-4">
      <Card className="grid place-items-center">
        <Ring value={92} className="size-28">
          92
        </Ring>
      </Card>
      <div className="col-span-2 grid gap-3">
        {['w-11/12', 'w-4/5', 'w-2/3', 'w-5/6'].map((w) => (
          <Card key={w} className="grid gap-2 p-2.5">
            <Line w="w-1/4" />
            <span className="h-2 rounded-full bg-foreground/8">
              <span className={`block h-2 rounded-full bg-primary ${w}`} />
            </span>
          </Card>
        ))}
      </div>
    </div>,
    <div key="c" className="flex h-full flex-col gap-3 p-4">
      <div className="flex gap-2">
        <Avatar />
        <Card className="max-w-xs">
          <Line w="w-48" className="mb-1.5" />
          <Line w="w-32" />
        </Card>
      </div>
      <Card className="ml-auto grid max-w-xs gap-2 border-accent">
        <Line w="w-40" />
        <Line w="w-28" />
        <div className="flex gap-2">
          <Btn>OK</Btn>
          <Btn tone="line">×</Btn>
        </div>
      </Card>
      <div className="mt-auto h-8 rounded-lg border border-border" />
    </div>,
  ],
  audio: [
    <div key="a" className="grid h-full place-items-center p-6">
      <div className="grid w-full max-w-md gap-4">
        <div className="flex gap-4">
          <span className="size-24 flex-none rounded-xl bg-gradient-to-br from-primary to-accent" />
          <div className="grid flex-1 content-center gap-2">
            <Line w="w-2/3" className="h-2.5" />
            <Line w="w-1/3" />
          </div>
        </div>
        <div className="flex h-16 items-center gap-1">
          {wave.concat(wave).map((v, i) => (
            <span
              key={`w${i}`}
              className={`flex-1 rounded-full ${i < 17 ? 'bg-primary' : 'bg-foreground/15'}`}
              style={{ height: `${v + 10}%` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-4">
          <span className="size-5 rounded-full bg-foreground/15" />
          <span className="size-9 rounded-full bg-primary" />
          <span className="size-5 rounded-full bg-foreground/15" />
        </div>
      </div>
    </div>,
    <div key="b" className="grid h-full grid-cols-4 gap-3 p-4">
      {[40, 70, 55, 85].map((v, i) => (
        <Card key={v} className="flex flex-col items-center gap-3">
          <Line w="w-8" />
          <div className="relative w-1.5 flex-1 rounded-full bg-foreground/10">
            <span
              className="absolute inset-x-0 bottom-0 rounded-full bg-primary"
              style={{ height: `${v}%` }}
            />
            <span
              className="absolute -inset-x-2 h-3 rounded bg-accent"
              style={{ bottom: `${v - 4}%` }}
            />
          </div>
          <span className={`size-3 rounded-full ${i === 2 ? 'bg-accent' : 'bg-primary'}`} />
        </Card>
      ))}
    </div>,
    <div key="c" className="grid h-full gap-3 p-4">
      <div className="grid grid-cols-3 gap-3">
        {['23', '48', '99.9'].map((n) => (
          <Card key={n} className="grid gap-1.5">
            <Line w="w-10" />
            <Num className="font-semibold text-base">{n}</Num>
          </Card>
        ))}
      </div>
      <Card className="min-h-0">
        <Spark data={flat} />
      </Card>
    </div>,
  ],
  chat: [
    <div key="a" className="flex h-full">
      <Side items={6} />
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3">
        <div className="flex gap-2">
          <Avatar />
          <Card className="p-2">
            <Line w="w-44" className="mb-1.5" />
            <Line w="w-24" />
          </Card>
        </div>
        <div className="flex flex-row-reverse gap-2">
          <Avatar className="bg-accent/50" />
          <span className="rounded-lg bg-primary p-2">
            <span className="block h-1.5 w-36 rounded-full bg-primary-foreground/60" />
          </span>
        </div>
        <div className="flex gap-2">
          <Avatar />
          <Card className="p-2">
            <Line w="w-56" />
          </Card>
        </div>
        <div className="mt-auto flex gap-2">
          <span className="h-8 flex-1 rounded-lg border border-border" />
          <Btn>→</Btn>
        </div>
      </div>
    </div>,
    <div key="b" className="relative grid h-full grid-cols-2 gap-2 bg-foreground/90 p-3">
      {[0, 1, 2, 3].map((i) => (
        <span key={`t${i}`} className="grid place-items-center rounded-lg bg-surface-raised/10">
          <span className={`size-12 rounded-full ${i === 1 ? 'bg-accent' : 'bg-primary/60'}`} />
        </span>
      ))}
      <span className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        <span className="size-7 rounded-full bg-surface-raised/25" />
        <span className="size-7 rounded-full bg-accent" />
        <span className="size-7 rounded-full bg-surface-raised/25" />
      </span>
    </div>,
    <div key="c" className="relative grid h-full place-items-center bg-surface">
      <div className="flex items-center gap-8">
        {['bg-primary', 'bg-accent', 'bg-primary/60'].map((c, i) => (
          <span key={c} className="flex items-center gap-8">
            <span className={`grid size-16 place-items-center rounded-xl ${c}`}>
              <Line w="w-8" className="bg-surface-raised/70" />
            </span>
            {i < 2 ? <span className="h-px w-10 bg-foreground/30" /> : null}
          </span>
        ))}
      </div>
    </div>,
  ],
  delivery: [
    <div key="a" className="grid gap-2.5 p-3">
      <span className="h-8 rounded-lg border border-border" />
      {[0, 1, 2, 3].map((i) => (
        <Card key={`d${i}`} className="grid gap-1.5 p-2.5">
          <div className="flex items-center justify-between">
            <Line w="w-16" />
            <Num className="text-primary">{12 + i * 7}€</Num>
          </div>
          <Line w="w-24" />
          <div className="flex gap-1.5">
            <Avatar className="size-4" />
            <Line w="w-10" />
          </div>
        </Card>
      ))}
    </div>,
    <div key="b" className="relative h-full bg-primary/8">
      <svg viewBox="0 0 200 400" className="absolute inset-0 size-full" aria-hidden="true">
        <path
          d="M20 70 C90 90 40 180 110 210 S170 300 150 340"
          fill="none"
          className="stroke-primary"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="1 9"
        />
        <circle cx="20" cy="70" r="7" className="fill-primary" />
        <circle cx="150" cy="340" r="9" className="fill-accent" />
      </svg>
      <Card className="absolute inset-x-3 bottom-3 grid gap-2">
        <div className="flex gap-2">
          <Avatar />
          <Line w="w-20" className="mt-2" />
        </div>
        <Btn>GO</Btn>
      </Card>
    </div>,
    <div key="c" className="grid place-items-center gap-4 p-4">
      <span className="mt-6 grid size-32 grid-cols-5 gap-0.5 rounded-xl bg-foreground p-2">
        {Array.from({ length: 25 }, (_, i) => (
          <span
            key={`q${i}`}
            className={(i * 7) % 3 === 0 || i % 4 === 0 ? 'bg-surface-raised' : 'bg-foreground'}
          />
        ))}
      </span>
      <Line w="w-24" />
      <Btn>OK</Btn>
    </div>,
  ],
  crm: [
    <div key="a" className="flex h-full">
      <Side />
      <div className="grid min-w-0 flex-1 gap-3 p-3">
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Card key={`k${i}`} className="grid gap-1.5 p-2">
              <Line w="w-8" />
              <Num className="font-semibold text-sm">{12 + i * 9}K</Num>
            </Card>
          ))}
        </div>
        <Card className="h-32">
          <Bars data={[40, 55, 35, 70, 52, 80, 62, 90]} accent={7} />
        </Card>
        <div className="grid gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={`r${i}`} className="flex items-center gap-2">
              <Avatar className="size-4" />
              <Line w="w-1/3" />
              <Line w="w-12" className="ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>,
    <div key="b" className="grid h-full grid-cols-4 gap-3 bg-surface p-3">
      {[3, 2, 2, 1].map((n, c) => (
        <div key={`col${c}`} className="grid content-start gap-2">
          <Line w="w-12" className="bg-foreground/30" />
          {Array.from({ length: n }, (_, i) => (
            <Card key={`cd${c}${i}`} className="grid gap-1.5 p-2">
              <Line w="w-4/5" />
              <Line w="w-1/2" />
              <Avatar className="size-4" />
            </Card>
          ))}
        </div>
      ))}
    </div>,
    <div key="c" className="flex h-full">
      <Side items={4} />
      <div className="grid min-w-0 flex-1 gap-3 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10" />
          <div className="grid gap-1.5">
            <Line w="w-24" className="h-2" />
            <Line w="w-16" />
          </div>
          <Btn className="ml-auto">+</Btn>
        </div>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={`l${i}`} className="grid grid-cols-4 gap-2 border-border border-b pb-2">
            <Line w="w-16" />
            <Line w="w-12" />
            <Line w="w-14" />
            <Num className="justify-self-end">{120 + i * 37}</Num>
          </div>
        ))}
      </div>
    </div>,
  ],
  mvp: [
    <div key="a" className="grid content-start gap-3 p-4">
      <span className="grid h-36 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent">
        <span className="size-12 rounded-full bg-surface-raised/80" />
      </span>
      <Line w="w-32" className="h-2.5" />
      <Line />
      <Line w="w-3/4" />
      <Btn className="mt-3 h-8">START</Btn>
      <span className="mx-auto mt-1 flex gap-1.5">
        <span className="size-1.5 rounded-full bg-primary" />
        <span className="size-1.5 rounded-full bg-foreground/20" />
        <span className="size-1.5 rounded-full bg-foreground/20" />
      </span>
    </div>,
    <div key="b" className="grid h-full content-start gap-5 p-8">
      <div className="flex items-center gap-2">
        <span className="h-5 w-12 rounded bg-primary" />
        <Line w="w-12" className="ml-auto" />
        <Line w="w-12" />
        <Btn>CTA</Btn>
      </div>
      <Line w="w-2/3" className="h-4" />
      <Line w="w-1/2" className="h-4" />
      <div className="grid grid-cols-3 gap-3 pt-4">
        {[0, 1, 2].map((i) => (
          <Card key={`f${i}`} className="grid gap-2 p-3">
            <span className={`size-6 rounded-md ${i === 1 ? 'bg-accent' : 'bg-primary/70'}`} />
            <Line w="w-2/3" />
            <Line />
          </Card>
        ))}
      </div>
    </div>,
    <div key="c" className="flex h-full">
      <Side items={4} />
      <div className="grid min-w-0 flex-1 gap-3 p-3">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <Card key={`k${i}`} className="grid gap-1.5 p-2">
              <Line w="w-8" />
              <Num className="font-semibold">{(1 + i * 4.2).toFixed(1)}K</Num>
            </Card>
          ))}
        </div>
        <Card className="min-h-0 flex-1">
          <Spark data={rise} />
        </Card>
      </div>
    </div>,
  ],
  cloud: [
    <div key="a" className="grid h-full grid-cols-3 gap-3 bg-surface p-3">
      {[rise, wave, flat, wave, rise, flat].map((d, i) => (
        <Card key={`p${i}`} className="grid grid-rows-fill gap-2 p-2.5">
          <Line w="w-12" />
          <Spark data={d} fill={i % 2 === 0} />
        </Card>
      ))}
    </div>,
    <div key="b" className="grid h-full place-items-center p-6">
      <div className="flex items-center gap-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={`s${i}`} className="flex items-center gap-3">
            <span className="grid gap-2 rounded-lg border border-border p-3 text-center">
              <span
                className={`mx-auto grid size-7 place-items-center rounded-full text-xs ${i < 4 ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}`}
              >
                {i < 4 ? '✓' : '…'}
              </span>
              <Line w="w-10" />
            </span>
            {i < 4 ? <span className="h-px w-4 bg-foreground/30" /> : null}
          </span>
        ))}
      </div>
    </div>,
    <div key="c" className="grid h-full grid-cols-4 content-start gap-3 p-4">
      {Array.from({ length: 4 }, (_, n) => (
        <Card key={`n${n}`} className="grid gap-2 p-2">
          <Line w="w-10" />
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 8 }, (_, i) => (
              <span
                key={`pod${n}${i}`}
                className={`aspect-square rounded-sm ${(n * 3 + i) % 9 === 0 ? 'bg-accent' : 'bg-primary/70'}`}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>,
  ],
  webgl: [
    <div key="a" className="grid h-full grid-cols-3">
      <div className="relative col-span-2 grid place-items-center bg-foreground">
        <span className="size-44 rounded-full bg-gradient-to-br from-accent via-primary to-foreground shadow-2xl" />
        <span className="absolute size-44 rounded-full bg-gradient-to-tr from-transparent via-transparent to-surface-raised/25" />
        <span className="absolute bottom-3 left-3 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={`d${i}`} className="size-4 rounded-full bg-surface-raised/30" />
          ))}
        </span>
      </div>
      <div className="grid content-start gap-4 p-4">
        <Line w="w-16" className="h-2.5" />
        {['bg-primary', 'bg-accent', 'bg-foreground', 'bg-primary/40'].map((c) => (
          <span key={c} className="flex items-center gap-2">
            <span className={`size-5 rounded-full ${c}`} />
            <Line w="w-12" />
          </span>
        ))}
        <span className="h-1.5 rounded-full bg-foreground/10">
          <span className="block h-1.5 w-2/3 rounded-full bg-primary" />
        </span>
        <Btn>ADD</Btn>
      </div>
    </div>,
    <div key="b" className="relative h-full bg-foreground">
      {Array.from({ length: 90 }, (_, i) => {
        const a = i * 2.4;
        const r = 12 + ((i * 5.3) % 42);
        return (
          <span
            key={`p${i}`}
            className={`absolute size-1.5 rounded-full ${i % 11 === 0 ? 'bg-accent' : 'bg-primary'}`}
            style={{
              left: `${50 + Math.cos(a) * r}%`,
              top: `${50 + Math.sin(a) * r * 0.8}%`,
              opacity: 0.4 + (i % 5) * 0.12,
            }}
          />
        );
      })}
    </div>,
    <div key="c" className="flex h-full">
      <div className="grid w-40 flex-none content-start gap-2 border-border border-r bg-surface p-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={`n${i}`}
            className="flex items-center gap-2"
            style={{ paddingLeft: (i % 3) * 10 }}
          >
            <span className="size-2 rounded-sm bg-primary/60" />
            <Line w="w-14" />
          </span>
        ))}
      </div>
      <div className="relative grid min-w-0 flex-1 place-items-center bg-foreground">
        <span className="size-24 rotate-12 rounded-xl bg-gradient-to-br from-primary to-accent" />
      </div>
    </div>,
  ],
  wasm: [
    <div key="a" className="flex h-full">
      <div className="grid w-40 flex-none content-start gap-3 border-border border-r bg-surface p-3">
        <Line w="w-12" className="h-2.5" />
        {[70, 40, 85, 55].map((v) => (
          <span key={v} className="grid gap-1.5">
            <Line w="w-14" />
            <span className="h-1.5 rounded-full bg-foreground/10">
              <span className="block h-1.5 rounded-full bg-primary" style={{ width: `${v}%` }} />
            </span>
          </span>
        ))}
      </div>
      <div className="relative min-w-0 flex-1 bg-foreground/90 p-4">
        <span className="block size-full rounded-lg bg-gradient-to-br from-accent via-primary to-foreground" />
        <span className="absolute top-6 right-6 rounded-md bg-surface-raised px-2 py-1 font-mono text-xs">
          WASM 12ms
        </span>
      </div>
    </div>,
    <div key="b" className="grid h-full content-center gap-5 p-8">
      {[
        ['JS', 88, 'bg-foreground/30'],
        ['WASM', 22, 'bg-primary'],
      ].map(([l, v, c]) => (
        <div key={l as string} className="grid gap-1.5">
          <Num>{l}</Num>
          <span className="h-7 rounded-md bg-foreground/8">
            <span className={`block h-7 rounded-md ${c as string}`} style={{ width: `${v}%` }} />
          </span>
        </div>
      ))}
      <Num className="text-foreground-muted">4.0x</Num>
    </div>,
    <div key="c" className="grid h-full grid-rows-fill-last gap-3 p-4">
      <span className="rounded-lg bg-gradient-to-r from-primary via-accent to-foreground" />
      <div className="grid gap-1.5">
        {[0, 1].map((r) => (
          <div key={`tr${r}`} className="flex gap-1">
            {Array.from({ length: 6 }, (_, i) => (
              <span
                key={`c${r}${i}`}
                className={`h-5 rounded ${(i + r) % 3 === 0 ? 'bg-accent/70' : 'bg-primary/50'}`}
                style={{ flex: 1 + ((i * r + i) % 3) }}
              />
            ))}
          </div>
        ))}
        <span className="relative h-1 rounded-full bg-foreground/10">
          <span className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-primary" />
        </span>
      </div>
    </div>,
  ],
};
