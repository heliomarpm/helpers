import { Is } from "./is";

/**
 * Type representing the parts of a date.
 * @typedef {Object} DatePartsType
 * @property {number} year - The year of the date.
 * @property {number} month - The month of the date (1-12).
 * @property {number} day - The day of the date (1-31).
 * @property {number} hour - The hour of the date (0-23).
 * @property {number} minute - The minute of the date (0-59).
 * @property {number} second - The second of the date (0-59).
 * @property {number} timestamp - The timestamp of the date in milliseconds.
 *
 * @example
 * ```ts
 * const dateParts: DatePartsType = {
 *   year: 2023,
 *   month: 8,
 *   day: 1,
 *   hour: 12,
 *   minute: 0,
 *   second: 0,
 *   timestamp: 1693456000000
 * };
 * console.log(dateParts); //output: { year: 2023, month: 8, day: 1, hour: 12, minute: 0, second: 0, timestamp: 1693456000000 }
 * ```
 *
 * @category Types
 */
export type DatePartsType = {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
	timestamp: number;
};

/**
 * To - A collection of conversion utilities for various data types.
 *
 * @category Core
 * @class
 * @author 	Heliomar P. Marques <https://navto.me/heliomarpm>
 */
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
	 *
	 * @category To.dictionary
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
	 *
	 * @example
	 * ```ts
	 * To.boolean(1); //output: true
	 * To.boolean('true'); //output: true
	 * To.boolean('0'); //output: false
	 * To.boolean('false'); //output: false
	 * To.boolean(null); //output: false
	 * To.boolean(undefined); //output: false
	 * To.boolean(''); //output: false
	 * ```
	 *
	 * @category To.boolean
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
	 *
	 * @example
	 * ```ts
	 * To.dateParts(new Date()); //output: { year: 2023, month: 8, day: 1, hour: 0, minute: 0, second: 0, timestamp: 1693456000000 }
	 * To.dateParts('2023-08-01'); //output: { year: 2023, month: 8, day: 1, hour: 0, minute: 0, second: 0, timestamp: 1693456000000 }
	 * To.dateParts('2023-08-01T00:00:00'); //output: { year: 2023, month: 8, day: 1, hour: 0, minute: 0, second: 0, timestamp: 1693456000000 }
	 * To.dateParts('2023-08-01 00:00:00'); //output: { year: 2023, month: 8, day: 1, hour: 0, minute: 0, second: 0, timestamp: 1693456000000 }
	 * To.dateParts('2023-08-01 00:00:00.000'); //output: { year: 2023, month: 8, day: 1, hour: 0, minute: 0, second: 0, timestamp: 1693456000000 }
	 * To.dateParts('2023-08-01 00:00:00.000Z'); //output: { year: 2023, month: 8, day: 1, hour: 0, minute: 0, second: 0, timestamp: 1693456000000 }
	 * ```
	 *
	 * @category To.dateParts
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
	 *
	 * @example
	 * ```ts
	 * To.number(123); //output: 123
	 * To.number('123'); //output: 123
	 * To.number('123.45'); //output: NaN
	 * To.number('abc'); //output: NaN
	 * To.number(null); //output: NaN
	 * ```
	 *
	 * @category To.number
	 */
	number(value: unknown): number {
		return Is.numeric(value) ? Number(value) : Number.NaN;
	},
};
