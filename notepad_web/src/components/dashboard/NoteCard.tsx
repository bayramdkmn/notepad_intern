type Props = {
  title: string;
  description: string;
  updatedText: string;
  tags: string[];
};

export default function NoteCard({
  title,
  description,
  updatedText,
  tags,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-xl p-5 bg-white border border-gray-200 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer dark:bg-[#242424] dark:border-transparent hover:scale-95 duration-400 select-none">
      <div>
        <p className="text-gray-900 text-lg font-bold dark:text-white">
          {title}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 text-gray-500 text-xs font-medium dark:border-zinc-700 dark:text-gray-400">
        <span>{updatedText}</span>
        <div className="flex gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-500/20 dark:text-blue-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
