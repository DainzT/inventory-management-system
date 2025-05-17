import { useEffect, useState } from "react";
import { Button } from "../AddProductModal/Button";
import { InputField } from "../AddProductModal/InputField";
import { PriceInput } from "../AddProductModal/PriceInput";
import { QuantityInput } from "../AddProductModal/QuantityInput";
import { UnitSelector } from "../AddProductModal/UnitSelector";
import DeleteButton from "./DeleteButton";
import { InventoryItem } from "@/types";
import { ClipLoader } from "react-spinners";

import { roundTo } from "@/utils/RoundTo";

interface EditProductFormProps {
    initialData: InventoryItem;
    onSubmit: (data: InventoryItem) => void;
    onDelete: (data: InventoryItem) => void
    onFormChange: (hasChanges: boolean) => void;
    isEditing: boolean;
    isDeleting: boolean;
}

const MAX_NAME_LENGTH = 40;
const MAX_NOTE_LENGTH = 120;

const EditProductForm = ({
    initialData,
    onSubmit,
    onDelete,
    onFormChange,
    isEditing,
    isDeleting,
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

    const validateField = (field: 'name' | 'note', value: string) => {
        if (field === 'name') {
            if (value.length > 40) return "Maximum 40 characters reached.";
        }
        if (field === 'note') {
            if (value.length > 120) return "Maximum 120 characters reached.";
        }
        return "";
    };

    const validateNumberField = (field: 'unitSize' | 'quantity' | 'unitPrice', value: number) => {
        if (field === 'unitSize') {
            if (value > 10000) return "Cannot exceed 10,000."
        } if (field === 'quantity') {
            if (value > 10000) return "Cannot exceed 10,000."
        } if (field === 'unitPrice') {
            if (value > 1000000) return "Cannot exceed 1,000,000."
        }
        return;
    }

    useEffect(() => {
        setProductData((current) => ({
            ...current,
            total: roundTo(Number(current.unitPrice) * (Number(current.quantity) / Number(current.unitSize)), 2),
        }));

    }, [productData.quantity, productData.unitPrice, productData.unitSize]);

    useEffect(() => {
        const changed = Object.keys(productData).some(key => {
            if (key === 'lastUpdated' || key === 'total') return false;
            const currentValue = productData[key as keyof InventoryItem];
            const initialValue = initialData[key as keyof InventoryItem];
            return currentValue != initialValue
        });
        onFormChange(changed);
    }, [productData, initialData, onFormChange]);

    const handleInputChange = (field: keyof InventoryItem, value: string | number) => {
        let processedValue = value;
        
        if (field === 'name' && typeof value === 'string' && value.length > MAX_NAME_LENGTH) {
            processedValue = value.substring(0, MAX_NAME_LENGTH);
        }
        if (field === 'note' && typeof value === 'string' && value.length > MAX_NOTE_LENGTH) {
            processedValue = value.substring(0, MAX_NOTE_LENGTH);
        }

        if (field === 'quantity' || field === 'unitPrice' || field === 'unitSize') {
            processedValue = roundTo(Number(value), 2) || "";
        }

        setProductData((prevData) => ({
            ...prevData,
            [field]: processedValue,
        }));

        if (field === 'name' || field === 'note') {
            const error = validateField(field, String(value));
            setErrors((prevErrors) => ({
                ...prevErrors,
                [field]: error,
            }));
        } else if (field === 'unitPrice' || field === 'quantity' || field === 'unitSize') {
            const error = validateNumberField(field, Number(value));
            setErrors((prevErrors) => ({
                ...prevErrors,
                [field]: error,
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [field]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key in keyof InventoryItem]?: string } = {};
        if (!productData.name.trim()) newErrors.name = "Product name is required.";
        if (!productData.note.trim()) newErrors.note = "Note is required.";
        if (productData.quantity === "" || Number(productData.quantity) <= 0) newErrors.quantity = "Enter a valid quantity.";
        else if (Number(productData.quantity) > 10000) {
            newErrors.quantity = "Cannot exceed 10,000.";
        }
        if (productData.unitPrice === "" || Number(productData.unitPrice) <= 0) newErrors.unitPrice = "Enter a valid price.";
        else if (Number(productData.unitPrice) > 1000000) {
            newErrors.unitPrice = "Cannot exceed 1,000,000.";
        }
        if (productData.unitSize === "" || Number(productData.unitSize) <= 0) newErrors.unitSize = "Enter a valid unit size.";
        else if (Number(productData.unitSize) > 10000) {
            newErrors.unitSize = "Cannot exceed 10,000.";
        }
        if (!productData.selectUnit.trim() || productData.selectUnit.trim() === "Unit") newErrors.selectUnit = "Please select a unit.";
        if (productData.name.trim().length > 40) newErrors.name = "Product name must be 40 characters or less."
        if (productData.note.trim().length > 120) newErrors.note = "Note must be 120 characters or less."

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
                disabled={isEditing}
            />
            <InputField
                label="Note"
                required
                type="textarea"
                value={productData.note}
                onChange={(value) => handleInputChange("note", value)}
                placeholder={"Enter note"}
                error={errors.note}
                disabled={isEditing}
            />
            <div className="flex gap-6">
                <QuantityInput
                    required
                    value={productData.quantity}
                    onChange={(value) => handleInputChange("quantity", value)}
                    error={errors.quantity}
                    disabled={isEditing}
                />

                <UnitSelector
                    value={productData.selectUnit}
                    onChange={(value) => handleInputChange("selectUnit", value)}
                    error={errors.selectUnit}
                    disabled={isEditing}
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
                disabled={isEditing}
            />
            <PriceInput
                label="Total"
                value={productData.total}
                disabled={isEditing}
                readonly
            />

            <div className="flex gap-20">
                <DeleteButton
                    onClick={() => {
                        onDelete(initialData)
                    }}
                    className="text-s"
                    disabled={isEditing}
                    isDeleting={isDeleting}
                >
                    Delete
                </DeleteButton>
                <div className="flex item-center justify-end ">
                    <Button
                        type="submit"
                        className="text-s h-[3rem] w-[11rem]"
                        disabled={isEditing}
                    >
                        {isEditing ? (
                            <div className="flex items-center justify-center gap-2">
                                <ClipLoader color="#ffffff" size={20} className="mr-2" />
                                Updating...
                            </div>
                        ) : (
                            "Confirm Changes"
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default EditProductForm;
