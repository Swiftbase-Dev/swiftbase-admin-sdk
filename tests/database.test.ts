import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { db, QueryBuilder, DatabaseSocketManager } from "../src/database";
import * as makeRequestModule from "../src/common/makerequest";

describe("Database Query Builder", () => {
  beforeEach(() => {
    vi.mock("../src/common/makerequest", async () => {
      const actual = await vi.importActual("../src/common/makerequest");
      return {
        ...actual,
        makeRequest: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create a QueryBuilder via the db function", () => {
    const query = db("my_database")("users");
    expect(query).toBeInstanceOf(QueryBuilder);
  });

  it("should build payload properties correctly", async () => {
    const query = db("my_db")("users")
      .select("id", "name")
      .where("age", ">", 18)
      .where({ status: "active" })
      .limit(10)
      .offset(5);

    // Mock WebSocket checks to false to force REST fallback
    const socketInstance = DatabaseSocketManager.getInstance();
    vi.spyOn(socketInstance, "isWebSocketAvailable").mockReturnValue(false);

    const mockResponse = { data: [{ id: 1, name: "Alice" }], columns: ["id", "name"], count: 1 };
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue(mockResponse);

    const result = await query;
    expect(result).toEqual(mockResponse);

    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.POST,
      "/api/db/query",
      undefined,
      expect.objectContaining({
        database: "my_db",
        table: "users",
        select: ["id", "name"],
        where: [
          { column: "age", operator: ">", value: 18 },
          { column: "status", operator: "=", value: "active" }
        ],
        limit: 10,
        offset: 5
      })
    );
  });

  it("should support insert operations", async () => {
    const insertData = { name: "Bob", age: 30 };
    const query = db("my_db")("users").insert(insertData);

    const socketInstance = DatabaseSocketManager.getInstance();
    vi.spyOn(socketInstance, "isWebSocketAvailable").mockReturnValue(false);
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue({ success: true });

    await query;

    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.POST,
      "/api/db/query",
      undefined,
      expect.objectContaining({
        database: "my_db",
        table: "users",
        insert: insertData
      })
    );
  });

  it("should support update operations", async () => {
    const updateData = { name: "Charlie" };
    const query = db("my_db")("users").where("id", 1).update(updateData);

    const socketInstance = DatabaseSocketManager.getInstance();
    vi.spyOn(socketInstance, "isWebSocketAvailable").mockReturnValue(false);
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue({ success: true });

    await query;

    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.POST,
      "/api/db/query",
      undefined,
      expect.objectContaining({
        database: "my_db",
        table: "users",
        where: [{ column: "id", operator: "=", value: 1 }],
        update: updateData
      })
    );
  });

  it("should support delete operations", async () => {
    const query = db("my_db")("users").where("id", 1).delete();

    const socketInstance = DatabaseSocketManager.getInstance();
    vi.spyOn(socketInstance, "isWebSocketAvailable").mockReturnValue(false);
    vi.spyOn(makeRequestModule, "makeRequest").mockResolvedValue({ success: true });

    await query;

    expect(makeRequestModule.makeRequest).toHaveBeenCalledWith(
      makeRequestModule.HTTPMethod.POST,
      "/api/db/query",
      undefined,
      expect.objectContaining({
        database: "my_db",
        table: "users",
        where: [{ column: "id", operator: "=", value: 1 }],
        delete: true
      })
    );
  });
});
