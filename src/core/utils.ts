/** biome-ignore-all lint/suspicious/noExplicitAny: false positive */

import { To } from "./to";

/**
 * A utility object that provides various helper functions for common tasks.
 * @category Types
 * @internal
 */
type MemoizedFn<P extends unknown[], R> = {
	(...args: P): R;
	clear: () => void;
};

/**
 * A function that takes an input of type I and returns an output of type O.
 *
 * @category Types
 * @internal
 */
type Fn<I, O> = (input: I) => O;

/**
 * Options for retrying a function.
 * @property {number} [retries=3] - The number of times to retry the function.
 * @property {number} [delay=1000] - The delay in milliseconds between retries.
 * @property {(error: Error, attempt: number) => void} [onRetry] - A callback function that is called before each retry.
 *
 * @example
 * ```ts
 * import { Utils } from '@heliomarpm/helpers';
 *
 * const unreliableFunction = () => {
 *   if (Math.random() < 0.7) {
 *     throw new Error('Random failure');
 *   }
 *   return 'Success';
 * };
 *
 * const result = await Utils.retry(unreliableFunction, {
 *   retries: 5,
 *   delay: 2000,
 *   onRetry: (error, attempt) => {
 *     console.log(`Attempt ${attempt} failed: ${error.message}`);
 *   }
 * });
 *
 * console.log(result); // 'Success' (if successful within the retry limit)
 * ```
 *
 * @category Types
 */
export type RetryOptions = {
	retries?: number;
	delay?: number;
	onRetry?: (error: Error, attempt: number) => void;
};

/**
 * Utils - A collection of general-purpose utility functions.
 *
 * @category Core
 * @class
 * @author 	Heliomar P. Marques <https://navto.me/heliomarpm>
 */
export const Utils = {
	/**
	 * Generates a random valid CPF (Brazilian National Register of Individuals)
	 * @returns a string containing the generated CPF
	 * @example
	 * ```ts
	 * import { Utils } from '@heliomarpm/helpers';
	 *
	 * const cpf = Utils.gerarCPF();
	 * console.log(cpf); // e.g., "12345678909"
	 * ```
	 *
	 * @category Utils.gerarCPF
	 */
	gerarCPF: (): string => {
		const calcularDigito = (cpf: string | string[]) => {
			let soma = 0;
			let peso = cpf.length + 1;

			for (const element of cpf) {
				soma += Number.parseInt(element, 10) * peso;
				peso--;
			}

			const resto = soma % 11;
			return resto < 2 ? "0" : (11 - resto).toString();
		};

		let cpf = "";
		for (let i = 0; i < 9; i++) {
			cpf += Math.floor(Math.random() * 10).toString();
		}
		const primeiroDigito = calcularDigito(cpf);
		const segundoDigito = calcularDigito(cpf + primeiroDigito);

		return `${cpf}${primeiroDigito}${segundoDigito}`;
	},

	/**
	 * Generates a random valid CNPJ (Brazilian National Corporate Registration Number)
	 * @returns a string containing the generated CNPJ
	 * @example
	 * ```ts
	 * import { Utils } from '@heliomarpm/helpers';
	 *
	 * const cnpj = Utils.gerarCNPJ();
	 * console.log(cnpj); // e.g., "12345678000195"
	 * ```
	 *
	 * @category Utils.gerarCNPJ
	 */
	gerarCNPJ: (): string => {
		const calcPrimeiroDigito = (cnpj: string | string[]) => {
			const pesos = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
			let soma = 0;

			for (let i = 0; i < 12; i++) {
				soma += Number.parseInt(cnpj[i], 10) * pesos[i];
			}
			const resto = soma % 11;
			return resto < 2 ? "0" : (11 - resto).toString();
		};

		const calcSegundoDigito = (cnpj: string | string[]) => {
			const pesos = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
			let soma = 0;
			for (let i = 0; i < 13; i++) {
				soma += Number.parseInt(cnpj[i], 10) * pesos[i];
			}
			const resto = soma % 11;
			return resto < 2 ? "0" : (11 - resto).toString();
		};

		let cnpj = "";
		for (let i = 0; i < 12; i++) {
			cnpj += Math.floor(Math.random() * 10).toString();
		}
		const primeiroDigito = calcPrimeiroDigito(cnpj);
		const segundoDigito = calcSegundoDigito(cnpj + primeiroDigito);

		return `${cnpj}${primeiroDigito}${segundoDigito}`;
	},

	/**
	 * Returns a function that sorts an array of objects by the given properties.
	 *
	 * If a property name starts with a '-', the sort order is reversed.
	 *
	 * The function returned is a compare function, compliant with the API of
	 * `Array.prototype.sort()`.
	 *
	 * When sorting, all values are converted to strings. If a value is an object,
	 * it is converted to a string using `JSON.stringify()`.
	 *
	 * @param {string | string[]} properties - Properties to sort by.
	 * @returns {function} a compare function
	 *
	 * @example
	 * ```ts
	 * const validations = [
	 *     { level: "WARNING", type: "TypeA", message: "This is a warning." },
	 *     { level: "ERROR", type: "TypeE", message: "Something went wrong." },
	 *     { level: "ERROR", type: "TypeE", message: "Another error." },
	 * ];
	 *
	 * const sortedValidations = validations.sort(Utils.sortBy(['level', 'type', '-message']));
	 * console.log(sortedValidations); // [{ level: "ERROR", type: "TypeE", message: "Something went wrong." }, ...]
	 * ```
	 *
	 * @category Utils.sortBy
	 */
	sortBy(properties: string | string[]): (objA: Record<string, unknown>, objB: Record<string, unknown>) => number {
		const propertyList = Array.isArray(properties) ? properties : [properties];

		const stringifyValue = (value: unknown): string => {
			return String(typeof value === "object" ? JSON.stringify(value || "") : value || "");
		};

		return (objA, objB) => {
			for (const property of propertyList) {
				let sortOrder = 1;
				let propName = property;

				if (property.startsWith("-")) {
					sortOrder = -1;
					propName = property.substring(1);
				}

				const comparisonResult = stringifyValue(objA[propName]).localeCompare(stringifyValue(objB[propName]));

				if (comparisonResult !== 0) {
					return comparisonResult * sortOrder;
				}
			}
			return 0;
		};
	},

	/**
	 * @deprecated Use `Utils.sortBy` instead
	 */
	sortByProps(properties: string | string[]): (objA: Record<string, unknown>, objB: Record<string, unknown>) => number {
		return this.sortBy(properties);
	},

	/**
	 * Sorts an array of objects by the specified key in ascending or descending order.
	 *
	 * @template T - The type of objects within the array.
	 * @template K - The key of the object by which the array should be sorted.
	 * @param list - The array of objects to be sorted.
	 * @param key - The key of the object to sort by.
	 * @param orderBy - The order of sorting, either 'asc' for ascending or 'desc' for descending. Defaults to 'asc'.
	 * @returns A new array sorted by the specified key in the specified order.
	 *
	 * @example
	 * ```ts
	 * const people = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }];
	 * const sortedByName = orderBy(people, 'name'); // Sorts by name in ascending order.
	 * const sortedByAgeDesc = orderBy(people, 'age', 'desc'); // Sorts by age in descending order.
	 * console.log(sortedByName); // [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]
	 * console.log(sortedByAgeDesc); // [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]
	 * ```
	 *
	 * @category Utils.orderBy
	 */
	orderBy: <T, K extends keyof T>(list: T[], key: K, orderBy: "asc" | "desc" = "asc"): T[] => {
		return list.sort((a, b) => {
			const aValue = a[key] as string | number;
			const bValue = b[key] as string | number;

			return orderBy === "asc" ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
		});
	},

	/**
	 * Groups an array of objects by a specified key.
	 *
	 * @template T - The type of objects in the array.
	 * @template K - The type of the key to group by.
	 * @param arr - The array of objects to group.
	 * @param keyFn - A function that takes an object and returns the key to group by.
	 * @returns An object where each key is a unique value of the specified key and each value is an array of objects with that key.
	 *
	 * @example
	 *
	 * ```ts
	 * const people = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }];
	 * const grouped = Utils.groupBy(people, (person) => person.age);
	 * console.log(grouped); // { 30: [{ name: 'Alice', age: 30 }], 25: [{ name: 'Bob', age: 25 }] }
	 * ```
	 *
	 * @category Utils.groupBy
	 */
	groupBy: <T, K extends keyof unknown>(arr: T[], keyFn: (item: T) => K): Record<K, T[]> => {
		return arr.reduce(
			(acc, item) => {
				const key = keyFn(item);
				if (!acc[key]) acc[key] = [];
				acc[key].push(item);
				return acc;
			},
			{} as Record<K, T[]>
		);
	},

	/**
	 * Divide an array into smaller chunks of a specified size.
	 *
	 * @param arr - The array to chunk.
	 * @param size - The size of each chunk.
	 * @returns An array of chunks.
	 *
	 * @example
	 * ```ts
	 * const arr = [1, 2, 3, 4, 5];
	 * const chunks = Utils.chunk(arr, 2);
	 * console.log(chunks); // [[1, 2], [3, 4], [5]]
	 * ```
	 *
	 * @category Utils.chunk
	 */
	chunk: <T>(arr: T[], size: number): T[][] => {
		if (size <= 0) throw new Error("Chunk size must be greater than 0");
		const chunks: T[][] = [];
		for (let i = 0; i < arr.length; i += size) {
			chunks.push(arr.slice(i, i + size));
		}
		return chunks;
	},

	/**
	 * Retrieves a nested value from an object using a dot-separated path.
	 *
	 * @param obj The target object from which to retrieve the nested value.
	 * @param path A dot-separated string indicating the path to the nested value.
	 * @returns The nested value or `undefined` if the path is invalid.
	 *
	 * @example
	 * ```ts
	 * const data = {
	 *   user: {
	 *     name: {
	 *       first: "John",
	 *       last: "Doe"
	 *     }
	 *   }
	 * };
	 * const firstName = getNestedValue(data, "user.name.first"); // "John"
	 * ```
	 * @category Utils.getNestedValue
	 */
	getNestedValue: <T>(obj: Record<string, T>, path: string): T | undefined => {
		try {
			return path.split(".").reduce((acc, key) => acc[key] as Record<string, T>, obj) as T;
		} catch {
			return undefined;
		}
	},

	/**
	 * Sets a nested value within an object given a path.
	 *
	 * @param target The object to set the nested value on.
	 * @param path The path to the nested value. Uses dot notation.
	 * @param value The value to set the nested value to.
	 *
	 * @example
	 * ```ts
	 * interface User {
	 *   user: {
	 *     name: {
	 *       first: string;
	 *       last: string;
	 *     }
	 *   }
	 * }
	 * const data: User = {
	 *   user: {
	 *     name: {
	 *       first: "John",
	 *       last: "Doe"
	 *     }
	 *   }
	 * };
	 * setNestedValue<User>(data, "user.name.first", "Jane"); // Sets data.user.name.first to "Jane"
	 * ```
	 * @category Utils.setNestedValue
	 */
	setNestedValue: <T extends Record<string, unknown>>(target: T, path: string, value: unknown): void => {
		if (!target) {
			throw new Error("Target object is required.");
		}

		if (path.trim() === "") {
			throw new Error("Path is required.");
		}

		// Divide a string da chave, lidando com arrays corretamente
		const keys = path.match(/[^.[\]]+/g) as string[];

		let acc: Record<string, unknown> = target;
		keys.forEach((key: string, index: number) => {
			const isLastKey = index === keys.length - 1;
			const nextKey = keys[index + 1];
			const isNextKeyArrayIndex = nextKey !== undefined && /^\d+$/.test(nextKey);

			// Converte índices para número, se for um array
			const parsedKey = /^\d+$/.test(key) ? Number(key) : key;

			if (isLastKey) {
				acc[parsedKey] = value;
			} else {
				if (!(parsedKey in acc)) {
					acc[parsedKey] = isNextKeyArrayIndex ? [] : {};
				}
				acc = acc[parsedKey] as Record<string, unknown>;
			}
		});
	},

	/**
	 * Returns the first argument if it is not null or undefined, otherwise returns the second argument.
	 * @param value The value to check.
	 * @param fallback The value to return if `value` is null or undefined.
	 * @returns The first argument if it is not null or undefined, otherwise the second argument.
	 *
	 * @example
	 * ```ts
	 * const foo = "hello";
	 * const bar = ifNull(foo, "baz"); // "hello"
	 * ```
	 *
	 * @category Utils.ifNull
	 */
	ifNull: <T>(value: T, fallback: T): T => {
		return value ?? fallback;
	},

	/**
	 * Returns the first non-null, non-undefined, and non-empty value from the given arguments.
	 *
	 * @param values - A list of values to check.
	 * @returns The first valid value or `undefined` if all values are null, undefined, or empty.
	 *
	 * @example
	 * ```ts
	 * const result = ifNullOrEmpty(null, '', undefined, 'Hello', 'World'); // "Hello"
	 * const result2 = ifNullOrEmpty(null, '', 0); // 0
	 * const result3 = ifNullOrEmpty([], {}); // undefined
	 * ```
	 *
	 * @remarks
	 * A value is considered "empty" if it is:
	 * - An empty string (`''` or strings with only whitespace)
	 * - An empty array (`[]`)
	 * - An empty object (`{}`)
	 *
	 * @category Utils.ifNullOrEmpty
	 */
	ifNullOrEmpty: <T>(...values: (T | null | undefined)[]): T | undefined => {
		return values.find(
			(value): value is T =>
				value !== null &&
				value !== undefined &&
				(typeof value !== "string" || value.trim() !== "") &&
				(!Array.isArray(value) || value.length !== 0) &&
				(typeof value !== "object" || Object.keys(value).length !== 0)
		);
	},

	/**
	 * Generates a random UUID (universally unique identifier) according to the v4 variant
	 * (RFC 4122). The generated UUID is a string of 36 characters, with 8-4-4-4-12
	 * hexadecimal digits separated by hyphens.
	 *
	 * Note: This function relies on the `crypto.randomUUID` or `crypto.getRandomValues`
	 * functions to generate random numbers. If neither of these functions is available,
	 * an error is thrown.
	 * @returns A random UUID string.
	 *
	 * @example
	 * ```ts
	 * const uuid = Utils.generateUUIDv4();
	 * console.log(uuid); // e.g., "550e8400-e29b-41d4-a716-446655440000"
	 * ```
	 * @category Utils.generateGuid
	 */
	generateUUIDv4: (): string => {
		if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
			return crypto.randomUUID();
		}

		if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
			const randomBytes = new Uint8Array(16);
			crypto.getRandomValues(randomBytes);

			// Set version bits to 4
			randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
			// Set variant bits to 10xx (variant 1)
			randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

			// Convert to hex string with dashes
			return [
				[...randomBytes.slice(0, 4)].map((b) => b.toString(16).padStart(2, "0")).join(""),
				[...randomBytes.slice(4, 6)].map((b) => b.toString(16).padStart(2, "0")).join(""),
				[...randomBytes.slice(6, 8)].map((b) => b.toString(16).padStart(2, "0")).join(""),
				[...randomBytes.slice(8, 10)].map((b) => b.toString(16).padStart(2, "0")).join(""),
				[...randomBytes.slice(10, 16)].map((b) => b.toString(16).padStart(2, "0")).join(""),
			].join("-");
		}

		throw new Error("Crypto API not available.");
	},

	/**
	 * A set of cryptographic utility functions for key generation, encryption, and decryption using the Web Crypto API.
	 *
	 * @category Utils.crypto
	 * @namespace crypto
	 */
	crypto: {
		/**
		 * Generates a new 256-bit AES-GCM key.
		 *
		 * @returns A Promise that resolves to a CryptoKey that can be used for encryption and decryption.
		 *
		 * @example
		 * ```ts
		 * const key = await generateKey();
		 * ```
		 */
		async generateKey(): Promise<CryptoKey> {
			if (typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined") {
				return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
			}
			throw new Error("Crypto API not available.");
		},

		/**
		 * Encrypts a string using AES-GCM algorithm and returns the result as a Base64 string.
		 * @param text The plaintext string to encrypt.
		 * @param key The CryptoKey used for encryption.
		 * @returns A Promise that resolves to the encrypted Base64 string.
		 *
		 * @example
		 * ```ts
		 * const key = await generateKey();
		 * const encrypted = await encrypt("Hello, World!", key);
		 * console.log(encrypted);
		 */
		async encrypt(text: string, key: CryptoKey): Promise<string> {
			if (typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined") {
				if (key.algorithm.name !== "AES-GCM") {
					throw new Error("Invalid key algorithm. Only AES-GCM is supported.");
				}
			} else {
				throw new Error("Crypto API not available.");
			}

			const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector (IV)
			const encodedText = new TextEncoder().encode(text);
			const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedText);

			// Concatenate IV + encrypted data and convert to Base64
			const combined = new Uint8Array(iv.length + encryptedData.byteLength);
			combined.set(iv, 0);
			combined.set(new Uint8Array(encryptedData), iv.length);

			return Buffer.from(combined).toString("base64");
		},

		/**
		 * Decodes a Base64 string and decrypts the contents using the AES-GCM algorithm.
		 * @param encryptedText The Base64 string to decrypt.
		 * @param key The CryptoKey used for decryption.
		 * @returns The decrypted string.
		 *
		 * @example
		 * ```ts
		 * const key = await generateKey();
		 * const encrypted = await encrypt("Hello, World!", key);
		 * const decrypted = await decrypt(encrypted, key);
		 * console.log(decrypted);
		 * ```
		 */
		async decrypt(encryptedText: string, key: CryptoKey): Promise<string> {
			if (typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined") {
				if (key.algorithm.name !== "AES-GCM") {
					throw new Error("Invalid key algorithm. Only AES-GCM is supported.");
				}
			} else {
				throw new Error("Crypto API not available.");
			}

			const rawData = Buffer.from(encryptedText, "base64"); // Decodifica Base64 para Uint8Array
			const iv = rawData.slice(0, 12); // Extrai o IV
			const encryptedData = rawData.slice(12); // Extrai os dados criptografados

			const decryptedData = (await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData)) as ArrayBuffer;

			return new TextDecoder().decode(decryptedData);
		},
	},

	/**
	 * Returns an array of month names for a given locale.
	 *
	 * @param options - An object with options for formatting the month names.
	 * @param options.locale - The locale string to use for formatting the month names.
	 * @param options.month - The type of month name to return. Can be 'long', 'short', or 'numeric'.
	 * @returns An array of month names (e.g., "January", "February", ...) for the specified locale.
	 *
	 * @example
	 * ```ts
	 * const months = monthNames('en-US'); // ["January", "February", ..., "December"]
	 * ```
	 *
	 * @see https://www.w3schools.com/jsref/jsref_tolocalestring.asp
	 * @category Utils.months
	 */
	months: ({ locale = "default", month = "long" }: { locale?: Intl.LocalesArgument; month?: Intl.DateTimeFormatOptions["month"] } = {}): Array<string> => {
		return Array.from({ length: 12 }, (_, i) => {
			const monthName = new Date(2000, i).toLocaleString(locale, { month });
			return monthName.charAt(0).toUpperCase() + monthName.slice(1);
		});
	},

	/**
	 * Returns an array of full weekday names for a given locale.
	 *
	 * @param {Object} [options]
	 * @param {string} [options.locale='default'] - The locale string to use for formatting the weekday names.
	 * @param {string} [options.weekday='long'] - The type of weekday name to return. Can be 'narrow', 'short', or 'long'.
	 * @returns {string[]} An array of full weekday names (e.g., "Sunday", "Monday", ...) for the specified locale.
	 *
	 * @example
	 * ```ts
	 * const days = dayNames({ locale: 'en-US', weekday: 'short' });
	 * // Output: ["Sun", "Mon", ..., "Sat"]
	 * ```
	 *
	 * @see https://www.w3schools.com/jsref/jsref_tolocalestring.asp
	 * @category Utils.weekdays
	 */
	weekdays: ({ locale = "default", weekday = "long" }: { locale?: Intl.LocalesArgument; weekday?: Intl.DateTimeFormatOptions["weekday"] } = {}): Array<string> => {
		const firstSunday = new Date(2000, 0, 1);
		firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());

		return Array.from({ length: 7 }, (_, i) => {
			const dayName = new Date(firstSunday.getFullYear(), firstSunday.getMonth(), firstSunday.getDate() + i).toLocaleString(locale, { weekday });
			return dayName.charAt(0).toUpperCase() + dayName.slice(1);
		});
	},

	/**
	 * Pauses execution for a specified duration.
	 * @param ms - The number of milliseconds to wait.
	 * @returns A promise that resolves after the specified duration.
	 *
	 * @example
	 * ```
	 * await sleep(1000); // Pauses for 1 second
	 * ```
	 *
	 * @category Utils.sleep
	 */
	sleep: async (ms: number): Promise<void> => {
		if (ms < 0 || Number.isNaN(ms)) {
			throw new Error("The 'ms' parameter must be greater than 0.");
		}

		return new Promise((resolve) => setTimeout(resolve, ms));
	},

	/**
	 * Executes a function and retries it if it fails, up to a specified number of attempts.
	 *
	 * @param fn - The function to execute and retry.
	 * @param options - Options for retrying the function.
	 * @param options.retries - The maximum number of attempts to make before giving up.
	 * @param options.delay - The duration to wait between attempts.
	 * @param options.onRetry - A callback that is called when an attempt fails.
	 * @returns A promise that resolves to the result of the function, or rejects with the last error.
	 *
	 * @example
	 * ```
	 * await retry(() => fetch('https://example.com/api/data'), {
	 *   retries: 5,
	 *   delay: 500,
	 *   onRetry: (error, attempt) => console.log(`Attempt ${attempt} failed with error ${error.message}`)
	 * });
	 * ```
	 *
	 * @category Utils.retry
	 */
	retry: async <T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> => {
		const { retries = 3, delay = 1000, onRetry } = options;

		if (delay < 1 || Number.isNaN(delay)) {
			throw new Error("The 'delay' parameter must be greater than 0.");
		}

		for (let attempt = 1; attempt <= retries; attempt++) {
			try {
				return await fn();
			} catch (error) {
				if (attempt === retries) throw error;

				onRetry?.(error as Error, attempt);
				await Utils.sleep(delay);
			}
		}

		// If we reach this point, all attempts have failed
		throw new Error("Retry attempts exhausted");
	},

	/**
	 * Memoizes a function to avoid redundant computation.
	 *
	 * @param fn - The function to memoize.
	 * @returns A memoized version of the function.
	 *
	 * @example
	 * ```ts
	 * const add = (a: number, b: number) => a + b;
	 * const memoizedAdd = memoize(add);
	 *
	 * const result1 = memoizedAdd(1, 2); // Calls the original function
	 * const result2 = memoizedAdd(1, 2); // Returns cached result
	 * ```
	 *
	 * @remarks
	 * The memoized function has a `clear` method that can be used to clear the cache.
	 *
	 * ```ts
	 * memoizedAdd.clear(); // Clears the cache
	 * ```
	 *
	 * @category Utils.memoize
	 */
	memoize: <P extends unknown[], R>(fn: (...args: P) => R): MemoizedFn<P, R> => {
		const cache = new Map<string, R>();

		const memoized = (...args: P): R => {
			const key = JSON.stringify(args);

			if (cache.has(key)) {
				return cache.get(key) as R;
			}

			// Call the original function if the result is not cached
			const result = fn(...args);
			cache.set(key, result);
			return result;
		};

		memoized.clear = () => cache.clear();
		return memoized;
	},

	/**
	 * Creates a debounced version of the given function. Debouncing is a technique for
	 * optimizing performance by delaying the execution of a function until a specified
	 * delay has passed since the last time it was called.
	 * @param fn - The function to debounce.
	 * @param wait - The delay in milliseconds.
	 * @returns A debounced version of the function.
	 *
	 * @example
	 * ```ts
	 * const add = (a: number, b: number) => a + b;
	 * const debouncedAdd = debounce(add, 500);
	 *
	 * debouncedAdd(1, 2); // Calls the function immediately
	 * debouncedAdd(3, 4); // Calls the function after 500ms
	 *
	 * const debouncedSearch = debounce(searchFunction, 300);
	 * input.addEventListener('input', debouncedSearch);
	 * ```
	 *
	 * @category Utils.debounce
	 */
	debounce: <T extends (...args: unknown[]) => unknown>(fn: T, wait: number): T => {
		let timeoutId: NodeJS.Timeout;

		return function (this: unknown, ...args: Parameters<T>) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => fn.apply(this, args), wait);
		} as T;
	},

	/**
	 * Creates a throttled version of the given function. Throttling is a technique for
	 * optimizing performance by limiting the number of times a function can be called
	 * within a specified time window.
	 * @param fn - The function to throttle.
	 * @param wait - The time window in milliseconds.
	 * @returns A throttled version of the function.
	 *
	 * @example
	 * ```ts
	 * const add = (a: number, b: number) => a + b;
	 * const throttledAdd = throttle(add, 500);
	 *
	 * throttledAdd(1, 2); // Calls the function immediately
	 * throttledAdd(3, 4); // Calls the function after 500ms if the previous call was outside the time window
	 *
	 * const throttledScroll = throttle(handleScroll, 200);
	 * window.addEventListener('scroll', throttledScroll);
	 * ```
	 *
	 * @category Utils.throttle
	 */
	throttle: <T extends (...args: unknown[]) => unknown>(fn: T, wait: number): ((...args: Parameters<T>) => ReturnType<T>) => {
		let lastRun = 0;
		let timeoutId: NodeJS.Timeout;
		let lastResult: ReturnType<T>;

		return (...args: Parameters<T>): ReturnType<T> => {
			const now = Date.now();
			const timeLastRun = now - lastRun;

			if (timeLastRun >= wait) {
				lastResult = fn(...args) as ReturnType<T>;
				lastRun = now;
				return lastResult;
			}

			if (timeoutId) clearTimeout(timeoutId);

			const remainingTime = wait - timeLastRun;

			timeoutId = setTimeout(() => {
				lastRun = Date.now();
				lastResult = fn(...args) as ReturnType<T>;
			}, remainingTime);

			// Return the last result
			return lastResult;
		};
	},

	/**
	 * Creates a version of the given function that can only be called once.
	 * The first call to the function is executed normally, but any subsequent
	 * calls return the result of the first call.
	 * @param fn - The function to wrap, which takes arguments of type P and returns R.
	 * @returns A version of the function that can only be called once, taking P and returning R.
	 *
	 * @example
	 * ```ts
	 * const add = (a: number, b: number) => a + b;
	 * const onceAdd = once(add);
	 *
	 * const result1 = onceAdd(1, 2); // Calls the function and returns 3
	 * const result2 = onceAdd(3, 4); // Returns 3
	 *
	 * const init = once(() => console.log('Inicializado'));
	 * init(); // 'Inicializado'
	 * init(); // nada acontece
	 * ```
	 *
	 * @category Utils.once
	 */
	once: <P extends unknown[], R>(fn: (...args: P) => R): ((...args: P) => R) => {
		let called = false;
		let result: R;

		return (...args: P): R => {
			if (!called) {
				called = true;
				result = fn(...args);
			}
			return result;
		};
	},

	/**
	 * Composes multiple unary functions from left to right.
	 * Ensures type safety between function outputs and inputs
	 *
	 * @param fns - An array of functions to be composed.
	 * @returns A function that takes a single argument and processes it through
	 * the composed sequence of functions.
	 *
	 * @throws Will throw an error if no functions are provided or if any argument is not a function.
	 *
	 * @example
	 * ```ts
	 * const addOne = (x: number) => x + 1;
	 * const numToString = (x: number) => String(x);
	 * const length = (s: string) => s.length;
	 *
	 * const process = Utils.pipe(addOne, numToString, length);
	 * console.log(process(5)); // 1
	 * ```
	 * @category Utils.pipe
	 */
	pipe: <T extends unknown[], R>(...fns: { [K in keyof T]: Fn<any, any> }): ((arg: T[0]) => R) => {
		if (fns.length === 0) {
			throw new Error("No functions provided to pipe");
		}
		if (fns.length === 1) {
			return fns[0];
		}
		return fns.reduce((acc, fn) => (input) => fn(acc(input))) as (arg: T[0]) => R;
	},
	// pipe: <T extends AnyValue[], R>(...fns: { [K in keyof T]: Fn<AnyValue, AnyValue> }): ((arg: T[0]) => R) => {
	// 	if (fns.length === 0) {
	// 		throw new Error("No functions provided to pipe");
	// 	}

	// 	return (input: T[0]) => {
	// 		return fns.reduce((acc, fn, index) => {
	// 			if (typeof fn !== "function") {
	// 				throw new Error(`Argument at index ${index} is not a function`);
	// 			}
	// 			return fn(acc);
	// 		}, input) as R;
	// 	};
	// },

	/**
	 * Composes multiple unary functions from right to left.
	 * Ensures type safety between function outputs and inputs
	 *
	 * @param fns - An array of functions to be composed.
	 * @returns A function that takes a single argument and processes it through
	 * the composed sequence of functions.
	 *
	 * @throws Will throw an error if no functions are provided or if any argument is not a function.
	 *
	 * @example
	 *
	 * ```ts
	 * const addOne = (x: number) => x + 1;
	 * const numToString = (x: number) => String(x);
	 * const length = (s: string) => s.length;
	 *
	 * const process = Utils.compose(length, numToString, addOne);
	 * console.log(process(5)); // 1
	 * ```
	 * @category Utils.compose
	 */
	compose: <T extends unknown[], R>(...fns: { [K in keyof T]: Fn<any, any> }): ((arg: T[0]) => R) => {
		if (fns.length === 0) {
			throw new Error("No functions provided to compose");
		}
		if (fns.length === 1) {
			return fns[0];
		}
		return fns.reduceRight((acc, fn) => (input) => fn(acc(input))) as (arg: T[0]) => R;
	},
	// compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
	// 	// return pipe(...fns.reverse());
	// 	return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
	// }

	/**
	 * Generates a random integer between the specified minimum and maximum values, inclusive.
	 * @param min - The minimum value (inclusive).
	 * @param max - The maximum value (inclusive).
	 * @returns A random integer between `min` and `max`.
	 *
	 * @example
	 * ```ts
	 * const randomNum = Utils.randomNum(1000, 2000);
	 * console.log(randomNum); // Outputs a random integer between 1000 and 2000
	 * ```
	 *
	 * @category Utils.randomNum
	 */
	randomNum: (min: number, max: number): number => {
		// throw new Error("The 'min' parameter must be less than 'max'.");
		if (min > max) return Number.NaN;
		if (min === max) return min;

		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	/**
	 * Returns a random value from the given array.
	 * @param values - The array of values to choose from.
	 * @returns A random value from the given array.
	 *
	 * @example
	 *
	 * ```ts
	 * const randomValue = Utils.randomValue(["apple", "banana", "cherry"]);
	 * console.log(randomValue); // Outputs a random value from the array
	 * ```
	 *
	 * @category Utils.randomValue
	 */
	randomValue: <T>(values: T[]): T => {
		return values[Utils.randomNum(0, values.length - 1)];
	},

	/**
	 * Clamps a number between a minimum and maximum value.
	 * @param num - The number to clamp.
	 * @param min - The minimum value.
	 * @param max - The maximum value.
	 * @returns The clamped number.
	 *
	 * @example
	 * ```ts
	 * const clampedValue = Utils.clamp(10, 1, 5);
	 * console.log(clampedValue); // Outputs: 5
	 * ```
	 *
	 * @category Utils.clamp
	 */
	clamp: (num: number, min: number, max: number): number => {
		if (min > max) {
			throw new Error("The 'min' parameter must be less than or equal to 'max'.");
		}
		return Math.min(Math.max(num, min), max);
	},

	/**
	 * Creates a new object by omitting specified keys from the original object.
	 *
	 * @param obj - The source object.
	 * @param keys - An array of keys to omit from the source object.
	 * @returns A new object containing all key-value pairs except the omitted keys.
	 *
	 * @example
	 * ```ts
	 * const user = { id: 1, name: 'John', age: 30, email: 'dL5mW@example.com' };
	 *
	 * const omittedUser = Utils.omit(user, ['id', 'email']);
	 * console.log(omittedUser); // { name: 'John', age: 30 }
	 * ```
	 *
	 * @category Utils.omit
	 */
	omit: <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> => {
		if (typeof obj !== "object" || obj === null) {
			throw new Error("The 'obj' parameter must be a non-null object.");
		}
		if (!Array.isArray(keys)) {
			throw new Error("The 'keys' parameter must be an array of strings.");
		}

		return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key as K))) as Omit<T, K>;
	},

	/**
	 * Creates a new object by omitting specified paths from the original object.
	 *
	 * @param obj - The source object.
	 * @param paths - An array of paths to omit from the source object.
	 * @returns A new object containing all key-value pairs except the omitted paths.
	 *
	 * @example
	 * ```ts
	 * const user = { id: 1, name: 'John', age: 34, childs: [ {name: 'John II', age: 10 }, { name: 'Jane II', age: 8 }, { name: 'dog', age: 2 } ]  };
	 *
	 * const omittedDog = Utils.deepOmit(user, ['id', 'age', 'childs.2']);
	 * console.log(omittedDog); // { name: 'John', childs: [ {name: 'John II', age: 10 }, { name: 'Jane II', age: 8 } ] }
	 *
	 * const omittedProps = Utils.deepOmit(user, ['id', 'age', 'childs']);
	 * console.log(omittedProps); // { name: 'John' }
	 * ```
	 *
	 * @category Utils.deepOmit
	 *
	 */
	deepOmit: <T extends Record<string, unknown>>(obj: T, paths: readonly string[]): Partial<T> => {
		if (typeof obj !== "object" || obj === null) {
			throw new Error("The 'obj' parameter must be a non-null object.");
		}
		if (!Array.isArray(paths)) {
			throw new Error("The 'paths' parameter must be an array of strings.");
		}

		// Clonagem profunda segura
		const clone = typeof structuredClone === "function" ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));

		for (const path of paths) {
			const parts = path.split(".");
			let current = clone;

			for (let i = 0; i < parts.length - 1; i++) {
				const key = parts[i];
				if (!(key in current)) {
					current = undefined;
					break;
				}
				current = current[key];
			}

			if (current !== undefined) {
				const last = parts.at(-1);

				if (last) {
					// Se for array e last for índice
					if (Array.isArray(current) && !Number.isNaN(Number(last))) {
						current.splice(Number(last), 1);
					} else {
						delete current[last];
					}
				}
			}
		}

		return clone;
	},

	/**
	 * Creates a new object by picking specified keys from the original object.
	 *
	 * @param obj - The source object.
	 * @param keys - An array of keys to pick from the source object.
	 * @returns A new object containing only the picked key-value pairs.
	 *
	 * @example
	 * ```ts
	 * const user = { id: 1, name: 'John', age: 30, email: 'dL5mW@example.com' };
	 * const pickedUser = Utils.pick(user, ['id', 'name']);
	 * console.log(pickedUser); // { id: 1, name: 'John' }
	 * ```
	 *
	 * @category Utils.pick
	 */
	pick: <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> => {
		if (typeof obj !== "object" || obj === null) {
			throw new Error("The 'obj' parameter must be a non-null object.");
		}
		if (!Array.isArray(keys)) {
			throw new Error("The 'keys' parameter must be an array of strings.");
		}

		return Object.fromEntries(keys.filter((key) => key in obj).map((key) => [key, obj[key]])) as Pick<T, K>;
	},

	/**
	 * Creates a new object by picking specified paths from the original object.
	 *
	 * @param obj - The source object.
	 * @param paths - An array of paths to pick from the source object.
	 * @returns A new object containing only the picked key-value pairs.
	 *
	 * @example
	 *
	 * ```ts
	 * const user = { id: 1, name: 'John', age: 34, childs: [ {name: 'John II', age: 10 }, { name: 'Jane II', age: 8 }, { name: 'dog', age: 2 } ]  };
	 *
	 * const pickedDog = Utils.deepPick(user, ['id', 'age', 'childs.2']);
	 * console.log(pickedDog); // { id: 1, age: 34, childs: [ {name: 'dog', age: 2 } ] }
	 *
	 * const pickedProps = Utils.deepPick(user, ['id', 'age', 'childs']);
	 * console.log(pickedProps); // { id: 1, age: 34, childs: [ {name: 'John II', age: 10 }, { name: 'Jane II', age: 8 }, { name: 'dog', age: 2 } ] }
	 * ```
	 *
	 * @category Utils.deepPick
	 */
	deepPick: <T extends Record<string, unknown>>(obj: T, paths: readonly string[]): Partial<T> => {
		if (typeof obj !== "object" || obj === null) {
			throw new Error("The 'obj' parameter must be a non-null object.");
		}
		if (!Array.isArray(paths)) {
			throw new Error("The 'paths' parameter must be an array of strings.");
		}

		const result = {};

		for (const path of paths) {
			const parts = path.split(".");
			let currentSrc: T = obj;
			let currentDst: Record<string, unknown> = result;

			for (let i = 0; i < parts.length; i++) {
				const key = parts[i];
				if (!(key in currentSrc)) break;

				// Se for o último nó, copia valor
				if (i === parts.length - 1) {
					// deep clone para não compartilhar referência.
					currentDst[key] = typeof structuredClone === "function" ? structuredClone(currentSrc[key]) : JSON.parse(JSON.stringify(currentSrc[key]));
				} else {
					// Se próximo nível não existir em destino, cria (array ou objeto)
					if (!(key in currentDst)) {
						currentDst[key] = Array.isArray(currentSrc[key]) ? [] : {};
					}
					currentDst = currentDst[key] as Record<string, unknown>;
					currentSrc = currentSrc[key] as T;
				}
			}
		}

		// Limpa arrays vazios
		const cleanArrays = <T>(obj: T): T => {
			if (Array.isArray(obj)) {
				return obj.filter((v) => v !== undefined).map(cleanArrays) as unknown as T;
			}
			if (obj && typeof obj === "object") {
				return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, cleanArrays(v)])) as unknown as T;
			}
			return obj;
		};

		// e no final da sua função:
		return cleanArrays(result);
	},

	/**
	 * Returns the day of the year (1-365) (ISO 8601)
	 *
	 * @param {Date|string|number} [input=new Date()] - The date to get the day of the year for.
	 * @returns {number} The day of the year (1-365).
	 *
	 * @example
	 * ```ts
	 * const today = new Date();
	 * const dayOfYear = Utils.dayOfYear(today);
	 * console.log(dayOfYear); // 1-365
	 * ```
	 *
	 * @category Utils.dayOfYear
	 */
	dayOfYear: (input: Date | string | number = new Date()): number => {
		const date = To.date(input);
		// Zera a hora para evitar problemas de timezone
		const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
		const current = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
		const oneDay = 1000 * 60 * 60 * 24;

		return Math.floor((current - start.getTime()) / oneDay);
	},

	/**
	 * Returns the number of days in a given month.
	 *
	 * @param {number} [year=new Date().getFullYear()] - The year to get the number of days for.
	 * @param {number} [month=new Date().getMonth() + 1] - The month to get the number of days for (1-12).
	 * @returns {number} The number of days in the given month.
	 *
	 * @example
	 * ```ts
	 * const daysInMonth = Utils.daysInMonth(2025, 1);
	 * console.log(daysInMonth); // 30-31
	 * ```
	 *
	 * @category Utils.daysInMonth
	 */
	daysInMonth: (year: number = new Date().getFullYear(), month: number = new Date().getMonth() + 1): number => {
		return new Date(year, month, 0).getDate();
	},

	/**
	 * Returns the week of the year (ISO 8601)
	 *
	 * @param {Date|string|number} [input=new Date()] - The date to get the week of the year for.
	 * @returns {number} The week of the year (1-53).
	 *
	 * @example
	 * ```ts
	 * const today = new Date();
	 * const weekOfYear = Utils.weekOfYear(today);
	 * console.log(weekOfYear); // 1-53
	 * ```
	 *
	 * @category Utils.weekOfYear
	 */
	weekOfYear: (input: Date | string | number = new Date()): number => {
		const date = To.date(input);
		const temp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

		// Ajusta para a quinta-feira da semana atual (regra ISO)
		const day = temp.getUTCDay() || 7;
		temp.setUTCDate(temp.getUTCDate() + 4 - day);

		// Calcula o número da semana
		const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
		const weekNo = Math.ceil(((Number(temp) - Number(yearStart)) / 86400000 + 1) / 7);

		return weekNo;
	},

	/**
	 * Returns the easter date
	 *
	 * @param year - The year to get the easter date for. Defaults to the current year.
	 * @returns {Date} The easter date.
	 *
	 * @example
	 * ```ts
	 * const easterDate = Utils.easterDate(2022);
	 * console.log(easterDate); // Date(2022, 3, 17) -> April 17, 2022
	 * ```
	 *
	 * @category Utils.easterDate
	 */
	easterDate: (year: number = new Date().getUTCFullYear()): Date => {
		// Cálculos baseados no algoritmo de computus (Método de Meeus)
		const goldenNumber = year % 19; // Número áureo
		const century = Math.floor(year / 100);
		const skippedLeapYears = Math.floor(century / 4);
		const correctionFactor = Math.floor((century + 8) / 25);
		const moonCorrection = Math.floor((century - correctionFactor + 1) / 3);

		const epact = (19 * goldenNumber + century - skippedLeapYears - moonCorrection + 15) % 30;
		const weekdayCorrection = (32 + 2 * (century % 4) + 2 * Math.floor((year % 100) / 4) - epact - (year % 4)) % 7;
		const marchOffset = Math.floor((goldenNumber + 11 * epact + 22 * weekdayCorrection) / 451);

		const month = Math.floor((epact + weekdayCorrection - 7 * marchOffset + 114) / 31) - 1; // 0 = jan
		const day = ((epact + weekdayCorrection - 7 * marchOffset + 114) % 31) + 1;

		return new Date(year, month, day);
	},
};
