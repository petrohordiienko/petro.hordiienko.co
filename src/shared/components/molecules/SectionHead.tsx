import { Heading } from '@/shared/components/atoms/Heading';
import { Label } from '@/shared/components/atoms/Label';
import { cn } from '@/shared/lib/cn';

export function SectionHead({
  label,
  title,
  muted,
  sub,
  tone = 'default',
}: {
  label: string;
  title: string;
  muted?: string;
  sub?: string;
  tone?: 'default' | 'band';
}) {
  return (
    <div className="mb-14 grid grid-cols-sec-head gap-6 max-md:mb-9 max-md:grid-cols-1 max-md:gap-3.5">
      <Label className={tone === 'band' ? 'text-primary-foreground/70' : undefined}>{label}</Label>
      <div className="min-w-0">
        <Heading level={2}>
          {title}
          {muted ? (
            <>
              {' '}
              <span
                className={
                  tone === 'band' ? 'text-primary-foreground/55' : 'text-foreground-muted'
                }
              >
                {muted}
              </span>
            </>
          ) : null}
        </Heading>
        {sub ? (
          <p
            className={cn(
              'mt-5 max-w-xl text-lg',
              tone === 'band' ? 'text-primary-foreground/75' : 'text-foreground-muted',
            )}
          >
            {sub}
          </p>
        ) : null}
      </div>
    </div>
  );
}
