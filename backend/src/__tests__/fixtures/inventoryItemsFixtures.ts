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

export const testFetchInventoryItems = [
    {
        name: "Fishing bait",
        note: "For tilapias",
        quantity: 5,
        unitPrice: 999.99,
        selectUnit: "pieces",
        unitSize: 1,
        total: 4999.95,
        dateCreated: new Date("2025-01-01"),
        lastUpdated: new Date("2025-01-02"),
    },
    {
        name: "Fishing Net",
        note: "24-inch",
        quantity: 10,
        unitPrice: 299.99,
        selectUnit: "pieces",
        unitSize: 1,
        total: 2999.90,
        dateCreated: new Date("2023-01-01"),
        lastUpdated: null,
    },
];

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

type InvalidEditIdFieldCase = {
    field: keyof InventoryItemInput,
    cases: {
        testCase: string;
        id: string | null | undefined;
        expected: {
            message: string;
            error: string;
        };
    }[];
};

export const invalidEditIdInventoryItemFieldCases: InvalidEditIdFieldCase[] = [
    {
        field: "id",
        cases: [
            {
                testCase: "id does not exist",
                id: undefined,
                expected: {
                    message: "Invalid or missing item Id.",
                    error: "Valid id (number) is required"
                }
            },
            {
                testCase: "id cannot be a number",
                id: "abc123",
                expected: {
                    message: "Invalid or missing item Id.",
                    error: "Valid id (number) is required"
                }
            }
        ]
    },
]

type InvalidEditBodyFieldCase = {
    field: string;
    cases: {
        testCase: string;
        body: object | undefined;
        expected: {
            message: string;
            error: string;
        };
    }[];
};

export const invalidEditBodyInventoryItemFieldCases: InvalidEditBodyFieldCase[] = [
    {
        field: "updatedItem",
        cases: [
            {
                testCase: "updatedItem does not exist",
                body: undefined,
                expected: {
                    message: "Invalid or Missing fields.",
                    error: "Valid fields matching the shape of inventoryItem are required.",
                }
            },
            {
                testCase: "updatedItem is empty",
                body: {},
                expected: {
                    message: "Invalid or Missing fields.",
                    error: "Valid fields matching the shape of inventoryItem are required.",
                }
            },
        ]
    }
]

type InvalidEditFieldCase = {
    object: string;
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

export const invalidEditInventoryItemFieldCases: InvalidEditFieldCase[] = [
    {
        object: "updatedItem.name ",
        field: "name",
        cases: [
            {
                testCase: "updatedItem.name does not exist",
                value: undefined,
                expected: {
                    message: "Enter a valid name.",
                    error: "Valid name (string) is required.",
                }
            },
            {
                testCase: "updatedItem.name is empty",
                value: "",
                expected: {
                    message: "Enter a valid name.",
                    error: "Valid name (string) is required.",
                }
            },
            {
                testCase: "updatedItem.name not typeof string",
                value: 123,
                expected: {
                    message: "Enter a valid name.",
                    error: "Valid name (string) is required.",
                }
            },
            {
                testCase: "updatedItem.name is greater than 40",
                value: "This word is 40 This word is 40 This word is 40 ",
                expected: {
                    message: "Product name name must be 40 characters or less.",
                    error: "Name.length <= 40 is required",
                },
            },
        ]
    },
    {
        object: "updatedItem.note ",
        field: "note",
        cases: [
            {
                testCase: "updatedupdatedItem.note does not exist",
                value: undefined,
                expected: {
                    message: "Enter a valid note.",
                    error: "Valid note (string) is required.",
                }
            },
            {
                testCase: "updatedItem.note is empty",
                value: "",
                expected: {
                    message: "Enter a valid note.",
                    error: "Valid note (string) is required.",
                }
            },
            {
                testCase: "updatedItem.note not typeof string",
                value: 296,
                expected: {
                    message: "Enter a valid note.",
                    error: "Valid note (string) is required.",
                }
            },
            {
                testCase: "updatedItem.note is greater than 120",
                value: "This word is 120 This word is 150 This word is 150 This word is 150 This word is 150 This word is 150 This word is 150 This word is 150 This word is 150This word is 150",
                expected: {
                    message: "Product note must be 150 characters or less.",
                    error: "Name.length <= 120 is required",
                },
            },
        ]
    },
    {
        object: "updatedItem.quantity",
        field: "quantity",
        cases: [
            {
                testCase: "updatedItem.quantity does not exist",
                value: undefined,
                expected: {
                    message: "Enter a valid quantity.",
                    error: "Valid quantity (number > 0) is required.",
                }
            },
            {
                testCase: "updatedItem.quantity is empty",
                value: "",
                expected: {
                    message: "Enter a valid quantity.",
                    error: "Valid quantity (number > 0) is required.",
                }
            },
            {
                testCase: "updatedItem.quantity not typeof number",
                value: "143",
                expected: {
                    message: "Enter a valid quantity.",
                    error: "Valid quantity (number > 0) is required.",
                }
            },
            {
                testCase: "updatedItem.quantity is <=0",
                value: 0,
                expected: {
                    message: "Enter a valid quantity.",
                    error: "Valid quantity (number > 0) is required.",
                }
            },
        ]
    },
    {
        object: "updatedItem.unitPrice",
        field: "unitPrice",
        cases: [
            {
                testCase: "updatedItem.unitPrice does not exist",
                value: undefined,
                expected: {
                    message: "Enter a valid price.",
                    error: "Valid unitPrice (number > 0) is required",
                }
            },
            {
                testCase: "updatedItem.unitPrice is empty",
                value: "",
                expected: {
                    message: "Enter a valid price.",
                    error: "Valid unitPrice (number > 0) is required",
                }
            },
            {
                testCase: "updatedItem.unitPrice not typeof number",
                value: "1313",
                expected: {
                    message: "Enter a valid price.",
                    error: "Valid unitPrice (number > 0) is required",
                }
            },
            {
                testCase: "updatedItem.unitPrice is <=0",
                value: -1,
                expected: {
                    message: "Enter a valid price.",
                    error: "Valid unitPrice (number > 0) is required",
                }
            },
        ]
    },
    {
        object: "updatedItem.selectUnit",
        field: "selectUnit",
        cases: [
            {
                testCase: "updatedItem.selectUnit does not exist",
                value: undefined,
                expected: {
                    message: "Please select a unit.",
                    error: "Valid selectUnit (string) is required",
                }
            },
            {
                testCase: "updatedItem.selectUnit is empty",
                value: "",
                expected: {
                    message: "Please select a unit.",
                    error: "Valid selectUnit (string) is required",
                }
            },
            {
                testCase: "updatedItem.selectUnit contains default value",
                value: "Unit",
                expected: {
                    message: "Please select a unit.",
                    error: "Valid selectUnit (string) is required",
                }
            },
            {
                testCase: "updatedItem.selectUnit not typeof string",
                value: 442455,
                expected: {
                    message: "Please select a unit.",
                    error: "Valid selectUnit (string) is required",
                }
            },
        ]
    },
    {
        object: "updatedItem.unitSize",
        field: "unitSize",
        cases: [
            {
                testCase: "updatedItem.unitSize does not exist",
                value: undefined,
                expected: {
                    message: "Enter a valid unit size.",
                    error: "Valid unitSize (number > 0 and number <= quantity) is required",
                }
            },
            {
                testCase: "updatedItem.unitSize is empty",
                value: "",
                expected: {
                    message: "Enter a valid unit size.",
                    error: "Valid unitSize (number > 0 and number <= quantity) is required",
                }
            },
            {
                testCase: "updatedItem.unitSize is <= 0",
                value: 0,
                expected: {
                    message: "Enter a valid unit size.",
                    error: "Valid unitSize (number > 0 and number <= quantity) is required",
                }
            },
            {
                testCase: "updatedItem.unitSize is > quantity",
                value: 10,
                expected: {
                    message: "Enter a valid unit size.",
                    error: "Valid unitSize (number > 0 and number <= quantity) is required",
                }
            },
            {
                testCase: "updatedItem.unitSize not typeof number",
                value: "ILOVEMIKA",
                expected: {
                    message: "Enter a valid unit size.",
                    error: "Valid unitSize (number > 0 and number <= quantity) is required",
                }
            },
        ]
    },
    {
        object: "updatedItem.total",
        field: "total",
        cases: [
            {
                testCase: "updatedItem.total does not exist",
                value: undefined,
                expected: {
                    message: "Incorrect computed total",
                    error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
                }
            },
            {
                testCase: "updatedItem.total is empty",
                value: "",
                expected: {
                    message: "Incorrect computed total",
                    error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
                }
            },
            {
                testCase: "updatedItem.total is <= 0",
                value: -2,
                expected: {
                    message: "Incorrect computed total",
                    error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
                }
            },
            {
                testCase: "updatedItem.total != roundTo(((updatedItem.unitPrice * updatedItem.quantity) / updatedItem.unitSize), 2)",
                value: 414,
                expected: {
                    message: "Incorrect computed total",
                    error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
                }
            },
            {
                testCase: "updatedItem.total is not typeof number",
                value: "abc132",
                expected: {
                    message: "Incorrect computed total",
                    error: "Valid total (number > 0 and total == ((unitPrice * quantity) / unitSize) is required"
                }
            },
        ]
    },
    {
        object: "updatedItem.dateCreated",
        field: "dateCreated",
        cases: [
            {
                testCase: "updatedItem.dateCreated does not exist",
                value: undefined,
                expected: {
                    message: "Format Date should be correct",
                    error: "Valid dateCreated (ISO 8601 format) is required"
                }
            },
            {
                testCase: "updatedItem.dateCreated is null",
                value: null,
                expected: {
                    message: "Format Date should be correct",
                    error: "Valid dateCreated (ISO 8601 format) is required"
                }
            },
            {
                testCase: "updatedItem.dateCreated is invalid format",
                value: 20 / 2024 / 30,
                expected: {
                    message: "Format Date should be correct",
                    error: "Valid dateCreated (ISO 8601 format) is required",
                }
            },
        ]
    },
]

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