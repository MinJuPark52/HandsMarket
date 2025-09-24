interface Category {
  id?: number;
  name: string;
  type?: "home" | "best";
}

interface Props {
  categories: Category[];
  selectedCategoryId: number;
  onSelect?: (category: Category) => void;
}

const CategoryList: React.FC<Props> = ({
  categories,
  selectedCategoryId,
  onSelect,
}) => {
  const handleClick = (category: Category) => {
    onSelect?.(category);
  };

  return (
    <div className="max-w-[768px] mx-auto flex justify-between">
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId;
        return (
          <button
            key={category.id || category.name}
            onClick={() => handleClick(category)}
            className={`
              flex flex-col items-center justify-center w-1/4
              p-2 text-center
              transition-colors 
              ${
                isSelected
                  ? "text-gray-700 border-b border-gray-600 dark:text-white dark:border-white-600"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-600"
              }
              cursor-pointer
            `}
            type="button"
            aria-pressed={isSelected}
          >
            <span className="font-semibold text-sm">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryList;
