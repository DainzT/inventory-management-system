import { useEffect, useState } from "react";
import { Button } from "../AddProductModal/Button";
import { InputField } from "../AddProductModal/InputField";
import { PriceInput } from "../AddProductModal/PriceInput";
import { QuantityInput } from "../AddProductModal/QuantityInput";
import { UnitSelector } from "../AddProductModal/UnitSelector";
import DeleteButton from "./DeleteButton";
import { InventoryItem } from "@/types";

interface EditProductFormProps {
    initialData: InventoryItem;
    onSubmit: (data: InventoryItem) => void;
    onDelete: (data: InventoryItem) => void
    onFormChange: (hasChanges: boolean) => void;
}

const EditProductForm = ({
    initialData,
    onSubmit,
    onDelete,
    onFormChange,
}: EditProductFormProps) => {
    const [productData, setProductData] = useState<InventoryItem>({
        id: initialData.id,
        name: initialData?.name || "",
        note: initialData?.note || "",
        quantity: initialData?.quantity || "",
        selectUnit: initialData?.selectUnit || "Unit",
        unitPrice: initialData?.unitPrice || "",
        unitSize: initialData?.unitSize || "",
        total: initialData?.total || "",
        dateCreated: initialData?.dateCreated || new Date(),
        lastUpdated: new Date(),
    });
    const [errors, setErrors] = useState<{ [key in keyof InventoryItem]?: string }>({});

    useEffect(() => {
        setProductData((current) => ({
            ...current,
            total: Number(current.unitPrice) * (Number(current.quantity) / Number(current.unitSize)),
        }));
    }, [productData.quantity, productData.unitPrice, productData.unitSize]);

    useEffect(() => {
        const changed = Object.keys(productData).some(key => {
            if (key === 'lastUpdated'  || key === 'total') return false;
            const currentValue = productData[key as keyof InventoryItem];
            const initialValue = initialData[key as keyof InventoryItem];
            return currentValue != initialValue
        });
        onFormChange(changed);
    }, [productData, initialData, onFormChange]);

    const handleInputChange = (field: keyof InventoryItem, value: string | number) => {
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
        const newErrors: { [key in keyof InventoryItem]?: string } = {};
        if (!productData.name.trim()) newErrors.name = "Product name is required.";
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

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3.5">
            <InputField
                label="Product Name"
                required
                value={productData.name}
                onChange={(value) => handleInputChange("name", value)}
                placeholder={"Enter product name"}
                error={errors.name}
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
                unitChange={(value) => handleInputChange("unitSize", value)}
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

            <div className="flex gap-20">
                <DeleteButton
                    onClick={() => onDelete(initialData)}
                    className="text-s"
                >
                    Delete
                </DeleteButton>
                <div className="flex item-center justify-end ">
                    <Button
                        type="submit"
                        className="text-s h-[3rem]"
                    >
                        Confirm Changes
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default EditProductForm;
