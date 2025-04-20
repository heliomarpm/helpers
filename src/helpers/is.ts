export enum eOS {
	Windows = 'win32',
	Linux = 'linux',
	MacOS = 'darwin'
}

export enum eArchitecture {
	x86 = 'ia32',
	x64 = 'x64',
	Arm = 'arm',
	Arm64 = 'arm64'
}

export const Is = {
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
		}
	},
	/**
	 * Validates a given value as a CPF (Brazilian National Register of Individuals).
	 *
	 * @param value - The value to be validated as a CPF.
	 * @returns `true` if the input value is a valid CPF, `false` otherwise.
	 */
	cpf(value: string): boolean {
		// Verifica se o CPF contém apenas números, pontos ou traços
		//if (!/^[\d.-]+$/.test(value)) return false;
		if (!/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)) return false;

		const cpf = value.replace(/\D/g, '');

		if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

		const digito = (base: number): number => {
			const sum = cpf
				.slice(0, base)
				.split('')
				.reduce((acc, value, index) => acc + parseInt(value) * (base + 1 - index), 0);
			return ((sum * 10) % 11) % 10;
		};

		return digito(9) === parseInt(cpf[9]) && digito(10) === parseInt(cpf[10]);
	},

	/**
	 * Validates a given value as a CNPJ (Brazilian National Register of Legal Entities).
	 * Starting from July 1st, 2026, the CNPJ will transition to a new format with letters and numbers.
	 * This implementation will automatically detect the format and validate it accordingly.
	 *
	 * @param value - The value to be validated as a CNPJ.
	 * @returns `true` if the input value is a valid CNPJ, `false` otherwise.
	 */
	cnpj(value: string): boolean {
		const isAlfaActive = new Date() >= new Date('2026-07-01');

		// if (!/^[\d.-]+$/.test(value)) return false;
		const regexNum = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
		const regexAlfa = /^[A-Z0-9]{14}$|^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-[A-Z0-9]{2}$/i;

		if ((!isAlfaActive && !regexNum.test(value)) || (isAlfaActive && !regexAlfa.test(value))) {
			return false;
		}

		const sanitized = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
		if (sanitized.length !== 14) return false;
		if (/^([A-Z0-9])\1{13}$/.test(sanitized)) return false;
		if (!isAlfaActive && !/^\d{14}$/.test(sanitized)) return false;

		const charToNum = (char: string): number => char.charCodeAt(0) - 48;

		const digits = sanitized.split('').map(charToNum);

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
	 */
	numeric<T>(value: T): boolean {
		return (typeof value === 'number' && !isNaN(value)) || (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value)));
	},

	/**
	 * Verifies if two values are equal.
	 * @param a The first value to be compared.
	 * @param b The second value to be compared.
	 * @param ignoreOrder If `true`, ignores the order of elements in arrays and objects.
	 * @returns {boolean} `true` if the values are equal, `false` otherwise.
	 *
	 * @example
	 * Is.equals({ a: 1, b: 2 }, { b: 2, a: 1 }); //output: true
	 * Is.equals([1, 2, 3], [3, 2, 1], true); //output: true
	 * Is.equals({ a: 1, b: 2 }, { a: 1, b: 3 }); //output: false
	 * Is.equals([1, 2, 3], [1, 2, 3]); //output: true
	 * Is.equals('hello', 'hello'); //output: true
	 * Is.equals(new Set[1], new Set[2]); //output: false
	 */
	equals<T, U>(left: T, right: U, ignoreOrder: boolean = false): boolean {
		const seen = new WeakMap();

		const equal = (leftValue: unknown, rightValue: unknown): boolean => {
			if (Object.is(leftValue, rightValue)) return true;

			if (typeof leftValue !== typeof rightValue) return false;

			if (leftValue === null || rightValue === null || typeof leftValue !== 'object') return false;

			if (leftValue instanceof Date && rightValue instanceof Date) return leftValue.getTime() === rightValue.getTime();
			if (leftValue instanceof RegExp && rightValue instanceof RegExp) return leftValue.toString() === rightValue.toString();

			if (leftValue instanceof Map && rightValue instanceof Map) {
				if (leftValue.size !== rightValue.size) return false;
				for (const [leftKey, leftVal] of leftValue.entries()) {
					if (!rightValue.has(leftKey) || !equal(leftVal, rightValue.get(leftKey))) return false;
				}
				return true;
			}

			if (leftValue instanceof Set && rightValue instanceof Set) {
				if (leftValue.size !== rightValue.size) return false;
				for (const leftVal of leftValue) {
					if (!rightValue.has(leftVal)) return false;
				}
				return true;
			}

			if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
				if (leftValue.length !== rightValue.length) return false;
				if (ignoreOrder) {
					const rightCopy = [...rightValue];
					return leftValue.every(leftVal => {
						const rightIndex = rightCopy.findIndex(rightVal => equal(leftVal, rightVal));
						if (rightIndex === -1) return false;
						rightCopy.splice(rightIndex, 1);
						return true;
					});
				} else {
					return leftValue.every((leftVal, index) => equal(leftVal, rightValue[index]));
				}
			}

			if (seen.has(leftValue)) return seen.get(leftValue) === rightValue;
			seen.set(leftValue, rightValue);

			const leftKeys = Object.keys(leftValue);
			const rightKeys = rightValue ? Object.keys(rightValue) : [];
			if (leftKeys.length !== rightKeys.length) return false;

			return leftKeys.every(leftKey => rightValue && equal((leftValue as Record<string, unknown>)[leftKey], (rightValue as Record<string, unknown>)[leftKey]));
		};

		return equal(left, right);
	},

	/**
	 * Verifies if the given value is a valid date.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is a valid date, `false` otherwise.
	 */
	date(value: unknown): boolean {
		if (typeof value === 'string') {
			value = new Date(value);
		}
		return value instanceof Date && !isNaN(value.getTime());
	},

	/**
	 * Verifies if the given value is null, undefined, an empty string, or an empty object/array.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is null, undefined, an empty string, or an empty object/array, `false` otherwise.
	 *
	 * @example
	 *
	 * Is.nullOrEmpty(''); //output: true
	 * Is.nullOrEmpty(null); //output: true
	 * Is.nullOrEmpty(undefined); //output: true
	 * Is.nullOrEmpty([]); //output: true
	 * Is.nullOrEmpty({}); //output: true
	 */
	nullOrEmpty(value: unknown): boolean {
		return (
			!value ||
			(typeof value === 'string' && value.trim() === '') ||
			(Array.isArray(value) && value.length === 0) ||
			(typeof value === 'object' && Object.keys(value).length === 0)
		);
	},

	/**
	 * Verifies if the given value is a valid object.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is a valid object, `false` otherwise.
	 *
	 * @example
	 *
	 * Is.object({ a: 1 }); //output: true
	 * Is.object({}); //output: true
	 * Is.object([]); //output: false
	 * Is.object([{a:1}]); //output: false
	 * Is.object(null); //output: false
	 * Is.object(undefined); //output: false
	 */
	object(value: unknown): boolean {
		return !!value && typeof value === 'object' && !Array.isArray(value);
	},

	/**
	 * Verifies if the given value is a valid email address.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is a valid email address, `false` otherwise.
	 *
	 * @example
	 * Is.email('heliomarpm@proton.me'); //output: true
	 */
	email(value: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	},

	/**
	 * Verifies if the given value is an odd number.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is an odd number, `false` otherwise.
	 *
	 * @example
	 * Is.odd(3); //output: true
	 * Is.odd(2); //output: false
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
	 * Is.even(2); //output: true
	 * Is.even(3); //output: false
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
	 * Is.uuid('12345678-1234-1234-1234-123456789012'); //output: true
	 * Is.uuid('12345678-1234-1234-1234-1234567890123'); //output: false
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
	 * Is.promise(Promise.resolve()); //output: true
	 * Is.promise(new Promise(() => {})); //output: true
	 * Is.promise('not a promise'); //output: false
	 */
	promise(value: unknown): boolean {
		if (!value) return false;

		// Verifica se é uma instância nativa de Promise
		if (value instanceof Promise) return true;

		// Verifica objetos thenable (compatibilidade com outras implementações)
		const thenable = value as { then?: unknown; catch?: unknown };
		return typeof thenable.then === 'function' && typeof thenable.catch === 'function';
	},

	/**
	 * Checks if the given value is a function.
	 * @param value The value to be checked.
	 * @returns {boolean} `true` if the value is a function, `false` otherwise.
	 *
	 * @example
	 * Is.function(function() {}); //output: true
	 * Is.function(() => {}); //output: true
	 * Is.function('not a function'); //output: false
	 */
	function(value: unknown): boolean {
		return typeof value === 'function';
	},

	/**
	 * Checks if the given value is a valid URL.
	 * @param value The value to be checked.
	 * @returns {boolean} `true` if the value is a valid URL, `false` otherwise.
	 *
	 * @example
	 * Is.url('https://www.example.com'); //output: true
	 * Is.url('invalid-url'); //output: false
	 */
	url(value: string): boolean {
		try {
			const url = new URL(value);
			return ['http:', 'https:'].includes(url.protocol);
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
	 * Is.json('{"key": "value"}'); //output: true
	 * Is.json('Invalid JSON'); //output: false
	 */
	json(value: string): boolean {
		if (typeof value !== 'string') return false;

		try {
			JSON.parse(value);
			return true;
		} catch {
			return false;
		}
	}
};
