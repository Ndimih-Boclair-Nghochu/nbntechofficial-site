import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders trusted case-study markdown with the site's prose styling. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-nbn">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
