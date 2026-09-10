const request = require("supertest");
const app = require("../server");

describe("POST /api/tat", () => {
  describe("Input validation", () => {
    test("should reject TAT = 0 with 400", async () => {
      const res = await request(app)
        .post("/api/tat")
        .send({ startDate: "2026-07-01", tatDays: 0 });

      expect(res.status).toBe(400);
    });

    test("should reject negative TAT with 400", async () => {
      const res = await request(app)
        .post("/api/tat")
        .send({ startDate: "2026-07-01", tatDays: -3 });

      expect(res.status).toBe(400);
    });

    test("should reject missing TAT with 400", async () => {
      const res = await request(app)
        .post("/api/tat")
        .send({ startDate: "2026-07-01" });

      expect(res.status).toBe(400);
    });

    test("should reject invalid request missing start date with 400", async () => {
      const res = await request(app)
        .post("/api/tat")
        .send({ tatDays: 5 });

      expect(res.status).toBe(400);
    });

    test("should reject non-numeric TAT with 400", async () => {
      const res = await request(app)
        .post("/api/tat")
        .send({ startDate: "2026-07-01", tatDays: "five" });

      expect(res.status).toBe(400);
    });
  });

  describe("Calculation and response contract", () => {
    test("start date should not count as the first business day", async () => {
      const res = await request(app)
        .post("/api/tat")
        .send({ startDate: "2026-07-01", tatDays: 1 });

      expect(res.status).toBe(200);
      const dueDay = new Date(res.body.dueDate).getDate();
      expect(dueDay).toBe(2);
    });

    test("due date format should be YYYY-MM-DD", async () => {
      const res = await request(app)
        .post("/api/tat")
        .send({ startDate: "2026-07-01", tatDays: 5 });

      expect(res.status).toBe(200);
      expect(res.body.dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test("businessDaysUsed should equal submitted TAT", async () => {
      const res = await request(app)
        .post("/api/tat")
        .send({ startDate: "2026-07-01", tatDays: 5 });

      expect(res.status).toBe(200);
      expect(res.body.businessDaysUsed).toBe(5);
    });

    test("response should contain overdue field instead of isOverdue", async () => {
      const res = await request(app)
        .post("/api/tat")
        .send({ startDate: "2026-07-01", tatDays: 5 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("overdue");
      expect(res.body).not.toHaveProperty("isOverdue");
    });
  });
});
