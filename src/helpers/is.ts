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
	 * Validates a given value as a CNPJ (Brazilian National Corporate Registration Number).
	 *
	 * @param value - The value to be validated as a CNPJ.
	 * @returns `true` if the input value is a valid CNPJ, `false` otherwise.
	 */
	cnpj(value: string): boolean {
		// if (!/^[\d.-]+$/.test(value)) return false;
		if (!/^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value)) return false;

		const cnpj = value.replace(/\D/g, '');

		if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

		const digito = (base: number): number => {
			const pesos = base === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

			const sum = cnpj
				.slice(0, base)
				.split('')
				.reduce((acc, value, index) => acc + parseInt(value) * pesos[index], 0);
			return sum % 11 < 2 ? 0 : 11 - (sum % 11);
		};

		return digito(12) === parseInt(cnpj[12]) && digito(13) === parseInt(cnpj[13]);
	},

	/**
	 * Verifies if the given value is a valid number.
	 * A valid number is either a number primitive or a string that can be parsed to a number.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is a valid number, `false` otherwise.
	 */
	numeric(value: any): boolean {
		return (typeof value === 'number' && !isNaN(value)) || (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value)));
	},

	/**
	 * Compares two values recursively.
	 * @param a The first value to be compared.
	 * @param b The second value to be compared.
	 * @param ignoreOrder If `true`, the comparison will be done without considering the order of the elements (for arrays).
	 * @returns `true` if the two values are equal, `false` otherwise.
	 *
	 * @example
	 * const obj1 = { a: 1, b: { c: 2 } };
	 * const obj2 = { b: { c: 2 }, a: 1 };
	 * console.log(Is.equals(obj1, obj2)); // true
	 */
	equals(a: any, b: any, ignoreOrder = false): boolean {
		if (a === b) return true;
		if (a === null || b === null) return false;

		if (typeof a !== typeof b) return false;

		if (Array.isArray(a)) {
			if (ignoreOrder) {
				return a.length === b.length && a.every(val => b.some((otherVal: any) => Is.equals(val, otherVal)));
			}
			return a.length === b.length && a.every((val, index) => Is.equals(val, b[index]));
		}

		if (typeof a === 'object') {
			const keys = Object.keys(a);
			return keys.length === Object.keys(b).length && keys.every(key => Is.equals(a[key], b[key]));
		}

		return false;
	},

	/**
	 * Verifies if the given value is a valid date.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is a valid date, `false` otherwise.
	 */
	date(value: any): boolean {
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
	nullOrEmpty(value: any): boolean {
		return (
			value === null ||
			value === undefined ||
			(typeof value === 'string' && value.trim() === '') ||
			(Array.isArray(value) && value.length === 0) ||
			(typeof value === 'object' && value !== null && Object.keys(value).length === 0)
		);
	},

	/**
	 * Verifies if the given value is a valid object.
	 * @param value The value to be verified.
	 * @returns {boolean} `true` if the value is a valid object, `false` otherwise.
	 *
	 * @example
	 * Is.object({}); //output: true
	 * Is.object([]); //output: false
	 */
	object(value: any): boolean {
		return value !== null && typeof value === 'object' && !Array.isArray(value);
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
	}
};
