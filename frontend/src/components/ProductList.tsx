import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import apiClient from "../api/client";

const ProductList: React.FC = () => {
  //   const { data, isLoading, error } = useQuery(["products"], async () => {
  //     const response = await apiClient.get("/products");
  //     return response.data;
  //   });

  //   if (isLoading) return <div>Loading...</div>;
  //   if (error) return <div>Error loading products</div>;

  return (
    <ul>
      {/* {data.map((product: any) => (
        <li key={product.id}>
          {product.name} - {product.quantity}
        </li>
      ))} */}
    </ul>
  );
};

export default ProductList;
