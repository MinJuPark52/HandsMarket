import React, { useState } from "react";
import Comment from "../product/comment";
import Recommend from "../product/recommend";

interface CategoryProps {
  product: {
    id: string;
    tags?: string[];
    author?: {
      detailImages?: string;
    };
  };
}

const tabs = [
  {
    key: "details",
    label: "상품 상세보기",
  },
  {
    key: "comments",
    label: "댓글",
  },
  {
    key: "recommend",
    label: "추천 상품",
  },
];

const Category: React.FC<CategoryProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="mx-auto w-[1024px] mt-5 border-t border-gray-300">
      {/* 탭 메뉴 */}
      <div className="flex mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 p-4 ${
              activeTab === tab.key
                ? "text-gray-600 border-b-4 border-gray-700 font-semibold"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 내용 영역 */}
      <div className="p-2">
        {activeTab === "details" && (
          <div>
            {product.author?.detailImages && (
              <img
                src={product.author.detailImages}
                alt="상품 상세 이미지"
                className="w-full h-auto"
              />
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div>
            <Comment postId="test-post-123" />
          </div>
        )}

        {activeTab === "recommend" && (
          <div>
            <Recommend
              tags={product.tags || []}
              currentProductId={product.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
