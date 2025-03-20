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
        dateCreated: new Date(),
    }); 

    const [errors, setErrors] = useState<{ [key in keyof ProductFormData]?: string }>({});

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

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: "",
        }));
    };
    
    const validateForm = () => {
        const newErrors: { [key in keyof ProductFormData]?: string } = {};
        if (!productData.productName.trim()) newErrors.productName = "Product name is required.";
        if (!productData.note.trim()) newErrors.note = "Note is required.";
        if (productData.quantity === "" || Number(productData.quantity) <= 0) newErrors.quantity = "Enter a valid quantity.";
        if (productData.unitPrice === "" || Number(productData.unitPrice) <= 0) newErrors.unitPrice = "Enter a valid price.";
        if (productData.unitSize === "" || Number(productData.unitSize) <= 0) newErrors.unitSize = "Enter a valid unit size.";
        if (!productData.selectUnit.trim() || productData.selectUnit.trim() === "Unit") newErrors.selectUnit = "Please select a unit.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; 
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSubmit(productData); 
    };

    return (
        
        <form onSubmit={handleFormSubmit}  className="flex flex-col gap-3.5">
            <InputField
                label="Product Name"
                required
                value={productData.productName}
                onChange={(value) => handleInputChange("productName", value)}
                placeholder={"Enter product name"}
                error={errors.productName}
            />
            <InputField
                label="Note"
                required
                type="textarea"
                value={productData.note}
                onChange={(value) => handleInputChange("note", value)}
                placeholder={"Enter note"}
                error={errors.note}
            />
            <div className="flex gap-6">
                <QuantityInput
                    required
                    value={productData.quantity}
                    onChange={(value) => handleInputChange("quantity", value)} 
                    error={errors.quantity}
                />

                <UnitSelector
                    value={productData.selectUnit}
                    onChange={(value) => handleInputChange("selectUnit", value)} 
                    error={errors.selectUnit}
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
                error={{
                    unitPrice: errors.unitPrice,
                    unitSize: errors.unitSize,
                }}
            />
            <PriceInput 
                label="Total" 
                value={productData.total} 
                readonly 
            />
            
            <div className="flex justify-end gap-4">
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
