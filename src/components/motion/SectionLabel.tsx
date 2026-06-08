type SectionLabelProps = {
  number: string;
  label: string;
};

export function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <div className="section-label mb-6 inline-flex items-center gap-2">
      <span className="section-label-num">{number}</span>
      <span className="section-label-divider" aria-hidden>
        /
      </span>
      <span className="section-label-text">{label}</span>
    </div>
  );
}
