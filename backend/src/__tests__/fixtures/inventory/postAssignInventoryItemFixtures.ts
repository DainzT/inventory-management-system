type InvalidAssignFieldCase = {
    field: any;
    cases: {
        testCase: string;
        value: string | number | boolean | null | undefined;
        expected: {
            message: string;
            error: string;
        };
    }[];
};

export const invalidAssignInventoryItemFieldCases: InvalidAssignFieldCase[] = [
    {
        field: "fleet_name",
        cases: [
            {
                testCase: "fleet_name does not exist",
                value: undefined,
                expected: {
                    message: "Please select a fleet",
                    error: "Valid fleet (string) is required"
                }
            },
            {
                testCase: "fleet_name is empty",
                value: "",
                expected: {
                    message: "Please select a fleet",
                    error: "Valid fleet (string) is required"
                }
            },
            {
                testCase: "fleet_name not typeof string",
                value: 123,
                expected: {
                    message: "Please select a fleet",
                    error: "Valid fleet (string) is required"
                }
            },
        ]
    },
    {
        field: "boat_name",
        cases: [
            {
                testCase: "boat_name does not exist",
                value: undefined,
                expected: {
                    message: "Please select a boat",
                    error: "Valid boat (string) is required"
                }
            },
            {
                testCase: "boat_name is empty",
                value: "",
                expected: {
                    message: "Please select a boat",
                    error: "Valid boat (string) is required"
                }
            },
            {
                testCase: "boat_name not typeof string",
                value: 123,
                expected: {
                    message: "Please select a boat",
                    error: "Valid boat (string) is required"
                }
            },
        ]
    },
    {
        field: "quantity",
        cases: [
            {
                testCase: "quantity does not exist",
                value: undefined,
                expected: {
                    message: "Quantity should not be 0",
                    error: "Valid quantity (number > 0) is required"
                },
            },
            {
                testCase: "quantity is empty",
                value: "",
                expected: {
                    message: "Quantity should not be 0",
                    error: "Valid quantity (number > 0) is required"
                },
            },
            {
                testCase: "quantity is not typeof number",
                value: "hmmm",
                expected: {
                    message: "Quantity should not be 0",
                    error: "Valid quantity (number > 0) is required"
                },
            },
            {
                testCase: "quantity is <= 0",
                value: 0,
                expected: {
                    message: "Quantity should not be 0",
                    error: "Valid quantity (number > 0) is required"
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
];

type InvalidAssignMissingFieldCase = {
    group: string;
    cases: {
        field: any;
        testCase: string;
        value: string | number | boolean | null | undefined | object;
        expected: {
            message: string;
            error: string;
        };
    }[];
};

export const InvalidAssignMissingFieldCase: InvalidAssignMissingFieldCase[] = [
    {
        group: "Missing Fields",
        cases: [
            {
                field: "item_id",
                testCase: "item_id is empty",
                value: "",
                expected: {
                    message: "Missing fields",
                    error: "Missing required fields"
                }
            },
            {
                field: "note",
                testCase: "note is empty",
                value: "",
                expected: {
                    message: "Missing fields",
                    error: "Missing required fields"
                }
            },
            {
                field: "name",
                testCase: "name is empty",
                value: "",
                expected: {
                    message: "Missing fields",
                    error: "Missing required fields"
                }
            },
            {
                field: "unitPrice",
                testCase: "unitPrice is empty",
                value: "",
                expected: {
                    message: "Missing fields",
                    error: "Missing required fields"
                }
            },
            {
                field: "selectUnit",
                testCase: "selectUnit is empty",
                value: "",
                expected: {
                    message: "Missing fields",
                    error: "Missing required fields"
                }
            },
            {
                field: "unitSize",
                testCase: "unitSize is empty",
                value: "",
                expected: {
                    message: "Missing fields",
                    error: "Missing required fields"
                }
            },
            {
                field: "outDate",
                testCase: "outDate is empty",
                value: "",
                expected: {
                    message: "Missing fields",
                    error: "Missing required fields"
                }
            },
        ]
    },
]