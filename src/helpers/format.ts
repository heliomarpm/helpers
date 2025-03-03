export const Format = {
	/**
	 * Formatações em português brasileiro.
	 */
	ptBr: {
		cnpj: (value: string): string => {
			return Format.onlyNumbers(value).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
		},
		cpf: (value: string): string => {
			return Format.onlyNumbers(value).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
		},
		rg: (value: string): string => {
			return Format.onlyNumbers(value).replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
		},
		cep: (value: string): string => {
			return Format.onlyNumbers(value).replace(/(\d{5})(\d{3})/, '$1-$2');
		},
		telefone: (value: string): string => {
			return Format.onlyNumbers(value).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
		},

		/**
		 * Converte um valor em uma string escrita por extenso.
		 *
		 * Exemplos:
		 *  - 0: zero
		 *  - 1: um
		 *  - 10: dez
		 *  - 100: cem
		 *  - 101: cento e um
		 *  - 1000: mil
		 *  - 1001: mil e um
		 *  - 1_000_000: um milhão
		 *  - 1_000_001: um milhão e um
		 *  - 1_000_000_000: um bilhão
		 *  - 1_000_000_001: um bilhão e um
		 *
		 * @param value O valor a ser convertido.
		 *
		 * @returns Uma string com o valor escrito por extenso.
		 */
		valorPorExtenso: (value: number): string => {
			const units: string[] = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
			const tens: string[] = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
			const tensMore: string[] = ['onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
			const hundreds: string[] = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
			const thousands: string[] = ['', 'mil', 'milhão', 'bilhão', 'trilhão', 'quatrilhão'];

			// Função para converter centenas, dezenas e unidades
			const convertHundreds = (value: number): string => {
				if (value === 0) return '';

				const hundred = Math.floor(value / 100);
				const ten = Math.floor((value % 100) / 10);
				const unit = value % 10;
				let extenso = '';

				if (hundred > 0) {
					// extenso +=  hundreds[hundred] + ' ';
					extenso += value === 100 ? 'cem ' : hundreds[hundred] + ' ';
					if (ten > 0 || unit > 0) extenso += 'e ';
				}

				if (ten === 1 && unit > 0) {
					extenso += tensMore[unit - 1] + ' ';
				} else {
					if (ten > 0) {
						extenso += tens[ten] + ' ';
						if (unit > 0) extenso += 'e ';
					}

					if (unit > 0) {
						extenso += units[unit] + ' ';
					}
				}

				return extenso.trim();
			};

			// Função principal para converter o número completo
			if (value === 0) return units[0];
			if (value === 100) return 'cem';

			let extenso = '';
			const vQuadrillions = Math.floor(value / 1_000_000_000_000_000);
			const vTrillions = Math.floor((value % 1_000_000_000_000_000) / 1_000_000_000_000);
			const vBillions = Math.floor((value % 1_000_000_000_000) / 1_000_000_000);
			const vMillions = Math.floor((value % 1_000_000_000) / 1_000_000);
			const vThousands = Math.floor((value % 1_000_000) / 1000);
			const vRemainder = value % 1000;

			// Quadrilhoes
			if (vQuadrillions > 0) {
				extenso += convertHundreds(vQuadrillions) + ' ';
				extenso += vQuadrillions > 1 ? thousands[5].replace('ão', 'ões') : thousands[5];
				extenso += ' ';
			}
			// Trilhoes
			if (vTrillions > 0) {
				extenso += convertHundreds(vTrillions) + ' ';
				extenso += vTrillions > 1 ? thousands[4].replace('ão', 'ões') : thousands[4];
				extenso += ' ';
			}

			// Bilhões
			if (vBillions > 0) {
				extenso += convertHundreds(vBillions) + ' ';
				extenso += vBillions > 1 ? thousands[3].replace('ão', 'ões') : thousands[3];
				extenso += ' ';
			}

			// Milhões
			if (vMillions > 0) {
				extenso += convertHundreds(vMillions) + ' ';
				extenso += vMillions > 1 ? thousands[2].replace('ão', 'ões') : thousands[2];
				extenso += ' ';
			}

			// Milhares
			if (vThousands > 0) {
				extenso += vThousands === 1 ? 'mil ' : convertHundreds(vThousands) + ' ' + thousands[1] + ' ';
			}

			// Resto (centenas, dezenas e unidades)
			if (vRemainder > 0) {
				if (vQuadrillions > 0 || vTrillions > 0 || vBillions > 0 || vMillions > 0 || vThousands > 0) {
					extenso += vRemainder < 101 ? ' e ' : ' ';
				}
				extenso += convertHundreds(vRemainder);
			}

			return extenso
				.trim()
				.replace(/\s+/g, ' ')
				.replace(/(\ão|\ões) cem/g, '$1 e cem');
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
	 * @param {string} locale - The locale to use. Defaults to 'pt-BR'.
	 * @returns {string} The date formatted as a string.
	 *
	 * @example
	 * ```js
	 * Format.date('2025-03-02', 'dddd, dd mmmm yyyy', 'en-US'); // Output: 'Sunday, 02 March 2025'
	 * ```
	 */
	date: (date: Date | string, format: string, locale: string = 'pt-BR'): string => {
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
	 */
	currency: (value: number, options: { locale: Intl.LocalesArgument; currency: string } = { locale: 'pt-BR', currency: 'BRL' }): string => {
		const result = value.toLocaleString(options.locale, { style: 'currency', currency: options.currency });
		return result.replace(/\u00A0/g, ' '); // Substitui o espaço não quebrável (\u00A0) por um espaço comum
	},
	
	/**
	 * Formats a number according to the given locale.
	 * @param value The number to format.
	 * @param locale The locale to use. Defaults to 'pt-BR'.
	 * @returns The formatted string.
	 *
	 * @example
	 * ```js
	 * Format.number(123456.78); // '123.456,78'Format.number(1234.56);
	 * // Output: 1.234,56
	 * ```
	 */
	number: (value: number, locale: Intl.LocalesArgument = 'pt-BR'): string => {
		return value.toLocaleString(locale, { minimumFractionDigits: 2 });
	},

	onlyNumbers: (value: string): string => {
		return value.replace(/\D/g, '');
	},

	/**
	 * Pads a number with leading zeros to match the number of digits in a given maximum value.
	 *
	 * @param {number} value The number to be padded with leading zeros.
	 * @param {number} maxValue The maximum value for which the number of digits will be used to determine the padding length
	 *
	 *  @returns {string} the input number padded with leading zeros to match the number of digits in the maximum value.
	 *
	 * @example
	 * ```js
	 * Format.padZerosByMax(2, 10); // '02'
	 * Format.padZerosByMax(12, 110); // '012'
	 * ```
	 */
	padZerosByMax(value: number, maxValue: number): string {
		const numDigits = Math.floor(Math.log10(maxValue) + 1);
		return value.toString().padStart(numDigits, '0');
	}
};
