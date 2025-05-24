type InventoryItemInput = {
    id: string;
    name: string;
    note: string;
    quantity: number;
    unitPrice: number;
    selectUnit: string;
    unitSize: number;
    total: number;
    dateCreated: string;
};

type InvalidAddFieldCase = {
    field: keyof InventoryItemInput;
    cases: {
        testCase: string;
        value: string | number | boolean | null | undefined;
        expected: {
            message: string;
            error: string;
        };
    }[];
};

export const invalidAddInventoryItemFieldCases: InvalidAddFieldCase[] = [
    {
        field: "name",
        cases: [
            {
                testCase: "name does not exist",
                value: undefined,
                expected: {
                    message: "Product name is required.",
                    error: "Valid name (string) is required",
                },
            },
            {
                testCase: "name is empty",
                value: "",
                expected: {
                    message: "Product name is required.",
                    error: "Valid name (string) is required",
                },
            },
            {
                testCase: "name is not typeof string",
                value: 12,
                expected: {
                    message: "Product name is required.",
                    error: "Valid name (string) is required",
                },
            },
            {
                testCase: "name is greater than 40",
                value: "This word is 40 This word is 40 This word is 40 ",
                expected: {
                    message: "Product name name must be 40 characters or less.",
                    error: "Name.length <= 40 is required",
                },
            },
        ],
    },
    {
        field: "note",
        cases: [
            {
                testCase: "note does not exist",
                value: undefined,
                expected: {
                    message: "Note is required.",
                    error: "Valid note (string) is required",
                },
            },
            {
                testCase: "note is empty",
                value: "",
                expected: {
                    message: "Note is required.",
                    error: "Valid note (string) is required",
                },
            },
            {
                testCase: "note is not typeof string",
                value: 12,
                expected: {
                    message: "Note is required.",
                    error: "Valid note (string) is required",
                },
            },
            {
                testCase: "note is greater than 120",
                value: "This word is 120 This word is 150 This word is 150 This word is 150 This word is 150 This word is 150 This word is 150 This word is 150 This word is 150This word is 150",
                expected: {
                    message: "Product note must be 120 characters or less.",
                    error: "Name.length <= 120 is required",
                },
            },
        ],
    },
    {
        field: "quantity",
        cases: [
            {
                testCase: "quantity does not exist",
                value: undefined,
                expected: {
                    message: "Enter a valid quantity.",
                    error: "Valid quantity (number > 0) is required",
                },
            },
            {
                testCase: "quantity is empty",
                value: "",
                expected: {
                    message: "Enter a valid quantity.",
                    error: "Valid quantity (number > 0) is required",
                },
            },
            {
                testCase: "quantity is not typeof number",
                value: "hmmm",
                expected: {
                    message: "Enter a valid quantity.",
                    error: "Valid quantity (number > 0) is required",
                },
            },
            {
                testCase: "quantity is <= 0",
                value: 0,
                expected: {
                    message: "Enter a valid quantity.",
                    error: "Valid quantity (number > 0) is required",
                },
            },
            {
                testCase: "quantity is > 10,000",
                value: 10001,
                expected: {
                    message: "Quantity cannot exceed 10,000.",
                    error: "Valid quantity (number <= 10,000) is required",
                },
            },
        ],
    },
    {
        field: "unitPrice",
        cases: [
            {
                testCase: "unitPrice does not exist",
                value: undefined,
                expected: {
                    message: "Enter a valid price.",
                    error: "Valid unitPrice (number > 0) is required",
                },
            },
            {
                testCase: "unitPrice is empty",
                value: "",
                expected: {
                    message: "Enter a valid price.",
                    error: "Valid unitPrice (number > 0) is required",
                },
            },
            {
                testCase: "unitPrice is not typeof number",
                value: "check",
                expected: {
                    message: "Enter a valid price.",
                    error: "Valid unitPrice (number > 0) is required",
                },
            },
            {
                testCase: "unitPrice is <= 0",
                value: 0,
                expected: {
                    message: "Enter a valid price.",
                    error: "Valid unitPrice (number > 0) is required",
                },
            },
            {
                testCase: "unitPrice is > 1,000,000",
                value: 1000001,
                expected: {
                    message: "Price cannot exceed 1,000,000",
                    error: "Valid unitPrice (number <= 1,000,000) is required",
                },
            },
        ],
    },
    {
        field: "selectUnit",
        cases: [
            {
                testCase: "selectUnit does not exist",
                value: undefined,
                expected: {
                    message: "Please select a unit.",
                    error: "Valid selectUnit (string) is required",
                },
            },
            {
                testCase: "selectUnit is empty",
                value: "",
                expected: {
                    message: "Please select a unit.",
                    error: "Valid selectUnit (string) is required",
                },
            },
            {
                testCase: "selectUnit contains default value 'Unit'",
                value: "Unit",
                expected: {
                    message: "Please select a unit.",
                    error: "Valid selectUnit (string) is required",
                },
            },
            {
                testCase: "selectUnit is not typeof string",
                value: 123,
                expected: {
                    message: "Please select a unit.",
                    error: "Valid selectUnit (string) is required",
                },
            },
        ],
    },
    {
        field: "unitSize",
        cases: [
            {
                testCase: "unitSize does not exist",
                value: undefined,
                expected: {
                    message: "Enter a valid unit size.",
                    error: "Valid unitSize (number > 0 and number <= quantity) is required",
                },
            },
            {
                testCase: "unitSize is empty",
                value: "",
                expected: {
                    message: "Enter a valid unit size.",
                    error: "Valid unitSize (number > 0 and number <= quantity) is required",
                },
            },
            {
                testCase: "unitSize is not typeof number",
                value: "hey",
                expected: {
                    message: "Enter a valid unit size.",
                    error: "Valid unitSize (number > 0 and number <= quantity) is required",
                },
            },
            {
                testCase: "unitSize is <= 0",
                value: 0,
                expected: {
                    message: "Enter a valid unit size.",
                    error: "Valid unitSize (number > 0 and number <= quantity) is required",
                },
            },
            {
                testCase: "unitSize is > quantity",
                value: 6,
                expected: {
                    message: "Enter a valid unit size.",
                    error: "Valid unitSize (number > 0 and number <= quantity) is required",
                },
            },
        ],
    },
    {
        field: "selectUnit",
        cases: [
            {
                testCase: "selectUnit does not exist",
                value: undefined,
                expected: {
                    message: "Please select a unit.",
                    error: "Valid selectUnit (string) is required",
                },
            },
            {
                testCase: "selectUnit is empty",
                value: "",
                expected: {
                    message: "Please select a unit.",
                    error: "Valid selectUnit (string) is required",
                },
            },
            {
                testCase: "selectUnit contains default value 'Unit'",
                value: "Unit",
                expected: {
                    message: "Please select a unit.",
                    error: "Valid selectUnit (string) is required",
                },
            },
            {
                testCase: "selectUnit is not typeof string",
                value: 123,
                expected: {
                    message: "Please select a unit.",
                    error: "Valid selectUnit (string) is required",
                },
            },
        ],
    },
    {
        field: "total",
        cases: [
            {
                testCase: "total does not exist",
                value: undefined,
                expected: {
                    message: "Incorrect computed total",
                    error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
                },
            },
            {
                testCase: "total is empty",
                value: "",
                expected: {
                    message: "Incorrect computed total",
                    error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
                },
            },
            {
                testCase: "total is not typeof number",
                value: "eh gatekeep ko",
                expected: {
                    message: "Incorrect computed total",
                    error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
                },
            },
            {
                testCase: "total is <= 0",
                value: 0,
                expected: {
                    message: "Incorrect computed total",
                    error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
                },
            },
            {
                testCase: "total !== roundTo(((unitPrice * quantity) / unitSize), 2)",
                value: 313,
                expected: {
                    message: "Incorrect computed total",
                    error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
                },
            },
        ],
    },
    {
        field: "dateCreated",
        cases: [
            {
                testCase: "dateCreated does not exist",
                value: undefined,
                expected: {
                    message: "Format Date should be correct",
                    error: "Valid dateCreated (ISO 8601 format) is required"
                },
            },
            {
                testCase: "dateCreated is null",
                value: null,
                expected: {
                    message: "Format Date should be correct",
                    error: "Valid dateCreated (ISO 8601 format) is required"
                },
            },
            {
                testCase: "dateCreated is invalid format",
                value: "2025-23-13",
                expected: {
                    message: "Format Date should be correct",
                    error: "Valid dateCreated (ISO 8601 format) is required"
                },
            },
        ],
    },

];