import { useEffect, useMemo, useState } from "react";
import { Button } from "./Button";
import { InputField } from "./InputField";
import { PriceInput } from "./PriceInput";
import { QuantityInput } from "./QuantityInput";
import { UnitSelector } from "./UnitSelector";
import { ItemFormData } from "@/types";
import { ClipLoader } from "react-spinners";

import { roundTo } from "@/utils/RoundTo";

interface ProductFormProps {
    onSubmit: (data: ItemFormData) => void;
    onFormChange: (hasChanges: boolean) => void;
    isAdding?: boolean;
}

const MAX_NAME_LENGTH = 40;
const MAX_NOTE_LENGTH = 120;

const AddProductForm = ({
    onSubmit,
    onFormChange,
    isAdding = false,
}: ProductFormProps) => {
    const emptyFormState = useMemo<ItemFormData>(() => ({
        name: "",
        note: "",
        quantity: "",
        selectUnit: "Unit",
        unitPrice: "",
        unitSize: "",
        total: "",
        dateCreated: new Date(),
    }), []);

    const [productData, setProductData] = useState<ItemFormData>(emptyFormState);

    const [errors, setErrors] = useState<{ [key in keyof ItemFormData]?: string }>({});

    const validateStringField = (field: 'name' | 'note', value: string) => {
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
        const hasChanges = Object.keys(productData).some(key => {
            if (key === 'dateCreated' || key === 'total') return false;
            const value = productData[key as keyof ItemFormData];
            const defaultValue = emptyFormState[key as keyof ItemFormData];
            return value !== defaultValue;
        });
        onFormChange(hasChanges);
    }, [productData, onFormChange, emptyFormState]);

    const handleInputChange = (field: keyof ItemFormData, value: string | number) => {
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
            const error = validateStringField(field, String(value));
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
        const newErrors: { [key in keyof ItemFormData]?: string } = {};
        if (!productData.name.trim()) newErrors.name = "Product name is required.";
        else if (productData.name.trim().length > MAX_NAME_LENGTH) {
            newErrors.name = `Product name must be ${MAX_NAME_LENGTH} characters or less.`;
        }
        if (!productData.note.trim()) newErrors.note = "Note is required.";
        else if (productData.note.trim().length > MAX_NOTE_LENGTH) {
            newErrors.note = `Note must be ${MAX_NOTE_LENGTH} characters or less.`;
        }
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
                disabled={isAdding}
            />
            <InputField
                label="Note"
                required
                type="textarea"
                value={productData.note}
                onChange={(value) => handleInputChange("note", value)}
                placeholder={"Enter note"}
                error={errors.note}
                disabled={isAdding}
            />
            <div className="flex gap-6">
                <QuantityInput
                    required
                    value={productData.quantity}
                    onChange={(value) => handleInputChange("quantity", value)}
                    error={errors.quantity}
                    disabled={isAdding}
                />

                <UnitSelector
                    value={productData.selectUnit}
                    onChange={(value) => handleInputChange("selectUnit", value)}
                    error={errors.selectUnit}
                    disabled={isAdding}
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
                disabled={isAdding}
            />
            <PriceInput
                label="Total"
                value={productData.total}
                readonly
                disabled={isAdding}
            />

            <div className="flex justify-end gap-4">
                <Button
                    type="submit"
                    disabled={isAdding}
                >
                    {isAdding ? (
                        <div className="flex items-center justify-center">
                            <ClipLoader color="#ffffff" size={20} className="mr-2" />
                            Adding...
                        </div>
                    ) : (
                        "Add Product"
                    )}
                </Button>
            </div>
        </form>
    );
};

export default AddProductForm;
