import React, { useState } from "react";
import Comment from "../product/comment";
import Recommend from "../product/recommend";

interface CategoryProps {
  product: {
    product_id: number;
    tags?: string[];
    images?: string[];
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
    <div className="mx-auto w-[768px] mt-5 border-t border-gray-300">
      {/* 탭 메뉴 */}
      <div className="flex mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 p-4 ${
              activeTab === tab.key
                ? "text-gray-600 border-b-4 border-gray-700 dark:border-gray-400 font-semibold dark:text-gray-300"
                : "text-gray-600 hover:bg-gray-300 dark:text-gray-500"
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
            {product.images && product.images.length > 1 ? (
              product.images
                .slice(1)
                .map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`상품 상세 이미지 ${idx + 1}`}
                    className="w-full h-auto mb-4"
                  />
                ))
            ) : (
              <p className="text-gray-500">상세 이미지가 없습니다.</p>
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
              currentProductId={String(product.product_id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
