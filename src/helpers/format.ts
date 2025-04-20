export const Format = {
	/**
	 * Formatações em português brasileiro.
	 */
	ptBr: {
		cnpj: (value: string, fallback = 'CNPJ está incorreto!'): string => {
			const number = Format.onlyNumbers(value);

			if (number.length !== 14) {
				return fallback;
			}
			return number.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
		},
		cpf: (value: string, fallback = 'CPF está incorreto!'): string => {
			const number = Format.onlyNumbers(value);

			if (number.length !== 11) {
				return fallback;
			}
			return number.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
		},
		cep: (value: string, fallback = 'CEP está incorreto!'): string => {
			const number = Format.onlyNumbers(value);

			if (number.length !== 8) {
				return fallback;
			}

			return number.replace(/(\d{5})(\d{3})/, '$1-$2');
		},
		/**
		 * Formata um número de telefone com DDD.
		 * Se o valor informado tiver entre 8 e 11 dígitos, ele
		 * será formatado com DDD.
		 * Caso o valor tenha 8 ou 9 dígitos, ele usará o DDD
		 * informado como parâmetro.
		 * @param {string} value O valor a ser formatado.
		 * @param {string} [defaultAreaCode=''] DDD padrão a ser usado.
		 * @param {boolean} [suppressError=false] Se verdadeiro, retorna o valor sem formatação em vez de lançar um erro.
		 * @returns {string} O valor formatado.
		 * @throws {Error} Se o valor informado tiver menos de 8 ou mais de 11 dígitos.
		 */
		telefone: (value: string, defaultAreaCode: string = '', fallback = 'Telefone está incorreto!'): string => {
			let number = Format.onlyNumbers(value);
			const areaCode = Format.onlyNumbers(defaultAreaCode);

			number = number.length < 10 ? `${areaCode}${number}` : number;

			if (number.length < 8 || number.length > 11) {
				return fallback;
			}

			if (number.length === 8 || number.length === 9) {
				return number.replace(/(\d{4,5})(\d{4})/, '$1-$2');
			}

			return number.replace(/(\d{2})(\d{4,5})(\d{4})/, '$1 $2-$3');
		},

		/**
		 * Converte um valor em uma string escrita por extenso.
		 *
		 * @param value O valor a ser convertido.
		 * @returns Uma string com o valor escrito por extenso.
		 *
		 * @example
		 * ```js
		 * 	Format.valorPorExtenso(1000); // Output: "mil"
		 * 	Format.valorPorExtenso(1000000); // Output: "um milhão"
		 * 	Format.valorPorExtenso(1000000000); // Output: "um bilhão"
		 * 	Format.valorPorExtenso(1000000001); // Output: "um bilhão e um"
		 *  Format.valorPorExtenso(2_000_000_000_000_000); // Output: "dois quatrilhões"
		 * ```
		 */
		valorPorExtenso: (value: number): string => {
			if (value < 0 || value >= 1000 ** 6) {
				throw new Error('O valor deve estar entre 0 e 999.999.999.999.999.999');
			}

			const units = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
			const tens = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
			const tensMore = ['onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
			const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
			const scales = ['', 'mil', 'milhão', 'bilhão', 'trilhão', 'quatrilhão'];

			// Converte centenas, dezenas e unidades
			const convertHundreds = (num: number): string => {
				if (num === 0) return '';
				if (num === 100) return 'cem';

				const hundred = Math.floor(num / 100);
				const ten = Math.floor((num % 100) / 10);
				const unit = num % 10;
				let result = '';

				if (hundred > 0) {
					result += hundreds[hundred] + (ten > 0 || unit > 0 ? ' e ' : '');
				}

				if (ten === 1 && unit > 0) {
					result += tensMore[unit - 1];
				} else {
					if (ten > 0) {
						result += tens[ten] + (unit > 0 ? ' e ' : '');
					}
					if (unit > 0) {
						result += units[unit];
					}
				}

				return result;
			};

			if (value === 0) return units[0];

			let result = '';
			const parts: number[] = [];

			for (let i = 0; i < scales.length; i++) {
				parts[i] = Math.floor(value / 1000 ** i) % 1000;
			}

			for (let i = scales.length - 1; i >= 0; i--) {
				if (parts[i] > 0) {
					if (result) result += parts[i] < 101 ? ' e ' : ' ';

					if (i === 1 && parts[i] === 1) {
						result += 'mil';
					} else {
						result += convertHundreds(parts[i]) + (i > 0 ? ` ${scales[i]}` : '');
					}

					if (parts[i] > 1 && (i === 2 || i === 3 || i === 4 || i === 5)) {
						result = result.replace(/ão$/, 'ões');
					}
				}
			}

			return result.trim().replace(/\s+/g, ' ');
		}
	},

	/**
	 * Formats a Date object into a string according to the specified format.
	 * Supported formats are:
	 * - 'a': 'am' or 'pm' in lowercase
	 * - 'A': 'AM' or 'PM' in uppercase
	 * - 'hh': two-digit hours in 12h format (01-12)
	 * - 'h': hours in 12h format (1-12)
	 * - 'HH': two-digit hours in 24h format (00-23)
	 * - 'H': hours in 24h format (0-23)
	 * - 'MM': two-digit minutes (00-59)
	 * - 'ss': two-digit seconds (00-59)
	 * - 'SSS': three-digit milliseconds (000-999)
	 * - 'yyyy': four-digit year (2024)
	 * - 'yy': two-digit year (24)
	 * - 'mmmm': full month name (January, February, ...)
	 * - 'mmm': full month name abbreviated month (Jan, Feb, ...)
	 * - 'mm': two-digit month (01-12)
	 * - 'dddd': full weekday name (Sun, Mon, ...)
	 * - 'ddd': abbreviated weekday name (Sun, Mon, ...)
	 * - 'dd': two-digit day (01-31)
	 *
	 * @param {string|Date} date - The date to format.
	 * @param {string} format - The desired format for the output string.
	 * @param {string} locale - The locale to use.
	 * @returns {string} The date formatted as a string.
	 *
	 * @example
	 * ```js
	 * Format.date('2025-03-02', 'dddd, dd mmmm yyyy', 'en-US'); // Output: 'Sunday, 02 March 2025'
	 * ```
	 *
	 * @see https://www.w3schools.com/jsref/jsref_tolocalestring.asp
	 */
	date: (date: Date | string, format: string, locale: Intl.LocalesArgument = 'default'): string => {
		try {
			if (typeof date === 'string') {
				date = date.trim().replace(/-/g, '/').replace(/T/g, ' ');
				if (!date.endsWith('Z')) date += 'Z'; // Adiciona o fuso horário UTC se não estiver presente

				date = new Date(new Date(date).toISOString());
			}

			const monthName = new Intl.DateTimeFormat(locale, { month: 'long' }).formatToParts(date).map(part => part.value)[0];
			const dayName = new Intl.DateTimeFormat(locale, { weekday: 'long' }).formatToParts(date).map(part => part.value)[0];

			const hr24 = date.getHours();
			const hr12 = hr24 % 12 || 12;
			const ampm = hr24 < 12 ? 'am' : 'pm';

			const map: { [key: string]: string } = {
				a: ampm,
				A: ampm.toUpperCase(),
				hh: hr12.toString().padStart(2, '0'),
				h: hr12.toString(),
				HH: hr24.toString().padStart(2, '0'),
				H: hr24.toString(),
				MM: String(date.getMinutes()).padStart(2, '0'),
				ss: String(date.getSeconds()).padStart(2, '0'),
				SSS: String(date.getMilliseconds()).padStart(3, '0'),
				yyyy: date.getFullYear().toString(),
				yy: date.getFullYear().toString().slice(-2),
				mmmm: monthName,
				mmm: monthName.slice(0, 3),
				mm: String(date.getMonth() + 1).padStart(2, '0'),
				dddd: dayName,
				ddd: dayName.slice(0, 3),
				dd: String(date.getDate()).padStart(2, '0')
			};

			return format.replace(/a|A|hh|h|HH|H|MM|ss|SSS|yyyy|yy|mmmm|mmm|mm|dddd|ddd|dd/g, (matched: string) => map[matched]);
		} catch (error) {
			throw new Error(`Error in Format.date\n${error}`);
		}
	},

	/**
	 * Formats a number as currency.
	 * @param value The number to format.
	 * @param options Options for formatting. These include the locale and currency.
	 * @returns The formatted string.
	 *
	 * @example
	 * ```js
	 * Format.currency(123456.78); // 'R$ 123.456,78'Format.currency(1234.56);
	 * // Output: R$ 1.234,56
	 * ```
	 *
	 * @see https://www.w3schools.com/jsref/jsref_tolocalestring.asp
	 */
	currency: (value: number, options: { locale: Intl.LocalesArgument; currency: string } = { locale: 'pt-BR', currency: 'BRL' }): string => {
		const result = value.toLocaleString(options.locale, { style: 'currency', currency: options.currency });
		return result.replace(/\u00A0/g, ' '); // Substitui o espaço não quebrável (\u00A0) por um espaço comum
	},

	/**
	 * Formats a number according to the given locale.
	 * @param value The number to format.
	 * @param locale The locale to use.
	 * @returns The formatted string.
	 *
	 * @example
	 * ```js
	 * Format.number(123456.78); // '123.456,78'Format.number(1234.56);
	 * // Output: 1.234,56
	 * ```
	 *
	 * @see https://www.w3schools.com/jsref/jsref_tolocalestring.asp
	 */
	number: (value: number, locale: Intl.LocalesArgument = 'default'): string => {
		return value.toLocaleString(locale, { minimumFractionDigits: 2 });
	},

	/**
	 * Abbreviates a number by adding a suffix based on its magnitude.
	 *
	 * This function takes a number and returns a string with the number abbreviated
	 * using metric suffixes (e.g., K for thousand, M for million).
	 *
	 * @param value - The number to abbreviate.
	 * @param options - Options for abbreviation, including:
	 *   - `fractionDigits`: Number of decimal places to include in the abbreviated value.
	 *   - `removeEndZero`: Whether to remove trailing zeros after the decimal point.
	 * @returns A string representing the abbreviated number with a suffix.
	 *
	 * @example
	 * ```typescript
	 * abbreviateNumber(1500); // '1.50K'
	 * abbreviateNumber(2000000); // '2.00M'
	 * abbreviateNumber(123_456_789); // '123.46M'
	 * abbreviateNumber(1e33); // '1.00D'
	 * ```
	 */
	abbreviateNumber: (value: number, { fractionDigits = 2, removeEndZero = true } = {}): string => {
		const abbreviations = [
			{ threshold: 1e33, suffix: 'D' }, // 1 decillion
			{ threshold: 1e30, suffix: 'N' }, // 1 nonillion
			{ threshold: 1e27, suffix: 'O' }, // 1 octillion
			{ threshold: 1e24, suffix: 'Se' }, // 1 septillion
			{ threshold: 1e21, suffix: 'S' }, // 1 sextillion
			{ threshold: 1e18, suffix: 'Qu' }, // 1 quintillion
			{ threshold: 1e15, suffix: 'Q' }, // 1 quadrillion
			{ threshold: 1e12, suffix: 'T' }, // 1 trillion
			{ threshold: 1e9, suffix: 'B' }, // 1 billion
			{ threshold: 1e6, suffix: 'M' }, // 1 million
			{ threshold: 1e3, suffix: 'K' } // 1 thousand
		];

		const abbreviation = abbreviations.find(({ threshold }) => value >= threshold);

		if (abbreviation) {
			let abbreviatedValue = (value / abbreviation.threshold).toFixed(fractionDigits);

			// Optionally remove trailing zeros
			if (removeEndZero) {
				abbreviatedValue = abbreviatedValue.replace(/\.?0*$/, '');
			}

			return `${abbreviatedValue}${abbreviation.suffix}`;
		}

		// Return the original number as a string if no abbreviation is applicable
		return value.toString();
	},

	/**
	 * Removes all non-numeric characters from a string.
	 *
	 * @param {string} value The string to remove non-numeric characters from.
	 * @returns {string} The resulting string with only numeric characters.
	 *
	 * @example
	 * ```js
	 * onlyNumbers('123abc'); // '123'
	 * onlyNumbers('abc'); // ''
	 * ```
	 */
	onlyNumbers: (value: string): string => value.replace(/\D/g, ''),

	/**
	 * Pads a number with leading zeros to match the number of digits in a given maximum value.
	 *
	 * @param {number} value The number to be padded with leading zeros.
	 * @param {number} refValue The reference value for determining the maximum length for adding leading zeros.
	 *
	 *  @returns {string} the input number padded with leading zeros to match the number of digits in the maximum value.
	 *
	 * @example
	 * ```js
	 * Format.padZerosByRef(2, 90); // '02'
	 * Format.padZerosByRef(12, 110); // '012'
	 * ```
	 */
	padZerosByRef(value: number, refValue: number): string {
		const numDigits = Math.floor(Math.log10(refValue) + 1);
		return value.toString().padStart(numDigits, '0');
	},

	/**
	 * Capitalizes the first letter of the full name
	 * while maintaining lowercase for specified conjunctions.
	 *
	 * @param {string} name - The full name string to format.
	 * @returns {string} The formatted name in title case.
	 *
	 * @example
	 * ```ts
	 * titleCase('john doe de souza'); // 'John Doe de Souza'
	 * titleCase('maria da silva'); // 'Maria da Silva'
	 * ```
	 */
	titleCase(name: string): string {
		if (!name.trim()) return '';

		const conjunctions = new Set(['do', 'da', 'dos', 'das', 'de', 'e']); // Common conjunctions to remain lowercase

		return name
			.trim()
			.toLowerCase()
			.split(/\s+/) // Split the name by whitespace
			.map((word, index) =>
				// Capitalize the first letter of the word if it's the first word or not a conjunction
				index === 0 || !conjunctions.has(word) ? word.charAt(0).toUpperCase() + word.slice(1) : word
			)
			.join(' '); // Join the words back into a string with spaces
	},

	/**
	 * Masks a substring of a string with a specified character.
	 *
	 * @param {string} value - The original string to mask.
	 * @param {string} [maskChar='*''] - The character to use for masking.
	 * @param {number} [startIndex=0] - The starting index of the substring to mask (inclusive).
	 * @param {number | null} [finalIndex=null] - The ending index of the substring to mask (exclusive). If null, masks until the end of the string.
	 * @returns {string} The masked string.
	 *
	 * @example
	 * ```js
	 * maskIt('1234567890', '*', 2, 5); // '12*****90'
	 * maskIt('1234567890', '#', 3); // '123########'
	 * ```
	 * @throws {Error} Invalid start or final index.
	 * @throws {Error} maskChar must be a single character
	 */
	maskIt(value: string, maskChar: string = '*', startIndex: number = 0, finalIndex: number | null = null): string {
		if (startIndex > value.length) startIndex = value.length - 1;

		if (finalIndex === null || finalIndex > value.length) {
			finalIndex = value.length;
		}

		if (startIndex < 0 || startIndex > finalIndex) {
			throw new Error('Invalid start or final index');
		}

		if (maskChar.length !== 1) {
			throw new Error('maskChar must be a single character');
		}

		const maskedSubstring = maskChar.repeat(finalIndex - startIndex);
		return value.slice(0, startIndex) + maskedSubstring + value.slice(finalIndex);
	},

	/**
	 * Masks a part of a string with a specified character.
	 *
	 * @param {string} text - The original string to mask.
	 * @param {string} [maskChar='*'] - The character to use for masking.
	 * @param {number} [visibleChars=1] - The number of visible characters in the masked part.
	 * @returns {string} The masked string.
	 *
	 * @example
	 * ```js
	 * maskItParts('Heliomar P. Marques', '*', 1); // 'H******* P. M******'
	 * maskItParts('+55 (11) 91888-0000', '#', 1); // '+5# (1#) 9####-0###'
	 * maskItParts('123.444.555-67', '_', 2); // '12_.44_.55_-67'
	 * ```
	 * @throws {Error} maskChar must be a single character
	 */
	maskItParts(text: string, maskChar: string = '*', visibleChars: number = 1): string {
		if (maskChar.length !== 1) {
			throw new Error('maskChar must be a single character');
		}

		const effectiveVisibleChars = visibleChars <= 0 ? 1 : visibleChars;

		return text.replace(/([a-zA-Z0-9]+)/g, match => {
			if (match.length <= effectiveVisibleChars) {
				return match;
			}

			const visiblePart = match.substring(0, effectiveVisibleChars);
			const maskedPart = maskChar.repeat(match.length - effectiveVisibleChars);
			return visiblePart + maskedPart;
		});
	}
};
