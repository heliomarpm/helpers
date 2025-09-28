/**
 * Operating System Enums
 *
 * @category Types
 */
export enum eOS {
	Windows = "win32",
	Linux = "linux",
	MacOS = "darwin",
}

/**
 * Processor Architecture Enums
 *
 * @category Types
 */
export enum eArchitecture {
	x86 = "ia32",
	x64 = "x64",
	Arm = "arm",
	Arm64 = "arm64",
}

const _EMAIL_REGEX = new RegExp(
	// parte local
	"^(?!\\.)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+(?<!\\.)" +
		// @
		"@" +
		// domínio
		"(?!-)[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*" +
		// TLD no mínimo 2 letras
		"\\.[A-Za-z]{2,}$"
);

/**
 * Is - A collection of type-checking and validation utilities.
 *
 * @category Core
 * @class
 * @author Heliomar P. Marques <https://navto.me/heliomarpm>*
 */
export const Is = {
	/**
	 * Plarform - A collection of utilities to check the operating system and processor architecture.
	 *
	 * @example
	 * ```ts
	 * import { Is } from '@heliomarpm/helpers';
	 * console.log(Is.plataform.windowsOS); // Output: true or false
	 * console.log(Is.plataform.linuxOS);   // Output: true or false
	 * console.log(Is.plataform.macOS);     // Output: true or false
	 * console.log(Is.plataform.arch_x86);  // Output: true or false
	 * console.log(Is.plataform.arch_x64);  // Output: true or false
	 * console.log(Is.plataform.arch_Arm);  // Output: true or false
	 * console.log(Is.plataform.arch_Arm64); // Output: true or false
	 * ```
	 *
	 * @category Is.plataform
	 * @namespace plataform
	 */
	plataform: {
		/**
		 * Verifies that it's running on the Windows OS.
		 *
		 * @returns boolean
		 */
		get windowsOS(): boolean {
			return process.platform === eOS.Windows;
		},
		/**
		 * Verifies that it's running on the Linux OS.
		 *
		 * @returns boolean
		 */
		get linuxOS(): boolean {
			return process.platform === eOS.Linux;
		},
		/**
		 * Verifies that it's running on the Mac OS.
		 *
		 * @returns boolean
		 */
		get macOS(): boolean {
			return process.platform === eOS.MacOS;
		},
		/**
		 * Check if the processor architecture is ia32.
		 *
		 * @returns boolean
		 */
		get arch_x86(): boolean {
			return process.arch === eArchitecture.x86;
		},
		/**
		 * Check if the processor architecture is x64.
		 *
		 * @returns boolean
		 */
		get arch_x64(): boolean {
			return process.arch === eArchitecture.x64;
		},
		/**
		 * Check if the processor architecture is arm.
		 *
		 * @returns boolean
		 */
		get arch_Arm(): boolean {
			return process.arch === eArchitecture.Arm;
		},
		/**
		 * Check if the processor architecture is arm64.
		 *
		 * @returns boolean
		 */
		get arch_Arm64(): boolean {
			return process.arch === eArchitecture.Arm64;
		},
	},
	/**
	 * Validates a given value as a CPF (Brazilian National Register of Individuals).
	 *
	 * @param value - The value to be validated as a CPF.
	 * @returns `true` if the input value is a valid CPF, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.cpf("12345678909") // Output: true
	 * ```
	 *
	 * @category Is.cpf
	 */
	cpf(value: string): boolean {
		// Verifica se o CPF contém apenas números, pontos ou traços
		//if (!/^[\d.-]+$/.test(value)) return false;
		if (!/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)) return false;

		const cpf = value.replace(/\D/g, "");

		if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

		const digito = (base: number): number => {
			const sum = cpf
				.slice(0, base)
				.split("")
				.reduce((acc, value, index) => acc + Number.parseInt(value, 10) * (base + 1 - index), 0);
			return ((sum * 10) % 11) % 10;
		};

		return digito(9) === Number.parseInt(cpf[9], 10) && digito(10) === Number.parseInt(cpf[10], 10);
	},

	/**
	 * Validates a given value as a CNPJ (Brazilian National Register of Legal Entities).
	 * Starting from July 1st, 2026, the CNPJ will transition to a new format with letters and numbers.
	 * This implementation will automatically detect the format and validate it accordingly.
	 *
	 * @param value - The value to be validated as a CNPJ.
	 * @returns `true` if the input value is a valid CNPJ, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Utils.cnpj("12.ABC.345/01DE-35") // Output: true
	 * ```
	 *
	 * @category Is.cnpj
	 */
	cnpj(value: string): boolean {
		const isAlfaActive = Date.now() >= new Date("2026-07-01").getTime();

		// if (!/^[\d.-]+$/.test(value)) return false;
		const regexNum = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
		const regexAlfa = /^[A-Z0-9]{14}$|^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-[A-Z0-9]{2}$/i;

		if ((!isAlfaActive && !regexNum.test(value)) || (isAlfaActive && !regexAlfa.test(value))) {
			return false;
		}

		const sanitized = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
		if (sanitized.length !== 14) return false;
		if (/^([A-Z0-9])\1{13}$/.test(sanitized)) return false;
		if (!isAlfaActive && !/^\d{14}$/.test(sanitized)) return false;

		const charToNum = (char: string): number => char.charCodeAt(0) - 48;

		const digits = sanitized.split("").map(charToNum);

		const calcDV = (base: number): number => {
			const weights = base === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

			const sum = weights.reduce((acc, weight, i) => acc + digits[i] * weight, 0);
			const mod = sum % 11;
			return mod < 2 ? 0 : 11 - mod;
		};

		return calcDV(12) === digits[12] && calcDV(13) === digits[13];
	},

	/**
	 * Verifies if the given value is a valid number.
	 * A valid number is either a number primitive or a string that can be parsed to a number.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is a valid number, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.numeric('123'); //output: true
	 * Is.numeric('123.45'); //output: true
	 * Is.numeric('abc'); //output: false
	 * Is.numeric(NaN); //output: false
	 * Is.numeric(3); //output: true
	 * ```
	 *
	 * @category Is.numeric
	 */
	numeric<T>(value: T): boolean {
		return (typeof value === "number" && !Number.isNaN(value)) || (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value)));
	},

	/**
	 * Verifies if two values are equal.
	 * @param left The first value to be compared.
	 * @param right The second value to be compared.
	 * @param ignoreOrder If `true`, ignores the order of elements in arrays and objects.
	 * @returns {boolean} `true` if the values are equal, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.equals({ a: 1, b: 2 }, { b: 2, a: 1 }); //output: true
	 * Is.equals([1, 2, 3], [3, 2, 1], true); //output: true
	 * Is.equals({ a: 1, b: 2 }, { a: 1, b: 3 }); //output: false
	 * Is.equals([1, 2, 3], [1, 2, 3]); //output: true
	 * Is.equals('hello', 'hello'); //output: true
	 * Is.equals(new Set[1], new Set[2]); //output: false
	 * ```
	 *
	 * @category Is.equals
	 */
	equals<T, U>(left: T, right: U, ignoreOrder = false): boolean {
		const seen = new WeakMap();

		const equal = (leftValue: unknown, rightValue: unknown): boolean => {
			if (Object.is(leftValue, rightValue)) return true;
			if (typeof leftValue !== typeof rightValue) return false;
			if (leftValue === null || rightValue === null || typeof leftValue !== "object") return false;

			const typeHandlers: Array<{
				test: (a: unknown, b: unknown) => boolean;
				handler: (a: unknown, b: unknown) => boolean;
			}> = [
				{
					test: (a, b) => a instanceof Date && b instanceof Date,
					handler: (a, b) => (a as Date).getTime() === (b as Date).getTime(),
				},
				{
					test: (a, b) => a instanceof RegExp && b instanceof RegExp,
					handler: (a, b) => (a as RegExp).toString() === (b as RegExp).toString(),
				},
				{
					test: (a, b) => a instanceof Map && b instanceof Map,
					handler: (a, b) => {
						const mapA = a as Map<unknown, unknown>;
						const mapB = b as Map<unknown, unknown>;
						if (mapA.size !== mapB.size) return false;
						for (const [key, val] of mapA.entries()) {
							if (!mapB.has(key) || !equal(val, mapB.get(key))) return false;
						}
						return true;
					},
				},
				{
					test: (a, b) => a instanceof Set && b instanceof Set,
					handler: (a, b) => {
						const setA = a as Set<unknown>;
						const setB = b as Set<unknown>;
						if (setA.size !== setB.size) return false;
						for (const val of setA) {
							if (!setB.has(val)) return false;
						}
						return true;
					},
				},
				{
					test: (a, b) => Array.isArray(a) && Array.isArray(b),
					handler: (a, b) => {
						const arrA = a as unknown[];
						const arrB = b as unknown[];
						if (arrA.length !== arrB.length) return false;
						if (ignoreOrder) {
							const rightCopy = [...arrB];
							return arrA.every((av) => {
								const idx = rightCopy.findIndex((bv) => equal(av, bv));
								if (idx === -1) return false;
								rightCopy.splice(idx, 1);
								return true;
							});
						}
						return arrA.every((av, i) => equal(av, arrB[i]));
					},
				},
			];

			for (const { test, handler } of typeHandlers) {
				if (test(leftValue, rightValue)) return handler(leftValue, rightValue);
			}

			if (seen.has(leftValue)) return seen.get(leftValue) === rightValue;
			seen.set(leftValue, rightValue);

			const leftKeys = Object.keys(leftValue);
			const rightKeys = rightValue ? Object.keys(rightValue) : [];
			if (leftKeys.length !== rightKeys.length) return false;

			return leftKeys.every((key) => rightValue && equal((leftValue as Record<string, unknown>)[key], (rightValue as Record<string, unknown>)[key]));
		};

		return equal(left, right);
	},

	/**
	 * Determines if the given value is a valid date.
	 * Converts string or number types to Date objects for validation.
	 *
	 * @param value The value to be checked. Can be a Date object, a string, or a number.
	 * @returns {boolean} `true` if the value is a valid date, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.date('2022-01-01'); //output: true
	 * Is.date(new Date()); //output: true
	 * Is.date('invalid date'); //output: false
	 * Is.date(1633046400000); //output: true
	 * ```
	 *
	 * @category Is.date
	 */
	date(value: string | number): boolean {
		let date = null;
		if (typeof value === "string" || typeof value === "number") {
			date = new Date(value);
		}
		return date instanceof Date && !Number.isNaN(date.getTime());
	},

	/**
	 * Verifies if the given value is null, undefined, an empty string, or an empty object/array.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is null, undefined, an empty string, or an empty object/array, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.nullOrEmpty(''); //output: true
	 * Is.nullOrEmpty(null); //output: true
	 * Is.nullOrEmpty(undefined); //output: true
	 * Is.nullOrEmpty([]); //output: true
	 * Is.nullOrEmpty({}); //output: true
	 * ```
	 *
	 * @category Is.nullOrEmpty
	 */
	nullOrEmpty(value: unknown): boolean {
		return (
			!value ||
			(typeof value === "string" && value.trim() === "") ||
			(Array.isArray(value) && value.length === 0) ||
			(typeof value === "object" && Object.keys(value).length === 0)
		);
	},

	/**
	 * Verifies if the given value is a valid object.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is a valid object, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.object({ a: 1 }); //output: true
	 * Is.object({}); //output: true
	 * Is.object([]); //output: false
	 * Is.object([{a:1}]); //output: false
	 * Is.object(null); //output: false
	 * Is.object(undefined); //output: false
	 * ```
	 *
	 * @category Is.object
	 */
	object(value: unknown): boolean {
		return Boolean(value) && typeof value === "object" && !Array.isArray(value);
	},

	/**
	 * Verifies if the given value is a valid email address.
	 * @param value The email to be verified.
	 * @returns {boolean} `true` if the value is a valid email address, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.email('foo.bar@email.com'); //output: true
	 * Is.email('invalid-email'); //output: false
	 * ```
	 *
	 * @category Is.email
	 */
	email(value: string): boolean {
		if (typeof value !== "string" || value.trim() === "") return false;

		// bloqueia dois pontos seguidos
		if (/\.\./.test(value)) return false;

		if (value.indexOf("@") === -1) return false;

		const [localPart, domain] = value.split("@");

		// RFC 5321: Parte local máximo 64 caracteres
		if (!localPart || localPart.length > 64) return false;

		// RFC 5321: Email completo máximo 254 caracteres
		if (value.length > 254) return false;

		// Domínio precisa ter pelo menos um ponto
		if (!domain || domain.indexOf(".") === -1) return false;

		// Cada parte do domínio não pode começar/terminar com hífen
		const domainParts = domain.split(".");
		for (const part of domainParts) {
			if (!part || part.startsWith("-") || part.endsWith("-")) {
				return false;
			}
		}

		return _EMAIL_REGEX.test(value);
	},

	/**
	 * Verifies if the given value is an odd number.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is an odd number, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.odd(3); //output: true
	 * Is.odd(2); //output: false
	 * ```
	 *
	 * @category Is.odd
	 */
	odd(value: number): boolean {
		return value % 2 !== 0;
	},

	/**
	 * Verifies if the given value is an even number.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is an even number, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.even(2); //output: true
	 * Is.even(3); //output: false
	 * ```
	 *
	 * @category Is.even
	 */
	even(value: number): boolean {
		return value % 2 === 0;
	},

	/**
	 * Verifies if the given value is a valid UUID.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is a valid UUID, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.uuid('12345678-1234-1234-1234-123456789012'); //output: true
	 * Is.uuid('12345678-1234-1234-1234-1234567890123'); //output: false
	 * ```
	 *
	 * @category Is.uuid
	 */
	uuid(value: string): boolean {
		return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
	},

	/**
	 * Verifies if the given value is a promise.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is a promise, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.promise(Promise.resolve()); //output: true
	 * Is.promise(new Promise(() => {})); //output: true
	 * Is.promise('not a promise'); //output: false
	 * ```
	 *
	 * @category Is.promise
	 */
	promise(value: unknown): boolean {
		if (!value) return false;

		// Verifica se é uma instância nativa de Promise
		if (value instanceof Promise) return true;

		// Verifica objetos thenable (compatibilidade com outras implementações)
		const thenable = value as { then?: unknown; catch?: unknown };
		return typeof thenable.then === "function" && typeof thenable.catch === "function";
	},

	/**
	 * Checks if the given value is a function.
	 * @param value The value to be checked.
	 * @returns {boolean} `true` if the value is a function, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.function(function() {}); //output: true
	 * Is.function(() => {}); //output: true
	 * Is.function('not a function'); //output: false
	 * ```
	 *
	 * @category Is.function
	 */
	function(value: unknown): boolean {
		return typeof value === "function";
	},

	/**
	 * Checks if the given value is a valid URL.
	 * @param value The value to be checked.
	 * @returns {boolean} `true` if the value is a valid URL, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.url('https://www.example.com'); //output: true
	 * Is.url('invalid-url'); //output: false
	 * ```
	 *
	 * @category Is.url
	 */
	url(value: string): boolean {
		try {
			const url = new URL(value);
			return ["http:", "https:"].includes(url.protocol);
		} catch {
			return false;
		}
	},

	/**
	 * Checks if the given value is a valid JSON string.
	 * @param value The value to be checked.
	 * @returns {boolean} `true` if the value is a valid JSON string, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.json('{"key": "value"}'); //output: true
	 * Is.json('Invalid JSON'); //output: false
	 * ```
	 *
	 * @category Is.json
	 */
	json(value: string): boolean {
		if (typeof value !== "string") return false;

		try {
			JSON.parse(value);
			return true;
		} catch {
			return false;
		}
	},

	/**
	 * Checks if a date is between two other dates.
	 * @param date The date to be checked.
	 * @param start The start date of the range.
	 * @param end The end date of the range.
	 * @returns {boolean} `true` if the date is between the start and end dates, `false` otherwise.
	 *
	 * @example
	 * ```ts
	 * Is.dateBetween(new Date('2022-01-15'), new Date('2022-01-01'), new Date('2022-01-31')); //output: true
	 * Is.dateBetween(new Date('2022-02-01'), new Date('2022-01-01'), new Date('2022-01-31')); //output: false
	 * ```
	 *
	 * @category Is.dateBetween
	 */
	dateBetween(date: Date, start: Date, end: Date): boolean {
		return date >= start && date <= end;
	},

	/**
	 * Checks if a given year is a leap year.
	 *
	 * A year is a leap year if it is divisible by 4, except for end-of-century years which must be divisible by 400.
	 * This means that the year 2000 was a leap year, although 1900 was not.
	 *
	 * @param {number} [year=new Date().getFullYear()] - The year to check.
	 * @returns {boolean} True if the year is a leap year, false otherwise.
	 *
	 * @example
	 * ```ts
	 * const isLeapYear = Is.leapYear(2000);
	 * console.log(isLeapYear); // true
	 * ```
	 *
	 * @category Is.leapYear
	 */
	leapYear: (year: number = new Date().getFullYear()): boolean => {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	},
};
