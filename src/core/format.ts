/**
 * Format - A collection of formatting utilities for strings, numbers, and dates.
 *
 * @category Core
 * @class
 * @author Heliomar P. Marques <https://navto.me/heliomarpm>
 */
export const Format = {
	/**
	 * Formatações em português brasileiro.
	 *
	 * @example
	 * ```ts
	 * import { Format } from '@heliomarpm/helpers';
	 *
	 * const cnpj = Format.ptBr.cnpj('12345678000195'); // Output: '12.345.678/0001-95'
	 * const cpf = Format.ptBr.cpf('12345678909'); // Output: '123.456.789-09'
	 * const cep = Format.ptBr.cep('12345678'); // Output: '12345-678'
	 * const telefone1 = Format.ptBr.telefone('11987654321'); // Output: '(11) 98765-4321'
	 * const telefone2 = Format.ptBr.telefone('987654321', '11'); // Output: '(11) 98765-4321'
	 * const valorPorExtenso = Format.ptBr.valorPorExtenso(123456); // Output: 'cento e vinte e três mil quatrocentos e cinquenta e seis'
	 * ```
	 *
	 * @namespace ptBr
	 * @category Format.ptBr
	 */
	ptBr: {
		/**
		 * Formata um CNPJ.
		 *
		 * @param {string} value O valor a ser formatado.
		 * @param {string} fallback O valor a ser retornado caso o valor informado esteja incorreto.
		 * @returns {string} O CNPJ formatado.
		 *
		 * @example
		 * ```ts
		 * const cnpj = Format.ptBr.cnpj('12345678000195'); // Output: '12.345.678/0001-95'
		 * ```
		 */
		cnpj: (value: string, fallback = "CNPJ está incorreto!"): string => {
			const number = Format.onlyNumbers(value);

			if (number.length !== 14) {
				return fallback;
			}
			return number.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
		},
		/**
		 * Formata um CPF.
		 *
		 * @param {string} value O valor a ser formatado.
		 * @param {string} fallback O valor a ser retornado caso o valor informado esteja incorreto.
		 * @returns {string} O CPF formatado.
		 *
		 * @example
		 * ```ts
		 * const cpf = Format.ptBr.cpf('12345678909'); // Output: '123.456.789-09'
		 * ```
		 */
		cpf: (value: string, fallback = "CPF está incorreto!"): string => {
			const number = Format.onlyNumbers(value);

			if (number.length !== 11) {
				return fallback;
			}
			return number.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
		},
		/**
		 * Formata um CEP.
		 *
		 * @param {string} value O valor a ser formatado.
		 * @param {string} [fallback="CEP está incorreto!"] O valor a ser retornado caso o valor informado esteja incorreto.
		 * @returns {string} O CEP formatado.
		 *
		 * @example
		 * ```ts
		 * const cep = Format.ptBr.cep('12345678'); // Output: '12345-678'
		 * ```
		 */
		cep: (value: string, fallback = "CEP está incorreto!"): string => {
			const number = Format.onlyNumbers(value);

			if (number.length !== 8) {
				return fallback;
			}

			return number.replace(/(\d{5})(\d{3})/, "$1-$2");
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
		 *
		 * @example
		 * ```ts
		 * const telefone1 = Format.ptBr.telefone('11987654321'); // Output: '(11) 98765-4321'
		 * const telefone2 = Format.ptBr.telefone('987654321', '11'); // Output: '(11) 98765-4321'
		 * ```
		 */
		telefone: (value: string, defaultAreaCode = "", fallback = "Telefone está incorreto!"): string => {
			let number = Format.onlyNumbers(value);
			const areaCode = Format.onlyNumbers(defaultAreaCode);

			number = number.length < 10 ? `${areaCode}${number}` : number;

			if (number.length < 8 || number.length > 11) {
				return fallback;
			}

			if (number.length === 8 || number.length === 9) {
				return number.replace(/(\d{4,5})(\d{4})/, "$1-$2");
			}

			return number.replace(/(\d{2})(\d{4,5})(\d{4})/, "$1 $2-$3");
		},

		/**
		 * Converte um valor em uma string escrita por extenso.
		 *
		 * @param value O valor a ser convertido.
		 * @returns Uma string com o valor escrito por extenso.
		 *
		 * @example
		 * ```ts
		 * 	Format.valorPorExtenso(1000); // Output: "mil"
		 * 	Format.valorPorExtenso(1000000); // Output: "um milhão"
		 * 	Format.valorPorExtenso(1000000000); // Output: "um bilhão"
		 * 	Format.valorPorExtenso(1000000001); // Output: "um bilhão e um"
		 *  Format.valorPorExtenso(2_000_000_000_000_000); // Output: "dois quatrilhões"
		 * ```
		 */
		valorPorExtenso: (value: number): string => {
			if (value < 0 || value >= 1000 ** 6) {
				throw new Error("O valor deve estar entre 0 e 999.999.999.999.999.999");
			}

			const units = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
			const tens = ["", "dez", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
			const tensMore = ["onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
			const hundreds = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];
			const scales = ["", "mil", "milhão", "bilhão", "trilhão", "quatrilhão"];

			// Converte centenas, dezenas e unidades
			const convertHundreds = (num: number): string => {
				if (num === 0) return "";
				if (num === 100) return "cem";

				const hundred = Math.floor(num / 100);
				const ten = Math.floor((num % 100) / 10);
				const unit = num % 10;
				let result = "";

				if (hundred > 0) {
					result += hundreds[hundred] + (ten > 0 || unit > 0 ? " e " : "");
				}

				if (ten === 1 && unit > 0) {
					result += tensMore[unit - 1];
				} else {
					if (ten > 0) {
						result += tens[ten] + (unit > 0 ? " e " : "");
					}
					if (unit > 0) {
						result += units[unit];
					}
				}

				return result;
			};

			if (value === 0) return units[0];

			let result = "";
			const parts: number[] = [];

			for (let i = 0; i < scales.length; i++) {
				parts[i] = Math.floor(value / 1000 ** i) % 1000;
			}

			for (let i = scales.length - 1; i >= 0; i--) {
				if (parts[i] > 0) {
					if (result) result += parts[i] < 101 ? " e " : " ";

					if (i === 1 && parts[i] === 1) {
						result += "mil";
					} else {
						result += convertHundreds(parts[i]) + (i > 0 ? ` ${scales[i]}` : "");
					}

					if (parts[i] > 1 && (i === 2 || i === 3 || i === 4 || i === 5)) {
						result = result.replace(/ão$/, "ões");
					}
				}
			}

			return result.trim().replace(/\s+/g, " ");
		},
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
	 * @param {string|Date} dateValue - The date to format.
	 * @param {string} format - The desired format for the output string.
	 * @param {string} locale - The locale to use.
	 * @returns {string} The date formatted as a string.
	 *
	 * @example
	 * ```ts
	 * Format.date('2025-03-02', 'dddd, dd mmmm yyyy', 'en-US'); // Output: 'Sunday, 02 March 2025'
	 * ```
	 *
	 * @see https://www.w3schools.com/jsref/jsref_tolocalestring.asp
	 * @category Format.date
	 */
	date: (date: Date | string | number, format: string, locale: Intl.LocalesArgument = "default"): string => {
		let dateValue = date;

		try {
			if (!(dateValue instanceof Date)) {
				if (typeof dateValue === "string") {
					dateValue = dateValue.trim().replace(/-/g, "/").replace(/T/g, " ");
					if (!dateValue.endsWith("Z")) dateValue += "Z"; // Adiciona o fuso horário UTC se não estiver presente
				}
				dateValue = new Date(new Date(dateValue).toISOString());
			}

			const monthName = new Intl.DateTimeFormat(locale, { month: "long" }).formatToParts(dateValue).map((part) => part.value)[0];
			const dayName = new Intl.DateTimeFormat(locale, { weekday: "long" }).formatToParts(dateValue).map((part) => part.value)[0];

			const hr24 = dateValue.getHours();
			const hr12 = hr24 % 12 || 12;
			const ampm = hr24 < 12 ? "am" : "pm";

			const map: { [key: string]: string } = {
				a: ampm,
				A: ampm.toUpperCase(),
				hh: hr12.toString().padStart(2, "0"),
				h: hr12.toString(),
				HH: hr24.toString().padStart(2, "0"),
				H: hr24.toString(),
				MM: String(dateValue.getMinutes()).padStart(2, "0"),
				ss: String(dateValue.getSeconds()).padStart(2, "0"),
				SSS: String(dateValue.getMilliseconds()).padStart(3, "0"),
				yyyy: dateValue.getFullYear().toString(),
				yy: dateValue.getFullYear().toString().slice(-2),
				mmmm: monthName,
				mmm: monthName.slice(0, 3),
				mm: String(dateValue.getMonth() + 1).padStart(2, "0"),
				dddd: dayName,
				ddd: dayName.slice(0, 3),
				dd: String(dateValue.getDate()).padStart(2, "0"),
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
	 * @category Format.currency
	 */
	currency: (value: number, options: { locale: Intl.LocalesArgument; currency: string } = { locale: "pt-BR", currency: "BRL" }): string => {
		const result = value.toLocaleString(options.locale, { style: "currency", currency: options.currency });
		return result.replace(/\u00A0/gu, " "); // Substitui o espaço não quebrável (\u00A0) por um espaço comum
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
	 * @category Format.number
	 */
	number: (value: number, locale: Intl.LocalesArgument = "default"): string => {
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
	 * ```ts
	 * abbreviateNumber(1500); // '1.50K'
	 * abbreviateNumber(2000000); // '2.00M'
	 * abbreviateNumber(123_456_789); // '123.46M'
	 * abbreviateNumber(1e33); // '1.00D'
	 * ```
	 *
	 * @category Format.abbreviateNumber
	 */
	abbreviateNumber: (value: number, { fractionDigits = 2, removeEndZero = true } = {}): string => {
		const abbreviations = [
			{ threshold: 1e33, suffix: "D" }, // 1 decillion
			{ threshold: 1e30, suffix: "N" }, // 1 nonillion
			{ threshold: 1e27, suffix: "O" }, // 1 octillion
			{ threshold: 1e24, suffix: "Se" }, // 1 septillion
			{ threshold: 1e21, suffix: "S" }, // 1 sextillion
			{ threshold: 1e18, suffix: "Qu" }, // 1 quintillion
			{ threshold: 1e15, suffix: "Q" }, // 1 quadrillion
			{ threshold: 1e12, suffix: "T" }, // 1 trillion
			{ threshold: 1e9, suffix: "B" }, // 1 billion
			{ threshold: 1e6, suffix: "M" }, // 1 million
			{ threshold: 1e3, suffix: "K" }, // 1 thousand
		];

		const abbreviation = abbreviations.find(({ threshold }) => value >= threshold);

		if (abbreviation) {
			let abbreviatedValue = (value / abbreviation.threshold).toFixed(fractionDigits);

			// Optionally remove trailing zeros
			if (removeEndZero) {
				abbreviatedValue = abbreviatedValue.replace(/\.?0*$/, "");
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
	 * ```ts
	 * onlyNumbers('123abc'); // '123'
	 * onlyNumbers('abc'); // ''
	 * ```
	 * @category Format.onlyNumbers
	 */
	onlyNumbers: (value: string): string => value.replace(/\D/g, ""),

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
	 * @category Format.padZerosByRef
	 */
	padZerosByRef(value: number, refValue: number): string {
		const numDigits = Math.floor(Math.log10(refValue) + 1);
		return value.toString().padStart(numDigits, "0");
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
	 *
	 * @category Format.titleCase
	 */
	titleCase(name: string): string {
		if (!name.trim()) return "";

		const conjunctions = new Set(["do", "da", "dos", "das", "de", "e"]); // Common conjunctions to remain lowercase

		return name
			.trim()
			.toLowerCase()
			.split(/\s+/) // Split the name by whitespace
			.map((word, index) =>
				// Capitalize the first letter of the word if it's the first word or not a conjunction
				index === 0 || !conjunctions.has(word) ? word.charAt(0).toUpperCase() + word.slice(1) : word
			)
			.join(" "); // Join the words back into a string with spaces
	},

	/**
	 * Converts a string to a slug.
	 *
	 * @param str The string to convert.
	 * @returns The slugified string.
	 *
	 * @example
	 *
	 *
	 * ```ts
	 * Format.slugify('Hello, world!'); // 'hello-world'
	 * ```
	 *
	 * @category Format.slugify
	 */
	slugify(str: string): string {
		return str
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
	},

	/**
	 * Masks a substring of a string with a specified character.
	 *
	 * @param {string} value - The original string to mask.
	 * @param {string} [maskChar='*''] - The character to use for masking.
	 * @param {number} [startIndex=0] - The starting index of the substring to mask (inclusive).
	 * @param {number | null} [finalIndex=null] - The ending index of the substring to mask (exclusive). If null, masks until the end of the string.
	 * @returns {string} The masked string.

	 * @throws {Error} maskChar must be a single character
	 *
	 * @example
	 * ```js
	 * maskIt('1234567890', '*', 2, 5); // '12*****90'
	 * maskIt('1234567890', '#', 3); // '123########'
	 * ```
	 *
	 * @category Format.maskIt
	 */
	maskIt(value: string, maskChar = "*", startIndex = 0, finalIndex: number | null = null): string {
		let startIndexNum = Number.parseInt(startIndex.toString(), 10);
		let finalIndexNum = Number.parseInt(finalIndex?.toString() || value.length.toString(), 10);

		if (startIndexNum > value.length) startIndexNum = value.length - 1;
		if (finalIndexNum > value.length) finalIndexNum = value.length;

		if (startIndexNum < 0 || startIndexNum > finalIndexNum) {
			throw new Error("Invalid start or final index");
		}

		if (maskChar.length !== 1) {
			throw new Error("maskChar must be a single character");
		}

		const maskedSubstring = maskChar.repeat(finalIndexNum - startIndexNum);
		return value.slice(0, startIndexNum) + maskedSubstring + value.slice(finalIndexNum);
	},

	/**
	 * Masks a part of a string with a specified character.
	 *
	 * @param {string} text - The original string to mask.
	 * @param {string} [maskChar='*'] - The character to use for masking.
	 * @param {number} [visibleChars=1] - The number of visible characters in the masked part.
	 * @returns {string} The masked string.
	 * @throws {Error} maskChar must be a single character
	 *
	 * @example
	 * ```js
	 * maskItParts('Heliomar P. Marques', '*', 1); // 'H******* P. M******'
	 * maskItParts('+55 (11) 91888-0000', '#', 1); // '+5# (1#) 9####-0###'
	 * maskItParts('123.444.555-67', '_', 2); // '12_.44_.55_-67'
	 * ```
	 *
	 * @category Format.maskItParts
	 */
	maskItParts(text: string, maskChar = "*", visibleChars = 1): string {
		if (maskChar.length !== 1) {
			throw new Error("maskChar must be a single character");
		}

		const effectiveVisibleChars = visibleChars <= 0 ? 1 : visibleChars;

		return text.replace(/([a-zA-Z0-9]+)/g, (match) => {
			if (match.length <= effectiveVisibleChars) {
				return match;
			}

			const visiblePart = match.substring(0, effectiveVisibleChars);
			const maskedPart = maskChar.repeat(match.length - effectiveVisibleChars);
			return visiblePart + maskedPart;
		});
	},

	/**
	 * Truncates a given text to a maximum length and appends an ellipsis.
	 *
	 * @param {string} text - The text to truncate.
	 * @param {number} maxLength - The maximum allowed length of the text.
	 * @param {string} [ellipsis="..."] - The string to append to the end of the
	 *   truncated text.
	 * @returns {string} The truncated text.
	 *
	 * @throws {Error} If maxLength is less than or equal to the length of ellipsis.
	 *
	 * @example
	 * ```js
	 * truncate('Hello, world!', 5); // 'He...'
	 * truncate('Short text', 20); // 'Short text'
	 * ```
	 *
	 * @category Format.truncate
	 */
	truncate: (text: string, maxLength: number, ellipsis = "..."): string => {
		if (maxLength <= ellipsis.length) throw new Error("maxLength must be greater than ellipsis length");
		if (text.length <= maxLength) return text;

		return text.slice(0, maxLength - ellipsis.length) + ellipsis;
	},

	/**
	 * Interpolates a template string with the provided variables.
	 *
	 * @param {string} template - The template string to interpolate.
	 * @param {...string | number} variables - The variables to interpolate into the template.
	 * @returns {string} The interpolated template string.
	 *
	 * @throws {Error} If a placeholder index is out of range of the provided variables.
	 * @example
	 * ```js
	 * interpolate('Hello, {0}!', 'World'); // 'Hello, World!'
	 * interpolate('The sum of {0} and {1} is {2}.', 1, 2, 3); // 'The sum of 1 and 2 is 3.'
	 * ```
	 *
	 * @category Format.interpolate
	 */
	interpolate: (template: string, ...variables: Array<string | number>): string => {
		if (!template) return "";
		if (variables.length === 0) return template;

		// Encontra todos os índices usados no template
		const matches = template.match(/{(\d+)}/g) || [];
		const indexes = matches.map((m) => Number.parseInt(m.replace(/[{}]/g, ""), 10));

		if (indexes.length > 0) {
			const maxIndex = Math.max(...indexes);
			if (maxIndex >= variables.length) {
				throw new Error("Placeholder index out of range");
			}
		}

		if (indexes.length === 0 && variables.length > 0) {
			throw new Error("No placeholders found in template");
		}

		return template.replace(/{(\d+)}/g, (_, index) => (index < variables.length ? String(variables[index]) : `{${index}}`));
	},
};
