export const Utils = {
	/**
	 * Generates a random valid CPF (Brazilian National Register of Individuals)
	 * @returns a string containing the generated CPF
	 */
	gerarCPF(): string {
		const calcularDigito = (cpf: string | string[]) => {
			let soma = 0;
			let peso = cpf.length + 1;
			for (let i = 0; i < cpf.length; i++) {
				soma += parseInt(cpf[i]) * peso;
				peso--;
			}
			const resto = soma % 11;
			return resto < 2 ? '0' : (11 - resto).toString();
		};
		let cpf = '';
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
	 */
	gerarCNPJ(): string {
		const calcPrimeiroDigito = (cnpj: string | string[]) => {
			const pesos = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
			let soma = 0;
			for (let i = 0; i < 12; i++) {
				soma += parseInt(cnpj[i]) * pesos[i];
			}
			const resto = soma % 11;
			return resto < 2 ? '0' : (11 - resto).toString();
		};

		const calcSegundoDigito = (cnpj: string | string[]) => {
			const pesos = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
			let soma = 0;
			for (let i = 0; i < 13; i++) {
				soma += parseInt(cnpj[i]) * pesos[i];
			}
			const resto = soma % 11;
			return resto < 2 ? '0' : (11 - resto).toString();
		};

		let cnpj = '';
		for (let i = 0; i < 12; i++) {
			cnpj += Math.floor(Math.random() * 10).toString();
		}
		const primeiroDigito = calcPrimeiroDigito(cnpj);
		const segundoDigito = calcSegundoDigito(cnpj + primeiroDigito);

		return `${cnpj}${primeiroDigito}${segundoDigito}`;
	},

	/**
	 * Returns a comparison function to be used with the `sort` method for sorting
	 * an array of objects based on specified properties.
	 *
	 * The properties parameter can be a single property name or an array of names.
	 * If the property name is prefixed with a "-", the sorting will be in descending order.
	 *
	 * @param {string | string[]} properties - Properties to sort by.
	 * @returns {function} A comparator function for use with sorting methods like Array.prototype.sort.
	 *
	 * @example
	 * const validations = [
	 *     { level: "WARNING", type: "TypeA", message: "This is a warning." },
	 *     { level: "ERROR", type: "TypeE", message: "Something went wrong." },
	 *     { level: "ERROR", type: "TypeE", message: "Another error." },
	 * ];
	 *
	 * const sortedValidations = validations.sort(sortByProps(['level', 'type', '-message']));
	 * console.log(sortedValidations); // [{ level: "ERROR", type: "TypeE", message: "Something went wrong." }, ...]
	 */
	sortByProps(properties: string | string[]): (a: any, b: any) => number {
		const propertyList = Array.isArray(properties) ? properties : [properties];

		const stringifyValue = (value: any): string => {
			return String(typeof value === 'object' ? JSON.stringify(value || '') : value || '');
		};

		return (objA: any, objB: any) => {
			for (const property of propertyList) {
				let sortOrder = 1;
				let propName = property;

				if (property.startsWith('-')) {
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
	 * const people = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }];
	 * const sortedByName = orderBy(people, 'name'); // Sorts by name in ascending order.
	 * const sortedByAgeDesc = orderBy(people, 'age', 'desc'); // Sorts by age in descending order.
	 */
	orderBy<T, K extends keyof T>(list: T[], key: K, orderBy: 'asc' | 'desc' = 'asc'): T[] {
		return list.sort((a, b) => {
			const aValue = a[key] as string | number;
			const bValue = b[key] as string | number;

			return (
				orderBy === 'asc' ?
					aValue > bValue ?
						1
					:	-1
				: aValue < bValue ? 1
				: -1
			);
		});
	},

	/**
	 * Gets a nested value from an object given a path.
	 *
	 * @param obj The object to get the nested value from.
	 * @param path The path to the nested value. Uses dot notation.
	 * @returns The nested value or `undefined` if the path is invalid.
	 *
	 * @example
	 * const data = {
	 *   user: {
	 *     name: {
	 *       first: "John",
	 *       last: "Doe"
	 *     }
	 *   }
	 * };
	 * const firstName = getNestedValue(data, "user.name.first"); // "John"
	 */
	getNestedValue(obj: any, path: string): any {
		try {
			return path.split('.').reduce((acc, key) => acc[key], obj);
		} catch (error) {
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
	 */
	setNestedValue<T extends Record<string, any>>(target: T, path: string, value: any): void {
		if (!target) {
			throw new Error('Target object is required.');
		}

		if (path.trim() === '') {
			throw new Error('Path is required.');
		}

		// Divide a string da chave, lidando com arrays corretamente
		const keys = path.match(/[^.[\]]+/g) as string[];

		keys.reduce((acc: Record<string, any>, key: string, index: number) => {
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
				return acc[parsedKey];
			}
		}, target);
	},

	/**
	 * Returns the first argument if it is not null or undefined, otherwise returns the second argument.
	 * @param value The value to check.
	 * @param defaultValue The value to return if `value` is null or undefined.
	 * @returns The first argument if it is not null or undefined, otherwise the second argument.
	 * @example
	 * const foo = null;
	 * const bar = ifNull(foo, "baz"); // "baz"
	 */
	ifNull<T>(value: T | null | undefined, defaultValue: T): T {
		return value ?? defaultValue;
	},

	/**
	 * Returns the first argument if it is not null, undefined, or an empty string; otherwise, returns the second argument.
	 * @param value The value to check.
	 * @param defaultValue The value to return if `value` is null, undefined, or an empty string.
	 * @returns The first argument if it is not null, undefined, or an empty string, otherwise the second argument.
	 * @example
	 * const foo = '';
	 * const bar = ifNullOrEmpty(foo, "baz"); // "baz"
	 */
	ifNullOrEmpty<T>(value: T | null | undefined, defaultValue: T): T {
		return value == null || (typeof value === 'string' && !value.trim()) ? defaultValue : value;
	},

	/**
	 * Generates a random GUID in the format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.
	 * @returns A random GUID.
	 *
	 * @example
	 *
	 * const guid = generateGuid();
	 * console.log(guid); // "f47ac10b-58cc-4372-a567-0e02b2c3d479"
	 */
	generateGuid(): string {
		// Generate 16 random bytes
		const randomBytes = new Uint8Array(16);
		crypto.getRandomValues(randomBytes);

		// Convert the bytes to a string
		return [...randomBytes]
			.map((byte, index) => {
				const hex = byte.toString(16).padStart(2, '0');

				// Insert dashes at the appropriate positions
				return index === 4 || index === 6 || index === 8 || index === 10 ? `-${hex}` : hex;
			})
			.join('');
	},

	/**
	 * Generates a new 256-bit AES-GCM key.
	 *
	 * @returns A Promise that resolves to a CryptoKey that can be used for encryption and decryption.
	 *
	 * @example
	 * const key = await generateKey();
	 */
	async generateKey(): Promise<CryptoKey> {
		return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
	},

	/**
	 * Encrypts a string using AES-GCM algorithm and returns the result as a Base64 string.
	 * @param text The plaintext string to encrypt.
	 * @param key The CryptoKey used for encryption.
	 * @returns A Promise that resolves to the encrypted Base64 string.
	 */
	async encrypt(text: string, key: CryptoKey): Promise<string> {
		const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector (IV)
		const encodedText: Uint8Array = new TextEncoder().encode(text);
		const encryptedData: ArrayBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encodedText);

		// Concatenate IV + encrypted data and convert to Base64
		const combined: Uint8Array = new Uint8Array(iv.length + encryptedData.byteLength);
		combined.set(iv, 0);
		combined.set(new Uint8Array(encryptedData), iv.length);

		return Buffer.from(combined).toString('base64');
	},

	/**
	 * Decodes a Base64 string and decrypts the contents using the AES-GCM algorithm.
	 * @param encryptedText The Base64 string to decrypt.
	 * @param key The CryptoKey used for decryption.
	 * @returns The decrypted string.
	 */
	async decrypt(encryptedText: string, key: CryptoKey): Promise<string> {
		const rawData = Buffer.from(encryptedText, 'base64') as Uint8Array; // Decodifica Base64 para Uint8Array
		const iv = rawData.slice(0, 12) as Uint8Array; // Extrai o IV
		const encryptedData = rawData.slice(12) as Uint8Array; // Extrai os dados criptografados

		const decryptedData = (await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData)) as Uint8Array;

		return new TextDecoder().decode(decryptedData);
	}
};
