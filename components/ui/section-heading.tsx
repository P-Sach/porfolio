interface SectionHeadingProps {
  title: string;
  subtitle: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold mb-4">{title}</h2>
      <p className="text-lg text-muted-foreground">{subtitle}</p>
    </div>
  );
} 