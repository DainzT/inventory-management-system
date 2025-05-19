import { roundTo } from "./RoundTo";

export const validateTotalPrecision = (
    unitPrice: number,
    quantity: number,
    unitSize: number
): boolean => {
    if (unitSize === 0) return false;
    const rawTotal = (unitPrice * quantity) / unitSize;
    const roundedTotal = roundTo(rawTotal, 2);
    return roundedTotal > 0;
};