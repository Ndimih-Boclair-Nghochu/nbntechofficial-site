/** Injects one or more JSON-LD structured-data blocks into the page. */
export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const blocks = (Array.isArray(data) ? data : [data]).filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
