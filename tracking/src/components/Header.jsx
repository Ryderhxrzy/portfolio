/**
 * Header component for app pages
 * Shows page title and sweet message
 */

const Header = ({ title }) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <p className="text-xs sm:text-sm italic text-gray-600 dark:text-gray-400 text-right">
            jan na nakakakilig para sa asawa ko kasi para sa kanya to
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;

