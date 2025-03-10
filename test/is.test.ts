import { describe, beforeAll, it, expect, beforeEach, afterEach } from 'vitest';
import { Is, Utils } from '../src';

describe('Is', () => {
	describe('cnpj', () => {
		let cnpjValidos: Array<any>;
		let cnpjInvalidos: Array<any>;

		beforeAll(() => {
			cnpjValidos = Array.from({ length: 10000 }, () => Utils.gerarCNPJ());
			cnpjInvalidos = Array.from({ length: 10000 }, () => String(Number(Utils.gerarCNPJ()) + 2).padStart(14, '0'));
		});

		it('10mil CNPJs validos devem retornar true', () => {
			cnpjValidos.forEach(cnpj => {
				expect(Is.cnpj(cnpj)).toBe(true);
			});
			expect(Is.cnpj('11.222.333/0001-81')).toBe(true);
			expect(Is.cnpj('06.235.940/0002-27')).toBe(true);
		});

		it('10mil CNPJs invalidos devem retornar false', () => {
			cnpjInvalidos.forEach(cnpj => {
				expect(Is.cnpj(cnpj)).toBe(false);
			});
			expect(Is.cnpj('11.222.333/0001-82')).toBe(false);
			expect(Is.cnpj('06.235.940/0002-28')).toBe(false);
		});
	});
	describe('cpf', () => {
		let cpfValidos: Array<any>;
		let cpfInvalidos: Array<any>;

		beforeAll(() => {
			cpfValidos = Array.from({ length: 10000 }, () => Utils.gerarCPF());
			cpfInvalidos = Array.from({ length: 10000 }, () => String(Number(Utils.gerarCPF()) + 1).padStart(11, '0'));
		});

		it('10mil CPFs validos devem retornar true', () => {
			cpfValidos.forEach(cpf => {
				expect(Is.cpf(cpf)).toBe(true);
			});

			const cpfs = ['03806597600', '42441456059', '44276083451', '19590783996', '71009480375', '79640905500'];

			cpfs.forEach(cpf => {
				expect(Is.cpf(cpf)).toBe(true);
			});
		});

		it('10mil CPFs invalidos devem retornar false', () => {
			cpfInvalidos.forEach(cpf => {
				expect(Is.cpf(cpf)).toBe(false);
			});
			expect(Is.cpf('03806597601')).toBe(false);
		});
	});

	describe('Is.equals', () => {
		it('returns true for equal primitive values', () => {
			expect(Is.equals(1, 1)).toBe(true);
			expect(Is.equals('a', 'a')).toBe(true);
			expect(Is.equals(true, true)).toBe(true);
		});

		it('returns false for unequal primitive values', () => {
			expect(Is.equals(1, 2)).toBe(false);
			expect(Is.equals('a', 'b')).toBe(false);
			expect(Is.equals(true, false)).toBe(false);
		});

		it('returns true for equal objects with same property order', () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 1, b: 2 };
			expect(Is.equals(obj1, obj2)).toBe(true);
		});

		it('returns true for equal objects with different property order', () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { b: 2, a: 1 };
			expect(Is.equals(obj1, obj2)).toBe(true);
		});

		it('returns false for unequal objects', () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 1, b: 3 };
			expect(Is.equals(obj1, obj2)).toBe(false);
		});

		it('returns true for equal arrays with same order', () => {
			const arr1 = [1, 2, 3];
			const arr2 = [1, 2, 3];
			expect(Is.equals(arr1, arr2)).toBe(true);
		});

		it('returns true for equal arrays with different order (ignoreOrder = true)', () => {
			const arr1 = [1, 2, 3];
			const arr2 = [3, 2, 1];
			expect(Is.equals(arr1, arr2, true)).toBe(true);
		});

		it('returns false for unequal arrays', () => {
			const arr1 = [1, 2, 3];
			const arr2 = [1, 2, 4];
			expect(Is.equals(arr1, arr2)).toBe(false);
		});

		it('returns false for null and undefined values', () => {
			expect(Is.equals(null, undefined)).toBe(false);
			expect(Is.equals(null, null)).toBe(true);
			expect(Is.equals(undefined, undefined)).toBe(true);
		});

		it('returns false for different types', () => {
			expect(Is.equals(1, '1')).toBe(false);
			expect(Is.equals(true, 1)).toBe(false);
		});
	});

	describe('Is.numeric', () => {
		it('should return true for number primitives', () => {
			expect(Is.numeric(1)).toBe(true);
			expect(Is.numeric(-1)).toBe(true);
			expect(Is.numeric(0)).toBe(true);
		});

		it('should return true for string representations of numbers', () => {
			expect(Is.numeric('1')).toBe(true);
			expect(Is.numeric('-1')).toBe(true);
			expect(Is.numeric('0')).toBe(true);
		});

		it('should return false for non-numeric strings', () => {
			expect(Is.numeric('abc')).toBe(false);
			expect(Is.numeric('hello')).toBe(false);
		});

		it('should return false for empty strings', () => {
			expect(Is.numeric('')).toBe(false);
		});

		it('should return false for null and undefined values', () => {
			expect(Is.numeric(null)).toBe(false);
			expect(Is.numeric(undefined)).toBe(false);
		});

		it('should return false for boolean values', () => {
			expect(Is.numeric(true)).toBe(false);
			expect(Is.numeric(false)).toBe(false);
		});

		it('should return false for objects and arrays', () => {
			expect(Is.numeric({})).toBe(false);
			expect(Is.numeric([])).toBe(false);
		});
	});

	describe('Is.date', () => {
		it('should return true for valid date string', () => {
			expect(Is.date('2022-01-01')).toBe(true);
		});

		it('should return false for invalid date string', () => {
			expect(Is.date(undefined)).toBe(false);
		});

		it('should return true for Date object', () => {
			const date = new Date('2022-01-01');
			expect(Is.date(date)).toBe(true);
		});

		it('should return false for non-date object', () => {
			expect(Is.date({})).toBe(false);
		});

		it('should return false for null value', () => {
			expect(Is.date(null)).toBe(false);
		});

		it('should return false for undefined value', () => {
			expect(Is.date(undefined)).toBe(false);
		});
	});

	describe('OS', () => {
		let originalPlatform: string;

		beforeEach(() => {
			originalPlatform = process.platform;
		});

		afterEach(() => {
			Object.defineProperty(process, 'platform', {
				value: originalPlatform,
				configurable: true
			});
		});

		it('should return true on Mac OS', () => {
			Object.defineProperty(process, 'platform', {
				value: 'darwin',
				configurable: true
			});

			expect(Is.macOS).toBe(true);
			expect(Is.windowsOS).toBe(false);
			expect(Is.linuxOS).toBe(false);
		});

		it('should return true on Windows OS', () => {
			Object.defineProperty(process, 'platform', {
				value: 'win32',
				configurable: true
			});

			expect(Is.macOS).toBe(false);
			expect(Is.windowsOS).toBe(true);
			expect(Is.linuxOS).toBe(false);
		});

		it('should return true Linux OS', () => {
			Object.defineProperty(process, 'platform', {
				value: 'linux',
				configurable: true
			});

			expect(Is.macOS).toBe(false);
			expect(Is.windowsOS).toBe(false);
			expect(Is.linuxOS).toBe(true);
		});
	});

	describe('arch_x86', () => {
		let originalArch: any;

		beforeEach(() => {
			originalArch = process.arch;
		});

		afterEach(() => {
			Object.defineProperty(process, 'arch', {
				value: originalArch,
				configurable: true
			});
		});

		it('returns true when process.arch is ia32', () => {
			Object.defineProperty(process, 'arch', {
				value: 'ia32',
				configurable: true
			});
			expect(Is.arch_x86).toBe(true);
			expect(Is.arch_x64).toBe(false);
		});

		it('returns false when process.arch is not ia32', () => {
			Object.defineProperty(process, 'arch', {
				value: 'x64',
				configurable: true
			});

			expect(Is.arch_x86).toBe(false);
			expect(Is.arch_x64).toBe(true);
		});
	});

	describe('arch_Arm', () => {
		let originalArch: any;

		beforeEach(() => {
			originalArch = process.arch;
		});

		afterEach(() => {
			Object.defineProperty(process, 'arch', {
				value: originalArch,
				configurable: true
			});
		});

		it('returns true when process.arch is arm', () => {
			Object.defineProperty(process, 'arch', {
				value: 'arm',
				configurable: true
			});
			expect(Is.arch_Arm).toBe(true);
			expect(Is.arch_Arm64).toBe(false);
		});

		it('returns false when process.arch is not arm64', () => {
			Object.defineProperty(process, 'arch', {
				value: 'arm64',
				configurable: true
			});

			expect(Is.arch_x86).toBe(false);
			expect(Is.arch_Arm64).toBe(true);
		});
	});

	describe('Is.nullOrEmpty', () => {
		it('returns true for null value', () => {
			expect(Is.nullOrEmpty(null)).toBe(true);
		});

		it('returns true for undefined value', () => {
			expect(Is.nullOrEmpty(undefined)).toBe(true);
		});

		it('returns true for empty string', () => {
			expect(Is.nullOrEmpty('')).toBe(true);
		});

		it('returns false for non-empty string', () => {
			expect(Is.nullOrEmpty('hello')).toBe(false);
		});

		it('returns true for empty array', () => {
			expect(Is.nullOrEmpty([])).toBe(true);
		});

		it('returns false for non-empty array', () => {
			expect(Is.nullOrEmpty([1, 2, 3])).toBe(false);
		});

		it('returns true for empty object', () => {
			expect(Is.nullOrEmpty({})).toBe(true);
		});

		it('returns false for non-empty object', () => {
			expect(Is.nullOrEmpty({ a: 1 })).toBe(false);
		});

		it('returns false for number value', () => {
			expect(Is.nullOrEmpty(42)).toBe(false);
		});

		it('returns false for boolean value', () => {
			expect(Is.nullOrEmpty(true)).toBe(false);
		});
	});

	describe('Is.object', () => {
		it('should return true for a valid object', () => {
			expect(Is.object({name: 'John', age: 30})).toBe(true);
		});

		it('should return true for a empty object', () => {
			expect(Is.object({})).toBe(true);
		});

		it('should return false for an array', () => {
			expect(Is.object([])).toBe(false);
		});

		it('should return false for an array of object', () => {
			expect(Is.object([{name: 'John', age: 30}])).toBe(false);
		});

		it('should return false for null', () => {
			expect(Is.object(null)).toBe(false);
		});

		it('should return false for undefined', () => {
			expect(Is.object(undefined)).toBe(false);
		});

		it('should return false for a number', () => {
			expect(Is.object(123)).toBe(false);
		});

		it('should return false for a string', () => {
			expect(Is.object('hello')).toBe(false);
		});

		it('should return false for a boolean', () => {
			expect(Is.object(true)).toBe(false);
		});
	});

	describe('Is.email', () => {
		it('should return true for valid email addresses', () => {
			expect(Is.email('heliomarpm@proton.me')).toBe(true);
			expect(Is.email('test@example.com')).toBe(true);
			expect(Is.email('hello.world@example.co.uk')).toBe(true);
		});

		it('should return false for invalid email addresses', () => {
			expect(Is.email('invalid_email')).toBe(false);
			expect(Is.email('test@example')).toBe(false);
			expect(Is.email('@example.com')).toBe(false);
			expect(Is.email('test@.com')).toBe(false);
		});

		it('should return false for email addresses with special characters', () => {
			expect(Is.email('test@example!com')).toBe(false);
			expect(Is.email('test@example#com')).toBe(false);
			expect(Is.email('test@example$com')).toBe(false);
		});
	});
});
