import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@app/index";

describe("Auth API", () => {
  it("POST /api/auth/login should return 200 and token (test mode)", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "User123!",
    });

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.token || res.body?.data?.token).toBeTruthy();
  });

  it("POST /api/auth/login should return 400 if missing fields", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect([400, 422]).toContain(res.status);
  });
});
