interface RichContentProps {
  html: string;
  className?: string;
}

export default function RichContent({ html, className = "" }: RichContentProps) {
  const isHtml = html?.trim().startsWith("<");
  if (!isHtml) {
    return <span className={className}>{html}</span>;
  }
  return (
    <div
      className={`rich-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
