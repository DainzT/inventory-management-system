import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRouter";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

jest.setTimeout(30000);

describe("POST /api/auth/logout", () => {
  it("should clear refresh token cookie", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Logged out successfully" });
    const setCookieHeader = response.headers["set-cookie"][0];
    expect(setCookieHeader).toContain("refresh_token=;");
    expect(setCookieHeader).toContain("Path=/");
    expect(setCookieHeader).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    if (process.env.NODE_ENV === "production") {
      expect(setCookieHeader).toContain("HttpOnly");
      expect(setCookieHeader).toContain("Secure");
      expect(setCookieHeader).toContain("SameSite=Strict");
    }
  });
});

describe("POST /api/auth/logout (Negative Cases)", () => {
  it("should succeed even without existing session", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Logged out successfully" });
  });

  it("should handle multiple logout requests", async () => {
    const response1 = await request(app).post("/api/auth/logout");
    const response2 = await request(app).post("/api/auth/logout");

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
  });
});
