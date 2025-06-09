import React, { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
  onSelect?: (category: Category) => void;
}

const CategoryList: React.FC<Props> = ({ categories, onSelect }) => {
  const [selectedId, setSelectedId] = useState<number | null>(
    categories.length > 0 ? categories[0].id : null
  );

  useEffect(() => {
    if (categories.length > 0 && onSelect) {
      onSelect(categories[0]);
    }
  }, [categories, onSelect]);

  const handleClick = (category: Category) => {
    setSelectedId(category.id);
    onSelect?.(category);
  };

  return (
    <div className="w-[1024px] mx-auto bg-white rounded-2xl flex justify-between">
      {categories.map((category) => {
        const isSelected = category.id === selectedId;
        return (
          <button
            key={category.id}
            onClick={() => handleClick(category)}
            className={`
              flex flex-col items-center justify-center w-1/4
              py-4 font-semibold text-center
              transition-colors 
              ${
                isSelected
                  ? "text-gray-700 border-b border-gray-600"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-600"
              }
              cursor-pointer
            `}
            type="button"
          >
            <span className="text-lg">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryList;
