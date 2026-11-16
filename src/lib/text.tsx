/**
 * Impede que palavras com hífen ("e-commerce", "front-end") quebrem no meio em títulos grandes.
 */
export function keepHyphenated(text: string) {
  return text.split(/(\S+-\S+)/g).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
