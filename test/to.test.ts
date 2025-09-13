import { describe, expect, it } from "vitest";
import { To } from "../src";

describe("To", () => {
	describe("dictionary function", () => {
		it("deve converter um objeto JSON para um Record<string, T>", () => {
			const jsonObject = { key1: "value1", key2: "value2" };
			const result = To.dictionary<string>(jsonObject);
			expect(result).toEqual(jsonObject);
		});
	});

	describe("boolean function", () => {
		it("deve converter números para booleanos corretos", () => {
			expect(To.boolean(1)).toBe(true);
			expect(To.boolean(0)).toBe(false);
			expect(To.boolean("0")).toBe(false);
			expect(To.boolean(123)).toBe(true);
		});

		it("deve converter strings para booleanos corretos", () => {
			expect(To.boolean("true")).toBe(true);
			expect(To.boolean("True")).toBe(true);
			expect(To.boolean("false")).toBe(false);
			expect(To.boolean("randomString")).toBe(false);
		});
	});

	describe("dateParts function", () => {
		it("should extract date parts from a valid date string", () => {
			const date = "2024-07-01T12:00:00";
			const result = To.dateParts(date);
			expect(result).toEqual({
				year: 2024,
				month: 7,
				day: 1,
				hour: 12,
				minute: 0,
				second: 0,
				timestamp: new Date(date).getTime(),
			});
		});

		it("should extract date parts from a valid Date object", () => {
			const date = new Date(2024, 6, 1, 12, 0, 0);
			const result = To.dateParts(date);
			expect(result).toEqual({
				year: 2024,
				month: 7,
				day: 1,
				hour: 12,
				minute: 0,
				second: 0,
				timestamp: date.getTime(),
			});
		});

		it("should throw an error for an invalid date string", () => {
			const date = "invalid-date";
			expect(() => To.dateParts(date)).toThrow("Invalid date");
		});

		it("should handle edge case: February 29th", () => {
			const date = "2024-02-29T12:00:00";
			const result = To.dateParts(date);
			expect(result).toEqual({
				year: 2024,
				month: 2,
				day: 29,
				hour: 12,
				minute: 0,
				second: 0,
				timestamp: new Date(date).getTime(),
			});
		});

		it("should handle edge case: December 31st", () => {
			const date = "2024-12-31T12:00:00";
			const result = To.dateParts(date);
			expect(result).toEqual({
				year: 2024,
				month: 12,
				day: 31,
				hour: 12,
				minute: 0,
				second: 0,
				timestamp: new Date(date).getTime(),
			});
		});
	});

	describe("date function", () => {
		it("should convert a Date object to a Date object", () => {
			const date = new Date();
			const result = To.date(date);
			expect(result).toBeInstanceOf(Date);
			expect(result.getTime()).toBe(date.getTime());
		});

		it("should convert a number to a Date object", () => {
			const timestamp = 1693456000000;
			const result = To.date(timestamp);
			expect(result).toBeInstanceOf(Date);
			expect(result.getTime()).toBe(timestamp);
		});

		it("should convert a string in ISO format to a Date object", () => {
			const dateString = "2023-08-01";
			const result = To.date(dateString);
			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toBe(`${dateString}T00:00:00.000Z`);
		});

		it("should convert a string in local time format to a Date object", () => {
			const dateString = "2023-08-01T00:00:00";
			const result = To.date(dateString);
			expect(result).toBeInstanceOf(Date);
			expect(result.getMonth()).toBe(7);
		});

		it("should convert a string in local time format with milliseconds to a Date object", () => {
			const dateString = "2023-08-01 00:00:00.000";
			const result = To.date(dateString);
			expect(result).toBeInstanceOf(Date);
			expect(result.toDateString()).toBe(new Date(dateString).toDateString());
		});

		it("should convert a string in UTC time format to a Date object", () => {
			const dateString = "2023-08-01 00:00:00.000Z";
			const result = To.date(dateString);
			expect(result).toBeInstanceOf(Date);
			expect(result.toISOString()).toBe("2023-08-01T00:00:00.000Z");
		});

		it("should return NaN for an invalid input", () => {
			const input = "invalid-date";
			expect(() => To.date(input)).toThrow("Invalid date");
		});
	});

	describe("number function", () => {
		it("should convert numeric values as-is", () => {
			expect(To.number(42)).toBe(42);
			expect(To.number(-42)).toBe(-42);
			expect(To.number(0)).toBe(0);
		});

		it("should convert string representations of numbers correctly", () => {
			expect(To.number("42")).toBe(42);
			expect(To.number("-42")).toBe(-42);
			expect(To.number("0")).toBe(0);
		});

		it("should convert non-numeric strings to NaN", () => {
			expect(To.number("abc")).toBeNaN();
			expect(To.number("hello")).toBeNaN();
		});

		it("should convert null and undefined values to NaN", () => {
			expect(To.number(null)).toBeNaN();
			expect(To.number(undefined)).toBeNaN();
		});

		it("should convert boolean values to NaN", () => {
			expect(To.number(true)).toBeNaN();
			expect(To.number(false)).toBeNaN();
		});
	});
});
