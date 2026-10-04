import { Reveal } from "@/components/motion/reveal";

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="text-accent mb-3 font-mono text-xs tracking-[0.18em] uppercase">
        {index} / {eyebrow}
      </p>
      <h2 className="text-4xl font-semibold text-balance md:text-5xl">{title}</h2>
      {intro ? <p className="text-muted mt-4 text-lg text-pretty">{intro}</p> : null}
    </Reveal>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-[1200px] px-5 py-24 md:py-32 ${className}`}>
      {children}
    </section>
  );
}
