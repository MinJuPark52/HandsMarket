import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Product {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
}

const ProducDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`/products.json`)
      .then((response) => response.json())
      .then((data) => {
        const productDetail = data.find(
          (item: Product) => item.id === Number(id)
        );
        setProduct(productDetail || null);
      })
      .catch((error) => console.error("Error loading product data:", error));
  }, [id]);

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="max-w-[1020px] mt-2">
        <div className="flex">
          <img
            src={product.image}
            alt={product.title}
            className="h-[400px] w-auto object-contain"
          />
          <div className="ml-6">
            <h2 className="text-2xl font-semibold">{product.title}</h2>
            <p>{product.description}</p>
            <p className="font-semibold mt-4">${product.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducDetailPage;
