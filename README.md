# TAT Calculator - SDET Hackathon (Phase 2)

Automated API integration test suite for the **TAT (Turnaround Time) Calculator** application, built using **Jest** and **Supertest**.

As part of **Phase 2**, these automated tests are designed to assert the expected behavior according to the API specification and contract. Each test intentionally **fails** against the current application to demonstrate and prove the confirmed bugs found in Phase 1.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Test Runner:** Jest
- **API Testing:** Supertest

---

## Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Automated Tests
```bash
npm test
```
> **Note:** All tests are expected to fail against the current codebase, demonstrating each confirmed bug.

### 3. Run the Application
```bash
npm start
```
The server will start on `http://localhost:3006`.

---

## Test Suites & Bug Coverage

### 1. `tests/holidays.spec.js`
Tests `GET /api/holidays` against API contract:
- **Undocumented Field Leak (Bug 4):** Ensures the endpoint only exposes `date` and `name`, catching the leak of internal property `internalCode`.

### 2. `tests/tat.spec.js`
Tests `POST /api/tat` input validation and calculation logic:
- **Missing Boundary Check (Bug 1 & 6):** Verifies that `tatDays = 0` and negative values are rejected with `HTTP 400`.
- **Missing Required Input (Bug 6):** Verifies that omitting `tatDays` or `startDate` returns `HTTP 400` instead of `500` or `200`.
- **Type Coercion (Bug 9):** Verifies that invalid/non-numeric string inputs are rejected with `HTTP 400`.
- **Off-by-One Boundary (Bug 2):** Verifies that the start date is not counted as business day #1.
- **Date Format (Bug 7):** Verifies that `dueDate` follows the required `YYYY-MM-DD` format rather than a locale-specific string.
- **Business Days Count:** Verifies that `businessDaysUsed` matches the submitted TAT instead of echoing `startDate`.
- **Contract Field Naming (Bug 10):** Verifies that the response contains the documented `overdue` field instead of `isOverdue`.

---

## Tools Used

- **VS Code:** Code editing and project configuration.
- **Jest:** Test runner and assertion library.
- **Supertest:** HTTP integration testing against Express routes.
- **Node.js & npm:** Environment runtime and package management.