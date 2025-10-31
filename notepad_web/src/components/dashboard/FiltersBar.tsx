export default function FiltersBar() {
  return (
    <div className="pt-0">
      <div className="flex gap-2 sm:gap-3 pb-8 overflow-x-auto">
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 px-4 text-primary text-sm font-medium">
          Tümü
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 px-4 dark:bg-[#242424] dark:border-transparent dark:hover:bg-[#333333]">
          <p className="text-gray-700 text-sm font-medium dark:text-[#E0E0E0]">
            İş
          </p>
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 px-4 dark:bg-[#242424] dark:border-transparent dark:hover:bg-[#333333]">
          <p className="text-gray-700 text-sm font-medium dark:text-[#E0E0E0]">
            Kişisel
          </p>
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 px-4 dark:bg-[#242424] dark:border-transparent dark:hover:bg-[#333333]">
          <p className="text-gray-700 text-sm font-medium dark:text-[#E0E0E0]">
            Proje X
          </p>
        </button>
      </div>
    </div>
  );
}
