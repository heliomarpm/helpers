import { Is } from "./is";

export const To = {
	/**
	 * Converts a JSON object to a Record<string, T> type.
	 *
	 * @param jsonObject The JSON object to convert.
	 * @returns A new Record<string, T> object with the same key-value pairs as the original JSON object.
	 * @template T The type defined by the input JSON object.
	 * @example
	 *
	 * ```js
	 *  import { to } from '@heliomarpm/helpers';
	 *  import jsonLanguages from './languages.json';
	 *
	 *  const languages: Record<string, string> = to.dictionary<string>(jsonLanguages);
	 *  let jsonLocale: Record<string, string>
	 *  jsonLocale = require(`locales/${navigator.language}`);
	 * ```
	 */
	dictionary<T>(jsonObject: { [key: string]: T }): Record<string, T> {
		return { ...jsonObject } as Record<string, T>;
	},

	/**
	 * Converts a value to a boolean, following these rules:
	 *   - Numeric values are considered `true` except for the string '0'.
	 *   - Strings that match the regular expression `/^true$/i` are considered `true`.
	 *   - All other values are considered `false`.
	 *
	 * @param value - The value to be converted to a boolean.
	 * @returns `boolean` The boolean representation of the input value.
	 */
	boolean(value: number | string): boolean {
		const str = String(value).trim().toLowerCase();
		return Is.numeric(value) ? str !== "0" : str === "true";
	},

	/**
	 * Extracts parts of a date such as year, month, day, etc.
	 *
	 * @param date - The date to be parsed, can be a Date object or a string.
	 * @returns An object containing year, month, day, hour, minute, second, and timestamp.
	 */
	dateParts(date: Date | string | number): DatePartsType {
		const parsedDate = !(date instanceof Date) ? new Date(date) : date;

		if (Number.isNaN(parsedDate.getTime())) {
			throw new Error("Invalid date");
		}

		return {
			year: parsedDate.getFullYear(), // Extract year
			month: parsedDate.getMonth() + 1, // Extract month (zero-based, so add 1)
			day: parsedDate.getDate(), // Extract day
			hour: parsedDate.getHours(), // Extract hour
			minute: parsedDate.getMinutes(), // Extract minute
			second: parsedDate.getSeconds(), // Extract second
			timestamp: parsedDate.getTime(), // Extract timestamp
		};
	},

	/**
	 * Converts a value to a number, following these rules:
	 *   - Numeric values are considered as-is.
	 *   - Strings that match the regular expression `/^\d+$/` are considered as numeric.
	 *   - All other values are considered `NaN`.
	 *
	 * @param value - The value to be converted to a number.
	 * @returns `number` The numeric representation of the input value.
	 */
	number(value: unknown): number {
		return Is.numeric(value) ? Number(value) : Number.NaN;
	},
};

export type DatePartsType = {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
	timestamp: number;
};
