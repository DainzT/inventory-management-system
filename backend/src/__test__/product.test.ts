import request from "supertest";
import app from "../index";

describe("GET /products", () => {
  it("should return a list of products", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
