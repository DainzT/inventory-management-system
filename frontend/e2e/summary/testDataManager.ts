import { APIRequestContext } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export interface TestAssignedItem {
  product: string;
  note: string;
  quantity: number;
  unitPrice: number;
  fleetId: number;
  boatId?: number;
  dateOut: string;
  archived?: boolean;
}

export class TestDataManager {
  private baseUrl: string;
  private testToken: string;

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || "http://localhost:3000";
    this.testToken = process.env.TEST_API_TOKEN || "";
  }

  /**
   * Seed test data for summary invoice tests
   */
  async seedTestData(request: APIRequestContext): Promise<void> {
    const testAssignedItems: TestAssignedItem[] = [
      {
        dateOut: "2024-01-15",
        product: "Fish Feed A",
        note: "Regular supply for test",
        quantity: 100,
        unitPrice: 250.00,
        fleetId: 1,
        archived: false
      },
      {
        dateOut: "2024-01-20",
        product: "Fish Feed B",
        note: "Premium quality for test",
        quantity: 50,
        unitPrice: 450.00,
        fleetId: 1,
        archived: false
      },
      {
        dateOut: "2024-01-25",
        product: "Equipment Tools",
        note: "Maintenance equipment",
        quantity: 10,
        unitPrice: 800.00,
        fleetId: 1,
        archived: false
      },
      {
        dateOut: "2024-02-10",
        product: "Safety Equipment",
        note: "Safety gear for test",
        quantity: 5,
        unitPrice: 1000.00,
        fleetId: 1,
        archived: false
      },
      {
        dateOut: "2024-02-15",
        product: "Cleaning Supplies",
        note: "Monthly cleaning supplies",
        quantity: 20,
        unitPrice: 150.00,
        fleetId: 1,
        archived: false
      },
      {
        dateOut: "2024-03-05",
        product: "Fuel",
        note: "Monthly fuel supply",
        quantity: 200,
        unitPrice: 75.00,
        fleetId: 1,
        archived: false
      }
    ];

    console.log("Seeding test data...");
    
    for (const item of testAssignedItems) {
      try {
        // Note: You'll need to create a POST endpoint in assignedItemRouter for creating items
        const response = await request.post(`${this.baseUrl}/api/assigned-items`, {
          data: item,
          headers: {
            'Authorization': `Bearer ${this.testToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok()) {
          console.warn(`Failed to create assigned item: ${item.product}`, await response.text());
        }
      } catch (error) {
        console.error(`Error creating assigned item ${item.product}:`, error);
      }
    }

    console.log("Test data seeding completed");
  }

  /**
   * Clean up test data after tests
   */
  async cleanupTestData(request: APIRequestContext): Promise<void> {
    console.log("Cleaning up test data...");
    
    try {
      // Note: You'll need to create a DELETE endpoint in assignedItemRouter for cleanup
      const response = await request.delete(`${this.baseUrl}/api/assigned-items/test-cleanup`, {
        headers: {
          'Authorization': `Bearer ${this.testToken}`
        }
      });

      if (!response.ok()) {
        console.warn("Failed to cleanup test data:", await response.text());
      } else {
        console.log("Test data cleanup completed");
      }
    } catch (error) {
      console.error("Error during test data cleanup:", error);
    }
  }

  /**
   * Create assigned items for specific month testing
   */
  async createItemsForMonth(
    request: APIRequestContext, 
    year: number, 
    month: number, 
    count: number = 5
  ): Promise<void> {
    const items: TestAssignedItem[] = [];
    
    for (let i = 1; i <= count; i++) {
      items.push({
        dateOut: `${year}-${month.toString().padStart(2, '0')}-${(i * 2).toString().padStart(2, '0')}`,
        product: `Test Product ${i}`,
        note: `Test assigned item ${i} for month ${month}`,
        quantity: Math.floor(Math.random() * 100) + 10,
        unitPrice: Math.floor(Math.random() * 1000) + 100,
        fleetId: 1,
        archived: false
      });
    }

    for (const item of items) {
      try {
        await request.post(`${this.baseUrl}/api/assigned-items`, {
          data: item,
          headers: {
            'Authorization': `Bearer ${this.testToken}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error(`Error creating assigned item for month ${month}:`, error);
      }
    }
  }

  /**
   * Verify test data exists
   */
  async verifyTestDataExists(request: APIRequestContext): Promise<boolean> {
    try {
      const response = await request.get(`${this.baseUrl}/api/assign-item`, {
        headers: {
          'Authorization': `Bearer ${this.testToken}`
        }
      });

      if (response.ok()) {
        const result = await response.json();
        return result.success && Array.isArray(result.data) && result.data.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error verifying test data:", error);
      return false;
    }
  }


}

// Export singleton instance
export const testDataManager = new TestDataManager();