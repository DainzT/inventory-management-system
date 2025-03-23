import React from 'react';

export interface ProductItemProps {
  name: string;
  price: number;
  description: string;
  stock: number;
}

const ProductItem: React.FC<ProductItemProps> = ({
  name,
  price,
  description,
  stock
}) => {
  return (
    <div className="bg-gray-50 rounded-md p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{name}</h3>
        <span className="text-teal-600 font-medium">₱{price.toFixed(2)}</span>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Stock Available:</span>
        <span className="font-medium">{stock}</span>
      </div>
    </div>
  );
};

export default ProductItem;