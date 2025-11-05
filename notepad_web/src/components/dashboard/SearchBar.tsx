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
    </header>
  );
}
