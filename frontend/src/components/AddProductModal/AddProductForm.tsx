import { useEffect, useState } from "react";
import { Button } from "./Button";
import { InputField } from "./InputField";
import { PriceInput } from "./PriceInput";
import { QuantityInput } from "./QuantityInput";
import { UnitSelector } from "./UnitSelector";
import { ProductFormData } from "@/types";

interface ProductFormProps {
    onCancel: () => void;
    onSubmit: (data: ProductFormData) => void;
  }

const AddProductForm = ({ 
    onCancel, 
    onSubmit,
}: ProductFormProps) => {
    const [productData, setProductData] = useState<ProductFormData>({
        productName: "",
        note: "",
        quantity: "",
        selectUnit: "Unit",
        unitPrice: "",
        unitSize: "",
        total: "",
    }); 

    useEffect(() => {
        setProductData((current) => ({
            ...current,
            total: Number(current.unitPrice) * (Number(current.quantity) / Number(current.unitSize)),
        }));
    }, [productData.quantity, productData.unitPrice,  productData.unitSize]);
    
    const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
        setProductData((prevData) => ({
          ...prevData,
          [field]: value,
        }));
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(productData); 
    };

    return (
        
        <form onSubmit={handleFormSubmit}  className="flex flex-col gap-6">
            <InputField
                label="Product Name"
                required
                value={productData.productName}
                onChange={(value) => handleInputChange("productName", value)}
                placeholder={"Enter product name"}
            />
            <InputField
                label="Note"
                required
                type="textarea"
                value={productData.note}
                onChange={(value) => handleInputChange("note", value)}
                placeholder={"Enter note"}
            />
            <div className="flex gap-6">
                <QuantityInput
                    required
                    value={productData.quantity}
                    onChange={(value) => handleInputChange("quantity", value)} 
                />

                <UnitSelector
                    value={productData.selectUnit}
                    onChange={(value) => handleInputChange("selectUnit", value)} 
                />
            </div>
            <PriceInput
                label="Price per Unit"
                required
                value={productData.unitPrice}
                unit={productData.selectUnit}
                unitSize={productData.unitSize}
                quantity={productData.quantity}
                unitChange={(value)  => handleInputChange("unitSize", value)}
                onChange={(value) => handleInputChange("unitPrice", value)}
            />
            <PriceInput 
                label="Total" 
                value={productData.total} 
                readonly 
            />
            
            <div className="flex justify-end gap-4 mt-6">
                <Button 
                    variant="secondary" 
                    onClick={onCancel}
                >
                        Cancel
                </Button>
                <Button 
                    type="submit"
                >
                        Add Product
                </Button>
            </div>
        </form>
    );
};

export default AddProductForm;
