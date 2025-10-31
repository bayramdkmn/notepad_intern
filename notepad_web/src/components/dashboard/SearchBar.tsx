export default function SearchBar() {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
      <div className="w-full flex-1">
        <label className="flex flex-col w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-12 bg-white border border-gray-200 focus-within:border-neutral-600 focus-within:ring-2 focus-within:ring-neutral-600/20 dark:bg-[#242424] dark:border-transparent">
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-500 pl-2 text-base font-normal leading-normal dark:text-[#E0E0E0]"
              placeholder="Anlam tabanlı arama yapın..."
            />
          </div>
        </label>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 px-4 dark:bg-[#242424] dark:border-transparent dark:hover:bg-[#333333]">
          <p className="text-gray-700 text-sm font-medium dark:text-[#E0E0E0]">
            Filtrele
          </p>
        </button>
        <button className="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 px-4 dark:bg-[#242424] dark:border-transparent dark:hover:bg-[#333333]">
          <p className="text-gray-700 text-sm font-medium dark:text-[#E0E0E0]">
            Sırala
          </p>
        </button>
      </div>
    </header>
  );
}
