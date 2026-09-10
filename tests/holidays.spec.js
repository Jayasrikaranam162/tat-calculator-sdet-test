const request = require("supertest");
const app = require("../server");

describe("GET /api/holidays", () => {
  test("should expose only date and name", async () => {
    const res = await request(app).get("/api/holidays");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    res.body.forEach((holiday) => {
      expect(Object.keys(holiday).sort()).toEqual(["date", "name"]);
      expect(holiday).not.toHaveProperty("internalCode");
    });
  });
});
