"use client";

type Stat = {
  value: string;
  label: string;
};

type StatsBlockProps = {
  stats: Stat[];
};

export function StatsBlock({ stats }: StatsBlockProps) {
  return (
    <div className="border-b border-brand-border bg-transparent px-0 py-8 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3 sm:gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-start">
            <p className="font-heading text-stat font-black text-brand-text">{stat.value}</p>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
