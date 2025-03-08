import { Format } from '../src';

describe('Format Class', () => {
	const number = 1234567.89;
	const phone = '11987654321';
	const cep = '12345678';
	const cnpj = '12345678000195';
	const cpf = '12345678909';
	const rg = '123456789';

	test('should format currency correctly', () => {
		expect(Format.currency(number)).toBe('R$ 1.234.567,89');
	});

	test('should format currency correctly', () => {
		expect(Format.currency(number, { locale: 'en', currency: 'USD' })).toBe('$1,234,567.89');
	});

	test('should format currency without symbol correctly', () => {
		expect(Format.number(number, 'pt-BR')).toBe('1.234.567,89');
	});

	test('should format phoneBR correctly', () => {
		expect(Format.ptBr.telefone(phone)).toBe('11 98765-4321');
	});

	it('should return empty string with empty raw value and default area code, suppressing error', () => {
		expect(Format.ptBr.telefone('', '')).toBe('Telefone está incorreto!');
	});

	it('should return formatted number with raw value and no default area code', () => {
		expect(Format.ptBr.telefone('12345678')).toBe('1234-5678');
	});

	it('should return formatted number with raw value and default area code', () => {
		expect(Format.ptBr.telefone('12345678', '11')).toBe('11 1234-5678');
	});

	it('should return original value with invalid raw value', () => {
		expect(Format.ptBr.telefone('123abc456', '')).toBe('Telefone está incorreto!');
	});

	it('should return formatted number with raw value of length 8', () => {
		expect(Format.ptBr.telefone('12345678')).toBe('1234-5678');
	});

	it('should return formatted number with raw value of length 9', () => {
		expect(Format.ptBr.telefone('123456789', '11')).toBe('11 12345-6789');
	});

	it('should return formatted number with raw value of length 10', () => {
		expect(Format.ptBr.telefone('1123456789')).toBe('11 2345-6789');
	});

	it('should throw error with invalid phone number', () => {
		expect(Format.ptBr.telefone('1234567', '')).toBe('Telefone está incorreto!');
	});
	it('should throw error with non-numeric characters', () => {
		expect(Format.ptBr.telefone('123abc456', '', 'Nº de telefone incorreto')).toBe('Nº de telefone incorreto');
	});

	test('should format cep correctly', () => {
		expect(Format.ptBr.cep(cep)).toBe('12345-678');
	});

	test('should return the original value if CEP is invalid (length not equal to 8)', () => {
		const cep = '1234567';
		const formattedCep = Format.ptBr.cep(cep, cep);
		expect(formattedCep).toBe('1234567');
	});

	test('should throw an error if CEP is invalid (length not equal to 8) and suppressError is false', () => {
		const cep = '1234567';
		expect(Format.ptBr.cep(cep)).toBe('CEP está incorreto!');
	});

	test('should format cnpj correctly', () => {
		expect(Format.ptBr.cnpj(cnpj)).toBe('12.345.678/0001-95');
	});

	test('should return the original value if CNPJ is invalid (length not equal to 14)', () => {
		const cnpj = '1234567';
		const result = Format.ptBr.cnpj(cnpj, cnpj);
		expect(result).toBe('1234567');
	});

	it('should throw an error if CNPJ is invalid (length not equal to 14) and suppressError is false', () => {
		const value = '1234567';
		expect(Format.ptBr.cnpj(value)).toBe('CNPJ está incorreto!');
	});

	test('should format cpf correctly', () => {
		expect(Format.ptBr.cpf(cpf)).toBe('123.456.789-09');
	});

	test('should return the original value for an invalid CPF (length not equal to 11)', () => {
		const cpf = '1234567890';
		const formattedCpf = Format.ptBr.cpf(cpf, cpf);
		expect(formattedCpf).toBe('1234567890');
	});

	test('should throw an error for an invalid CPF (length not equal to 11) and suppressError set to false', () => {
		const cpf = '1234567890';
		expect(Format.ptBr.cpf(cpf)).toBe('CPF está incorreto!');
	});

	test('should convert value to words correctly', () => {
		expect(Format.ptBr.valorPorExtenso(1)).toBe('um');
		expect(Format.ptBr.valorPorExtenso(13)).toBe('treze');
		expect(Format.ptBr.valorPorExtenso(23)).toBe('vinte e três');
		expect(Format.ptBr.valorPorExtenso(123)).toBe('cento e vinte e três');
		expect(Format.ptBr.valorPorExtenso(1123)).toBe('mil cento e vinte e três');

		expect(Format.ptBr.valorPorExtenso(1_000)).toBe('mil');
		expect(Format.ptBr.valorPorExtenso(1_001)).toBe('mil e um');
		expect(Format.ptBr.valorPorExtenso(1_234)).toBe('mil duzentos e trinta e quatro');
		expect(Format.ptBr.valorPorExtenso(2_001)).toBe('dois mil e um');
		expect(Format.ptBr.valorPorExtenso(1_010)).toBe('mil e dez');
		expect(Format.ptBr.valorPorExtenso(1_100)).toBe('mil e cem');
		expect(Format.ptBr.valorPorExtenso(100_000)).toBe('cem mil');
		expect(Format.ptBr.valorPorExtenso(100_001)).toBe('cem mil e um');
		expect(Format.ptBr.valorPorExtenso(101_000)).toBe('cento e um mil');
		expect(Format.ptBr.valorPorExtenso(102_000)).toBe('cento e dois mil');
		expect(Format.ptBr.valorPorExtenso(1_000_000)).toBe('um milhão');
		expect(Format.ptBr.valorPorExtenso(2_000_000)).toBe('dois milhões');
		expect(Format.ptBr.valorPorExtenso(1_101_000)).toBe('um milhão cento e um mil');
		expect(Format.ptBr.valorPorExtenso(1_100_000)).toBe('um milhão e cem mil');
		expect(Format.ptBr.valorPorExtenso(1_234_567)).toBe('um milhão duzentos e trinta e quatro mil quinhentos e sessenta e sete');
		expect(Format.ptBr.valorPorExtenso(1_000_001)).toBe('um milhão e um');
		expect(Format.ptBr.valorPorExtenso(1_234_567_890_123_456)).toBe(
			'um quatrilhão duzentos e trinta e quatro trilhões quinhentos e sessenta e sete bilhões oitocentos e noventa milhões cento e vinte e três mil quatrocentos e cinquenta e seis'
		);
	});

	it('should throw an error for values outside the valid range', () => {
		expect(() => Format.ptBr.valorPorExtenso(-1)).toThrowError('O valor deve estar entre 0 e 999.999.999.999.999.999');
		expect(() => Format.ptBr.valorPorExtenso(1000 ** 6)).toThrowError('O valor deve estar entre 0 e 999.999.999.999.999.999');
	});

	test('should only return numbers from a string', () => {
		expect(Format.onlyNumbers('abc123def')).toBe('123');
	});

	test('should pad numbers with zeros correctly', () => {
		expect(Format.padZerosByRef(2, 10)).toBe('02');
		expect(Format.padZerosByRef(12, 110)).toBe('012');
	});

	describe('Format.date', () => {
		it('should format date with default format', () => {
			const date = new Date('2025-03-03 17:33:44.135');

			expect(Format.date(date, 'yy yyyy')).toBe('25 2025');
			expect(Format.date(date, 'mm mmm. mmmm', 'pt-BR').toLocaleLowerCase()).toBe('03 mar. março');
			expect(Format.date(date, 'dd ddd. dddd', 'pt-BR').toLocaleLowerCase()).toBe('03 seg. segunda-feira');
			expect(Format.date(date, 'hh HH')).toBe('05 17');
			expect(Format.date(date, 'MM')).toBe('33');
			expect(Format.date(date, 'ss')).toBe('44');
			expect(Format.date(date, 'SSS')).toBe('135');
			expect(Format.date(date, 'a A')).toBe('pm PM');
			expect(Format.date('2025/03/03 07:33', 'a A')).toBe('am AM');
			expect(Format.date(date, 'HH:MM:ss.SSS')).toBe('17:33:44.135');
			expect(Format.titleCase(Format.date(date, 'dddd, dd mmmm yyyy', 'pt-BR'))).toBe('Segunda-feira, 03 Março 2025');
		});

		it('should format date with default format', () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, 'dd/mm/yyyy');
			expect(formattedDate).toBe('01/08/2024');
		});

		it('should format date with custom format', () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, 'HH:MM:ss');
			expect(formattedDate).toBe('00:00:00');
		});

		it('should format date with locale', () => {
			const date = new Date(2025, 2, 2);
			const formattedDate = Format.titleCase(Format.date(date, 'dddd, dd mmmm yyyy', 'en-US'));
			expect(formattedDate).toBe('Sunday, 02 March 2025');
		});

		it('should handle invalid date', () => {
			const date = ' invalid date ';
			expect(() => Format.date(date, 'dd/mm/yyyy')).toThrowError();
		});

		it('should format date with am/pm', () => {
			const date = new Date(2024, 7, 1, 12);
			const formattedDate = Format.date(date, 'hh:MM a');
			expect(formattedDate).toBe('12:00 pm');
		});

		it('should format date with AM/PM', () => {
			const date = new Date(2024, 7, 1, 12);
			const formattedDate = Format.date(date, 'hh:MM A');
			expect(formattedDate).toBe('12:00 PM');
		});

		it('should format date with two-digit hours', () => {
			const date = new Date(2024, 7, 1, 12);
			const formattedDate = Format.date(date, 'HH:MM');
			expect(formattedDate).toBe('12:00');
		});

		it('should format date with two-digit minutes', () => {
			const date = new Date(2024, 7, 1, 12, 30);
			const formattedDate = Format.date(date, 'HH:MM');
			expect(formattedDate).toBe('12:30');
		});

		it('should format date with two-digit seconds', () => {
			const date = new Date(2024, 7, 1, 12, 30, 45);
			const formattedDate = Format.date(date, 'HH:MM:ss');
			expect(formattedDate).toBe('12:30:45');
		});

		it('should format date with four-digit year', () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, 'yyyy');
			expect(formattedDate).toBe('2024');
		});

		it('should format date with two-digit year', () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, 'yy');
			expect(formattedDate).toBe('24');
		});

		it('should format date with full month name', () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, 'mmmm', 'en-US');
			expect(formattedDate).toBe('August');
		});

		it('should format date with abbreviated month name', () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, 'mmm', 'en-US');
			expect(formattedDate).toBe('Aug');
		});

		it('should format date with two-digit month', () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, 'mm');
			expect(formattedDate).toBe('08');
		});

		it('should format date with full weekday nam, locale en-US', () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, 'dddd', 'en-US');
			expect(formattedDate).toBe('Thursday');
		});

		it('should format date with full weekday nam, locale pt-BR', () => {
			const date = new Date(2024, 7, 1);
			const formattedDate = Format.date(date, 'dddd', 'pt-BR').toLocaleLowerCase();
			expect(formattedDate).toBe('quinta-feira');
		});

		it('should format date with abbreviated weekday name', () => {
			const date = new Date(2025, 2, 2);
			const formattedDate = Format.date(date, 'ddd', 'pt-BR').toLocaleLowerCase();
			expect(formattedDate).toBe('dom');
		});

		it('should format date with two-digit day', () => {
			const date = new Date('2024-08-01T12:00:00.000Z');
			const formattedDate = Format.date(date, 'dd');
			expect(formattedDate).toBe('01');
		});

		it('should handle date with timezone offset', () => {
			const date = new Date('2024-08-01T20:00:00.000');
			const formattedDate = Format.date(date, 'hh:MM:ss');
			expect(formattedDate).toBe('08:00:00');
		});

		it('should handle date with timezone offset', () => {
			const date = new Date('2024-08-01T20:00:00.000');
			const formattedDate = Format.date(date, 'h:MM:ss a');
			expect(formattedDate).toBe('8:00:00 pm');
		});

		it('should handle date with milliseconds', () => {
			const date = new Date('2024-07-01T12:00:00.123');
			const formattedDate = Format.date(date, 'HH:MM:ss.SSS');
			expect(formattedDate).toBe('12:00:00.123');
		});
	});

	describe('abbreviateNumber', () => {
		it('abbreviates numbers with different magnitudes', () => {
			expect(Format.abbreviateNumber(1500)).toBe('1.5K');
			expect(Format.abbreviateNumber(2000000)).toBe('2M');
			expect(Format.abbreviateNumber(123456789)).toBe('123.46M');
			expect(Format.abbreviateNumber(123456789, { fractionDigits: 1 })).toBe('123.5M');
			expect(Format.abbreviateNumber(1e33, { removeEndZero: false })).toBe('1.00D');
		});

		it('abbreviates numbers with different fraction digits', () => {
			expect(Format.abbreviateNumber(1005, { fractionDigits: 3 })).toBe('1.005K');
			expect(Format.abbreviateNumber(2_449_000, { fractionDigits: 1 })).toBe('2.4M');
			expect(Format.abbreviateNumber(2_450_000, { fractionDigits: 1 })).toBe('2.5M');
		});

		it('abbreviates numbers with and without removing trailing zeros', () => {
			expect(Format.abbreviateNumber(1500, { removeEndZero: false })).toBe('1.50K');
			expect(Format.abbreviateNumber(1500, { removeEndZero: true })).toBe('1.5K');
		});

		it('returns original number as string if no abbreviation is applicable', () => {
			expect(Format.abbreviateNumber(500)).toBe('500');
		});

		it('handles decimal numbers', () => {
			expect(Format.abbreviateNumber(1234.56)).toBe('1.23K');
		});
	});

	describe('titleCase function', () => {
		it('should return empty string for empty input', () => {
			expect(Format.titleCase('')).toBe('');
		});

		it('should capitalize single word input', () => {
			expect(Format.titleCase('john')).toBe('John');
		});

		it('should capitalize multiple words input with no conjunctions', () => {
			expect(Format.titleCase('john smith')).toBe('John Smith');
		});

		it('should maintain lowercase conjunctions in multiple words input', () => {
			expect(Format.titleCase('john doe de souza')).toBe('John Doe de Souza');
			expect(Format.titleCase('maria da silva')).toBe('Maria da Silva');
		});

		it('should ignore leading/trailing whitespace', () => {
			expect(Format.titleCase('  john smith  ')).toBe('John Smith');
		});

		it('should handle multiple consecutive whitespace characters', () => {
			expect(Format.titleCase('john   smith')).toBe('John Smith');
		});
	});
});
