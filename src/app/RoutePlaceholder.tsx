type RoutePlaceholderProps = {
  title: string;
};

export function RoutePlaceholder({ title }: RoutePlaceholderProps) {
  return (
    <section aria-labelledby="placeholder-title">
      <h1 id="placeholder-title">{title}</h1>
      <p>Coming soon</p>
    </section>
  );
}
