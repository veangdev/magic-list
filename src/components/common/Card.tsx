export function Card({
  title,
  className = '',
  children
}: {
  title: string;
  className?: string;
    children?: React.ReactNode;
}) {
  return (
    <article
      className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg  ${className}`}
    >
      <h1 className="text-[20px] dark:text-white mt-5">{title}</h1>
      <div className="p-4">
        {children}
      </div>
    </article>
  );
}