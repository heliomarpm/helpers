import { To, DatePartsType } from '../src';

describe('To', () => {
	describe('dictionary', () => {
		it('deve converter um objeto JSON para um Record<string, T>', () => {
			const jsonObject = { key1: 'value1', key2: 'value2' };
			const result = To.dictionary<string>(jsonObject);
			expect(result).toEqual(jsonObject);
		});
	});

	describe('boolean', () => {
		it('deve converter números para booleanos corretos', () => {
			expect(To.boolean(1)).toBe(true);
			expect(To.boolean(0)).toBe(false);
			expect(To.boolean('0')).toBe(false);
			expect(To.boolean(123)).toBe(true);
		});

		it('deve converter strings para booleanos corretos', () => {
			expect(To.boolean('true')).toBe(true);
			expect(To.boolean('True')).toBe(true);
			expect(To.boolean('false')).toBe(false);
			expect(To.boolean('randomString')).toBe(false);
		});
	});

	describe('dateParts', () => {
		it('deve extrair partes da data de um objeto Date', () => {
			const date = new Date(2024, 6, 1, 12, 30, 45);
			const result: DatePartsType = To.dateParts(date);

			expect(result).toEqual({
				year: 2024,
				month: 7,
				day: 1,
				hour: 12,
				minute: 30,
				second: 45,
				timestamp: date.getTime()
			});
		});

		it('deve extrair partes da data de uma string', () => {
			const dateString = '2024-07-01T12:30:45';
			const date = new Date(dateString);
			const result: DatePartsType = To.dateParts(dateString);

			expect(result).toEqual({
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				day: date.getDate(),
				hour: date.getHours(),
				minute: date.getMinutes(),
				second: date.getSeconds(),
				timestamp: date.getTime()
			});
		});

		it('deve lidar com datas inválidas', () => {
			const invalidDate = 'invalid-date';
			const result: DatePartsType = To.dateParts(invalidDate as unknown as Date); // Coerção de tipo para fins de teste

			expect(result).toEqual({
				year: NaN,
				month: NaN,
				day: NaN,
				hour: NaN,
				minute: NaN,
				second: NaN,
				timestamp: NaN
			});
		});
	});

	describe('To.number', () => {
		it('should convert numeric values as-is', () => {
			expect(To.number(42)).toBe(42);
			expect(To.number(-42)).toBe(-42);
			expect(To.number(0)).toBe(0);
		});

		it('should convert string representations of numbers correctly', () => {
			expect(To.number('42')).toBe(42);
			expect(To.number('-42')).toBe(-42);
			expect(To.number('0')).toBe(0);
		});

		it('should convert non-numeric strings to NaN', () => {
			expect(To.number('abc')).toBeNaN();
			expect(To.number('hello')).toBeNaN();
		});

		it('should convert null and undefined values to NaN', () => {
			expect(To.number(null)).toBeNaN();
			expect(To.number(undefined)).toBeNaN();
		});

		it('should convert boolean values to NaN', () => {
			expect(To.number(true)).toBeNaN();
			expect(To.number(false)).toBeNaN();
		});
	});
});
