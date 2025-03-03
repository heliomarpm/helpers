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
		expect(Format.number(number)).toBe('1.234.567,89');
	});

	test('should format phoneBR correctly', () => {
		expect(Format.ptBr.telefone(phone)).toBe('(11) 98765-4321');
	});

	test('should format cep correctly', () => {
		expect(Format.ptBr.cep(cep)).toBe('12345-678');
	});

	test('should format cnpj correctly', () => {
		expect(Format.ptBr.cnpj(cnpj)).toBe('12.345.678/0001-95');
	});

	test('should format cpf correctly', () => {
		expect(Format.ptBr.cpf(cpf)).toBe('123.456.789-09');
	});

	test('should format rg correctly', () => {
		expect(Format.ptBr.rg(rg)).toBe('12.345.678-9');
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

	test('should only return numbers from a string', () => {
		expect(Format.onlyNumbers('abc123def')).toBe('123');
	});

	test('should pad numbers with zeros correctly', () => {
		expect(Format.padZerosByMax(2, 10)).toBe('02');
		expect(Format.padZerosByMax(12, 110)).toBe('012');
	});

	describe('Format.date', () => {
		it('should format date with default format', () => {
			const date = new Date('2025-03-03 17:33:44.135');

			expect(Format.date(date, 'yy yyyy')).toBe('25 2025');
			expect(Format.date(date, 'mm mmm mmmm')).toBe('03 mar março');
			expect(Format.date(date, 'dd ddd dddd')).toBe('03 seg segunda-feira');
			expect(Format.date(date, 'hh HH')).toBe('05 17');
			expect(Format.date(date, 'MM')).toBe('33');
			expect(Format.date(date, 'ss')).toBe('44');
			expect(Format.date(date, 'SSS')).toBe('135');
			expect(Format.date(date, 'a A')).toBe('pm PM');
			expect(Format.date('2025/03/03 07:33', 'a A')).toBe('am AM');
			expect(Format.date(date, 'HH:MM:ss.SSS')).toBe('17:33:44.135');
			expect(Format.date(date, 'dddd, dd mmmm yyyy')).toBe('segunda-feira, 03 março 2025');
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
			const formattedDate = Format.date(date, 'dddd, dd mmmm yyyy', 'en-US');
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
			const formattedDate = Format.date(date, 'dddd');
			expect(formattedDate).toBe('quinta-feira');
		});

		it('should format date with abbreviated weekday name', () => {
			const date = new Date(2025, 2, 2);
			const formattedDate = Format.date(date, 'ddd', 'pt-BR');
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
});
