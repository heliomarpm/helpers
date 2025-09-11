// biome-ignore-all lint/suspicious/noThenProperty: false positive
// biome-ignore-all lint/suspicious/noExplicitAny: false positive
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Is, Utils } from "../src";

describe("Is", () => {
	describe("cnpj", () => {
		let cnpjValidos: Array<string>;
		let cnpjInvalidos: Array<string>;

		beforeAll(() => {
			cnpjValidos = Array.from({ length: 2000 }, () => Utils.gerarCNPJ());
			cnpjInvalidos = Array.from({ length: 2000 }, () => String(Number(Utils.gerarCNPJ()) + 2).padStart(14, "0"));
		});

		it("2K CNPJs validos devem retornar true", () => {
			cnpjValidos.forEach((cnpj) => {
				expect(Is.cnpj(cnpj)).toBe(true);
			});
			expect(Is.cnpj("11.222.333/0001-81")).toBe(true);
			expect(Is.cnpj("06.235.940/0002-27")).toBe(true);
		});

		it("2K CNPJs invalidos devem retornar false", () => {
			cnpjInvalidos.forEach((cnpj) => {
				expect(Is.cnpj(cnpj)).toBe(false);
			});
			expect(Is.cnpj("11.222.333/0001-82")).toBe(false);
			expect(Is.cnpj("06.235.940/0002-28")).toBe(false);
		});

		it("should return false for CNPJ with non-numeric characters", () => {
			const value = "12.345.678/0001-9a";
			expect(Is.cnpj(value)).toBe(false);
		});

		it("should return false for CNPJ with repeated digits", () => {
			const values = Array.from({ length: 10 }, (_, i) => {
				const n = String(i).repeat(2);
				return `${n}.${n}.${n}/${n}${n}-${n}`;
			});
			values.forEach((value) => {
				expect(Is.cnpj(value)).toBe(false);
			});
		});

		it("should return false for CNPJ with repeated letters", () => {
			const values = Array.from({ length: 26 }, (_, i) => {
				const letter = String.fromCharCode(65 + i); // 'A' até 'Z'
				return `${letter}${letter}.${letter}${letter}${letter}.${letter}${letter}${letter}/${letter}${letter}${letter}${letter}-${letter}${letter}`;
			});

			vi.spyOn(Date, "now").mockImplementation(() => new Date("2026-07-01").getTime());
			values.forEach((value) => {
				expect(Is.cnpj(value)).toBe(false);
			});
		});

		it("should return true for valid CNPJ with letters and numbers after July 1st, 2026", () => {
			const value = "12.ABC.345/01DE-35";
			vi.spyOn(Date, "now").mockImplementation(() => new Date("2026-07-01").getTime());
			expect(Is.cnpj(value)).toBe(true);
		});

		it("should return false for invalid CNPJ with letters and numbers after July 1st, 2026", () => {
			const value = "12.ABC.345/01DE-36";
			vi.spyOn(Date, "now").mockImplementation(() => new Date("2026-07-01").getTime());
			expect(Is.cnpj(value)).toBe(false);
		});
	});

	describe("cpf", () => {
		let cpfValidos: Array<string>;
		let cpfInvalidos: Array<string>;

		beforeAll(() => {
			cpfValidos = Array.from({ length: 2000 }, () => Utils.gerarCPF());
			cpfInvalidos = Array.from({ length: 2000 }, () => String(Number(Utils.gerarCPF()) + 1).padStart(11, "0"));
		});

		it("2K CPFs validos devem retornar true", () => {
			cpfValidos.forEach((cpf) => {
				expect(Is.cpf(cpf)).toBe(true);
			});

			const cpfs = ["03806597600", "42441456059", "44276083451", "19590783996", "71009480375", "79640905500"];

			cpfs.forEach((cpf) => {
				expect(Is.cpf(cpf)).toBe(true);
			});
		});

		it("2K CPFs invalidos devem retornar false", () => {
			cpfInvalidos.forEach((cpf) => {
				expect(Is.cpf(cpf)).toBe(false);
			});
			expect(Is.cpf("03806597601")).toBe(false);
		});

		it("should return false for CPF with repeated digits", () => {
			const values = Array.from({ length: 10 }, (_, i) => {
				const n = String(i).repeat(2);
				return `${n}.${n}.${n}/${n}${n}-${n}`;
			});
			values.forEach((value) => {
				expect(Is.cpf(value)).toBe(false);
			});
		});
	});

	describe("equals", () => {
		it("returns true for equal primitive values", () => {
			expect(Is.equals(1, 1)).toBe(true);
			expect(Is.equals("a", "a")).toBe(true);
			expect(Is.equals(true, true)).toBe(true);
		});

		it("returns false for unequal primitive values", () => {
			expect(Is.equals(1, 2)).toBe(false);
			expect(Is.equals("a", "b")).toBe(false);
			expect(Is.equals(true, false)).toBe(false);
		});

		it("returns true for equal objects with same property order", () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 1, b: 2 };
			expect(Is.equals(obj1, obj2)).toBe(true);
		});

		it("returns true for equal objects with different property order", () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { b: 2, a: 1 };
			expect(Is.equals(obj1, obj2)).toBe(true);
		});

		it("returns false for unequal objects", () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 1, b: 3 };
			expect(Is.equals(obj1, obj2)).toBe(false);
		});

		it("returns true for equal arrays (without ignoreOrder)", () => {
			const arr1 = [1, 2, 3];
			const arr2 = [1, 2, 3];
			expect(Is.equals(arr1, arr2)).toBe(true);
		});

		it("returns true for equal arrays (with ignoreOrder)", () => {
			const arr1 = [1, 2, 3];
			const arr2 = [3, 2, 1];
			expect(Is.equals(arr1, arr2, true)).toBe(true);
		});

		it("returns false for unequal arrays (without ignoreOrder)", () => {
			const arr1 = [1, 2, 3];
			const arr2 = [3, 2, 1];
			expect(Is.equals(arr1, arr2)).toBe(false);
		});

		it("returns false for unequal arrays", () => {
			const arr1 = [1, 2, 3];
			const arr2 = [1, 2, 4];
			expect(Is.equals(arr1, arr2)).toBe(false);
		});

		it("returns false for unequal arrays (with ignoreOrder)", () => {
			const arr1 = [1, 2, 3];
			const arr2 = [3, 2, 4];
			expect(Is.equals(arr1, arr2, true)).toBe(false);
		});

		it("returns true for equal objects (without checkKeysOnlyLeft)", () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 1, b: 2 };
			expect(Is.equals(obj1, obj2)).toBe(true);
		});

		it("returns false for unequal objects (without checkKeysOnlyLeft)", () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 1, b: 3 };
			expect(Is.equals(obj1, obj2)).toBe(false);
		});

		it("returns true for equal recursive objects", () => {
			const obj1 = { a: 1, b: { c: 2 } };
			const obj2 = { a: 1, b: { c: 2 } };
			expect(Is.equals(obj1, obj2)).toBe(true);
		});

		it("returns false for unequal recursive objects", () => {
			const obj1 = { a: 1, b: { c: 2 } };
			const obj2 = { a: 1, b: { c: 3 } };
			expect(Is.equals(obj1, obj2)).toBe(false);
		});

		it("returns false for null and undefined values", () => {
			expect(Is.equals(null, undefined)).toBe(false);
			expect(Is.equals(null, null)).toBe(true);
			expect(Is.equals(undefined, undefined)).toBe(true);
		});

		it("returns false for different types", () => {
			expect(Is.equals(1, "1")).toBe(false);
			expect(Is.equals(true, 1)).toBe(false);
		});

		it("returns true for equal dates", () => {
			const date1 = new Date("2022-01-01T00:00:00.000Z");
			const date2 = new Date("2022-01-01T00:00:00.000Z");
			expect(Is.equals(date1, date2)).toBe(true);
		});

		it("returns false for unequal dates", () => {
			const date1 = new Date("2022-01-01T00:00:00.000Z");
			const date2 = new Date("2022-01-02T00:00:00.000Z");
			expect(Is.equals(date1, date2)).toBe(false);
		});

		it("returns true for equal regular expressions", () => {
			const regex1 = /a/;
			const regex2 = /a/;
			expect(Is.equals(regex1, regex2)).toBe(true);
		});

		it("returns false for unequal regular expressions", () => {
			const regex1 = /a/;
			const regex2 = /b/;
			expect(Is.equals(regex1, regex2)).toBe(false);
		});

		it("returns true for equal maps", () => {
			const map1 = new Map([["a", 1]]);
			const map2 = new Map([["a", 1]]);
			expect(Is.equals(map1, map2)).toBe(true);
		});

		it("returns false for unequal maps", () => {
			const map1 = new Map([["a", 1]]);
			const map2 = new Map([["a", 2]]);
			expect(Is.equals(map1, map2)).toBe(false);
		});

		it("returns true for equal sets", () => {
			const set1 = new Set([1]);
			const set2 = new Set([1]);
			expect(Is.equals(set1, set2)).toBe(true);
		});

		it("returns false for unequal sets", () => {
			const set1 = new Set([1]);
			const set2 = new Set([2]);
			expect(Is.equals(set1, set2)).toBe(false);
		});

		it("returns false for null and undefined", () => {
			expect(Is.equals(null, undefined)).toBe(false);
			expect(Is.equals(undefined, null)).toBe(false);
		});

		it("returns false for different types", () => {
			expect(Is.equals(1, "1")).toBe(false);
			expect(Is.equals(true, 1)).toBe(false);
		});
	});

	describe("numeric", () => {
		it("should return true for number primitives", () => {
			expect(Is.numeric(1)).toBe(true);
			expect(Is.numeric(-1)).toBe(true);
			expect(Is.numeric(0)).toBe(true);
		});

		it("should return true for string representations of numbers", () => {
			expect(Is.numeric("1")).toBe(true);
			expect(Is.numeric("-1")).toBe(true);
			expect(Is.numeric("0")).toBe(true);
		});

		it("should return false for non-numeric strings", () => {
			expect(Is.numeric("abc")).toBe(false);
			expect(Is.numeric("hello")).toBe(false);
		});

		it("should return false for empty strings", () => {
			expect(Is.numeric("")).toBe(false);
		});

		it("should return false for null and undefined values", () => {
			expect(Is.numeric(null)).toBe(false);
			expect(Is.numeric(undefined)).toBe(false);
		});

		it("should return false for boolean values", () => {
			expect(Is.numeric(true)).toBe(false);
			expect(Is.numeric(false)).toBe(false);
		});

		it("should return false for objects and arrays", () => {
			expect(Is.numeric({})).toBe(false);
			expect(Is.numeric([])).toBe(false);
		});
	});

	describe("date", () => {
		it("should return true for valid date string", () => {
			expect(Is.date("2022-01-01")).toBe(true);
		});

		it("should return false for invalid date string", () => {
			expect(Is.date(undefined as unknown as string)).toBe(false);
		});

		it("should return true for Date object", () => {
			const date = new Date("2022-01-01");
			expect(Is.date(date.toDateString())).toBe(true);
		});

		it("should return false for non-date object", () => {
			expect(Is.date({} as unknown as string)).toBe(false);
		});

		it("should return false for null value", () => {
			expect(Is.date(null as unknown as string)).toBe(false);
		});

		it("should return false for undefined value", () => {
			expect(Is.date(undefined as unknown as string)).toBe(false);
		});
	});

	describe("OS", () => {
		let originalPlatform: string;

		beforeEach(() => {
			originalPlatform = process.platform;
		});

		afterEach(() => {
			Object.defineProperty(process, "platform", {
				value: originalPlatform,
				configurable: true,
			});
		});

		it("should return true on Mac OS", () => {
			Object.defineProperty(process, "platform", {
				value: "darwin",
				configurable: true,
			});

			expect(Is.plataform.macOS).toBe(true);
			expect(Is.plataform.windowsOS).toBe(false);
			expect(Is.plataform.linuxOS).toBe(false);
		});

		it("should return true on Windows OS", () => {
			Object.defineProperty(process, "platform", {
				value: "win32",
				configurable: true,
			});

			expect(Is.plataform.macOS).toBe(false);
			expect(Is.plataform.windowsOS).toBe(true);
			expect(Is.plataform.linuxOS).toBe(false);
		});

		it("should return true Linux OS", () => {
			Object.defineProperty(process, "platform", {
				value: "linux",
				configurable: true,
			});

			expect(Is.plataform.macOS).toBe(false);
			expect(Is.plataform.windowsOS).toBe(false);
			expect(Is.plataform.linuxOS).toBe(true);
		});
	});

	describe("arch_x86", () => {
		let originalArch: NodeJS.Architecture;

		beforeEach(() => {
			originalArch = process.arch;
		});

		afterEach(() => {
			Object.defineProperty(process, "arch", {
				value: originalArch,
				configurable: true,
			});
		});

		it("returns true when process.arch is ia32", () => {
			Object.defineProperty(process, "arch", {
				value: "ia32",
				configurable: true,
			});
			expect(Is.plataform.arch_x86).toBe(true);
			expect(Is.plataform.arch_x64).toBe(false);
		});

		it("returns false when process.arch is not ia32", () => {
			Object.defineProperty(process, "arch", {
				value: "x64",
				configurable: true,
			});

			expect(Is.plataform.arch_x86).toBe(false);
			expect(Is.plataform.arch_x64).toBe(true);
		});
	});

	describe("arch_Arm", () => {
		let originalArch: NodeJS.Architecture;

		beforeEach(() => {
			originalArch = process.arch;
		});

		afterEach(() => {
			Object.defineProperty(process, "arch", {
				value: originalArch,
				configurable: true,
			});
		});

		it("returns true when process.arch is arm", () => {
			Object.defineProperty(process, "arch", {
				value: "arm",
				configurable: true,
			});
			expect(Is.plataform.arch_Arm).toBe(true);
			expect(Is.plataform.arch_Arm64).toBe(false);
		});

		it("returns false when process.arch is not arm64", () => {
			Object.defineProperty(process, "arch", {
				value: "arm64",
				configurable: true,
			});

			expect(Is.plataform.arch_x86).toBe(false);
			expect(Is.plataform.arch_Arm64).toBe(true);
		});
	});

	describe("nullOrEmpty", () => {
		it("returns true for null value", () => {
			expect(Is.nullOrEmpty(null)).toBe(true);
		});

		it("returns true for undefined value", () => {
			expect(Is.nullOrEmpty(undefined)).toBe(true);
		});

		it("returns true for empty string", () => {
			expect(Is.nullOrEmpty("")).toBe(true);
		});

		it("returns false for non-empty string", () => {
			expect(Is.nullOrEmpty("hello")).toBe(false);
		});

		it("returns true for empty array", () => {
			expect(Is.nullOrEmpty([])).toBe(true);
		});

		it("returns false for non-empty array", () => {
			expect(Is.nullOrEmpty([1, 2, 3])).toBe(false);
		});

		it("returns true for empty object", () => {
			expect(Is.nullOrEmpty({})).toBe(true);
		});

		it("returns false for non-empty object", () => {
			expect(Is.nullOrEmpty({ a: 1 })).toBe(false);
		});

		it("returns false for number value", () => {
			expect(Is.nullOrEmpty(42)).toBe(false);
		});

		it("returns false for boolean value", () => {
			expect(Is.nullOrEmpty(true)).toBe(false);
		});
	});

	describe("object", () => {
		it("should return true for a valid object", () => {
			expect(Is.object({ name: "John", age: 30 })).toBe(true);
		});

		it("should return true for a empty object", () => {
			expect(Is.object({})).toBe(true);
		});

		it("should return false for an array", () => {
			expect(Is.object([])).toBe(false);
		});

		it("should return false for an array of object", () => {
			expect(Is.object([{ name: "John", age: 30 }])).toBe(false);
		});

		it("should return false for null", () => {
			expect(Is.object(null)).toBe(false);
		});

		it("should return false for undefined", () => {
			expect(Is.object(undefined)).toBe(false);
		});

		it("should return false for a number", () => {
			expect(Is.object(123)).toBe(false);
		});

		it("should return false for a string", () => {
			expect(Is.object("hello")).toBe(false);
		});

		it("should return false for a boolean", () => {
			expect(Is.object(true)).toBe(false);
		});
	});

	describe("email", () => {
		it("should validate common email formats", () => {
			expect(Is.email("user@email.com")).toBe(true);
			expect(Is.email("first.last@email.com")).toBe(true);
			expect(Is.email("user.name+tag@email.com")).toBe(true);
			expect(Is.email("user-name@email.com")).toBe(true);
			expect(Is.email("user_name@email.com")).toBe(true);
			expect(Is.email("u@email.com")).toBe(true);
			expect(Is.email("USER.NAME@email.br")).toBe(true);
			expect(Is.email("USER.NAME@e-mail.BR")).toBe(true);
			expect(Is.email("user@domain.COM")).toBe(true);
			expect(Is.email("user@domain.CoM")).toBe(true);
			expect(Is.email("user@dom123.com")).toBe(true);
		});

		it("should validate emails with multiple subdomains", () => {
			expect(Is.email("user@sub.example.com")).toBe(true);
			expect(Is.email("user@sub.sub2.example.co.uk")).toBe(true);
			expect(Is.email("user@e-email.com.br")).toBe(true);
		});

		it("should validate emails with special characters in local part", () => {
			expect(Is.email("user!name@example.com")).toBe(true);
			expect(Is.email("user#name@example.com")).toBe(true);
			expect(Is.email("user$name@example.com")).toBe(true);
			expect(Is.email("user%name@example.com")).toBe(true);
			expect(Is.email("user&name@example.com")).toBe(true);
			expect(Is.email("user*name@example.com")).toBe(true);
			expect(Is.email("$@example.com")).toBe(true);
			expect(Is.email("#@example.com")).toBe(true);
			expect(Is.email("!@example.com")).toBe(true);
			expect(Is.email("!test@example.com")).toBe(true);
		});

		it("should accept borderline valid emails", () => {
			expect(Is.email("a@b.co")).toBe(true); // menor possível
			expect(Is.email("user@123.com")).toBe(true); // domínio numérico
			expect(Is.email("user@sub-domain.com")).toBe(true); // subdomínio com hífen
			expect(Is.email("user_name+tag@domain.co.uk")).toBe(true); // mistura com +
		});

		// Emails inválidos
		it("should reject emails with invalid domain characters", () => {
			expect(Is.email("user@example!.com")).toBe(false);
			expect(Is.email("user@example#.com")).toBe(false);
			expect(Is.email("user@example$.com")).toBe(false);
			expect(Is.email("user@example%.com")).toBe(false);
			expect(Is.email("user.name@example...com")).toBe(false);
		});
		it("should return false for invalid email addresses", () => {
			expect(Is.email("user...@example.com")).toBe(false);
			expect(Is.email("user...name@example.com")).toBe(false);
			expect(Is.email("user..name@example.com")).toBe(false);
			expect(Is.email("invalid_email")).toBe(false);
			expect(Is.email("test@example")).toBe(false);
			expect(Is.email("@example.com")).toBe(false);
			expect(Is.email("test@.com")).toBe(false);
		});

		it("should return false for email addresses with special characters", () => {
			expect(Is.email("@@example.com")).toBe(false);
		});

		it("should reject emails with invalid TLD", () => {
			expect(Is.email("user@example.!BR")).toBe(false);
			expect(Is.email("user@example.com!")).toBe(false);
			expect(Is.email("user@example.c@m")).toBe(false);
		});

		it("should reject emails with missing parts", () => {
			expect(Is.email("user@")).toBe(false);
			expect(Is.email("@example.com")).toBe(false);
			expect(Is.email("user@.com")).toBe(false);
			expect(Is.email("user.example.com")).toBe(false);
		});

		it("should reject emails with spaces", () => {
			expect(Is.email("user name@example.com")).toBe(false);
			expect(Is.email("user@ex ample.com")).toBe(false);
			expect(Is.email(" user@example.com")).toBe(false);
			expect(Is.email("user@example.com ")).toBe(false);
		});

		it("should reject emails with consecutive dots", () => {
			expect(Is.email("user..name@example.com")).toBe(false);
			expect(Is.email("user@example..com")).toBe(false);
			expect(Is.email("user@example.com..")).toBe(false);
		});

		it("should reject emails with invalid starting/ending characters", () => {
			expect(Is.email(".user@example.com")).toBe(false);
			expect(Is.email("user.@example.com")).toBe(false);
			expect(Is.email("user@-example.com")).toBe(false);
			expect(Is.email("user@example-.com")).toBe(false);
		});

		it("should reject emails with invalid characters in domain", () => {
			expect(Is.email("test@example!com")).toBe(false);
			expect(Is.email("test@example#com")).toBe(false);
			expect(Is.email("test@example$com")).toBe(false);
		});
	});

	describe("odd", () => {
		it("should return true for positive odd numbers", () => {
			expect(Is.odd(1)).toBe(true);
			expect(Is.odd(3)).toBe(true);
			expect(Is.odd(5)).toBe(true);
		});

		it("should return false for positive even numbers", () => {
			expect(Is.odd(2)).toBe(false);
			expect(Is.odd(4)).toBe(false);
			expect(Is.odd(6)).toBe(false);
		});

		it("should return true for negative odd numbers", () => {
			expect(Is.odd(-1)).toBe(true);
			expect(Is.odd(-3)).toBe(true);
			expect(Is.odd(-5)).toBe(true);
		});

		it("should return false for negative even numbers", () => {
			expect(Is.odd(-2)).toBe(false);
			expect(Is.odd(-4)).toBe(false);
			expect(Is.odd(-6)).toBe(false);
		});

		it("should return false for zero", () => {
			expect(Is.odd(0)).toBe(false);
		});

		it("should return true for NaN and Infinity values", () => {
			expect(Is.odd(Number.NaN)).toBe(true);
			expect(Is.odd(Number.POSITIVE_INFINITY)).toBe(true);
		});
	});

	describe("even", () => {
		it("should return true for even numbers", () => {
			expect(Is.even(2)).toBe(true);
			expect(Is.even(4)).toBe(true);
			expect(Is.even(10)).toBe(true);
		});

		it("should return false for odd numbers", () => {
			expect(Is.even(1)).toBe(false);
			expect(Is.even(3)).toBe(false);
			expect(Is.even(9)).toBe(false);
		});

		it("should return false for NaN and Infinity values", () => {
			expect(Is.even(Number.NaN)).toBe(false);
			expect(Is.even(Number.POSITIVE_INFINITY)).toBe(false);
		});

		it("should return true for negative even numbers", () => {
			expect(Is.even(-2)).toBe(true);
			expect(Is.even(-4)).toBe(true);
			expect(Is.even(-10)).toBe(true);
		});

		it("should return true for zero", () => {
			expect(Is.even(0)).toBe(true);
		});
	});

	describe("uuid", () => {
		it("should return true for a valid UUID with lowercase letters", () => {
			expect(Is.uuid(Utils.generateUUIDv4().toLowerCase())).toBe(true);
		});

		it("should return true for a valid UUID with uppercase letters", () => {
			expect(Is.uuid(Utils.generateUUIDv4().toUpperCase())).toBe(true);
		});

		it("should return false for an invalid UUID with extra characters", () => {
			expect(Is.uuid("12345678-1234-1234-1234-1234567890123")).toBe(false);
		});

		it("should return false for an invalid UUID with missing characters", () => {
			expect(Is.uuid("12345678-1234-1234-1234-12345678")).toBe(false);
		});

		it("should return false for an empty string", () => {
			expect(Is.uuid("")).toBe(false);
		});
		it("should return false for an invalid UUID with non-hexadecimal characters", () => {
			expect(Is.uuid("12345678-1234-1234-1234-12345678901g")).toBe(false);
		});
	});

	describe("function", () => {
		it("returns true for a named function", () => {
			function testFunction() {
				// empty because placeholder for future implementation
			}
			expect(Is.function(testFunction)).toBe(true);
		});

		it("returns true for an arrow function", () => {
			const testFunction = () => {
				/* empty */
			};
			expect(Is.function(testFunction)).toBe(true);
		});

		it("returns false for a string", () => {
			expect(Is.function("not a function")).toBe(false);
		});

		it("returns false for a number", () => {
			expect(Is.function(123)).toBe(false);
		});

		it("returns false for an object", () => {
			expect(Is.function({})).toBe(false);
		});

		it("returns false for null", () => {
			expect(Is.function(null)).toBe(false);
		});

		it("returns false for undefined", () => {
			expect(Is.function(undefined)).toBe(false);
		});
	});

	describe("promise", () => {
		it("returns true for a resolved promise", () => {
			expect(Is.promise(Promise.resolve())).toBe(true);
		});

		it("returns true for a pending promise", () => {
			expect(
				Is.promise(
					new Promise(() => {
						/* empty */
					})
				)
			).toBe(true);
		});

		it("returns true for a rejected promise", () => {
			const rejectedPromise = Promise.reject(new Error("test"));
			rejectedPromise.catch(() => {
				/* empty */
			}); // Evita unhandled rejection
			expect(Is.promise(rejectedPromise)).toBe(true);
		});

		it("returns false for a non-promise value (string)", () => {
			expect(Is.promise("not a promise")).toBe(false);
		});

		it("returns false for a non-promise value (number)", () => {
			expect(Is.promise(42)).toBe(false);
		});

		it("returns false for a non-promise value (object)", () => {
			expect(Is.promise({})).toBe(false);
		});

		it("returns false for a non-promise value (null)", () => {
			expect(Is.promise(null)).toBe(false);
		});

		it("returns false for a non-promise value (undefined)", () => {
			expect(Is.promise(undefined)).toBe(false);
		});

		it("returns true for custom thenable objects", () => {
			const thenable = {
				then: () => true,
				catch: () => {
					throw new Error("test");
				},
			};

			expect(Is.promise(thenable)).toBe(true);
		});

		it("returns false for objects with only then method", () => {
			const fakePromise = {
				then: () => {
					/* empty */
				},
			};
			expect(Is.promise(fakePromise)).toBe(false);
		});

		it("returns false for objects with only catch method", () => {
			const fakePromise = {
				catch: () => {
					throw new Error("test");
				},
			};
			expect(Is.promise(fakePromise)).toBe(false);
		});
	});

	describe("url", () => {
		it("should return true for valid URLs with HTTP protocol", () => {
			expect(Is.url("http://www.example.com")).toBe(true);
		});

		it("should return true for valid URLs with HTTPS protocol", () => {
			expect(Is.url("https://www.example.com")).toBe(true);
		});

		it("should return false for invalid URLs without protocol", () => {
			expect(Is.url("www.example.com")).toBe(false);
		});

		it("should return true for URLs with special characters", () => {
			expect(Is.url("http://www.example.com!")).toBe(true);
		});

		it("should return true for URLs with query parameters", () => {
			expect(Is.url("http://www.example.com?param=value")).toBe(true);
		});

		it("should return true for URLs with fragments", () => {
			expect(Is.url("http://www.example.com#fragment")).toBe(true);
		});

		it("should return false for empty string", () => {
			expect(Is.url("")).toBe(false);
		});
	});

	describe("json", () => {
		it("should return true for valid JSON strings", () => {
			expect(Is.json('{"key": "value"}')).toBe(true);
			expect(Is.json('{"key": 123}')).toBe(true);
			expect(Is.json('{"key": true}')).toBe(true);
			expect(Is.json('{"key": null}')).toBe(true);
		});

		it("should return false for invalid JSON strings", () => {
			expect(Is.json("Invalid JSON")).toBe(false);
			expect(Is.json('{key: "value"}')).toBe(false);
			expect(Is.json('{"key": "value"')).toBe(false);
			expect(Is.json('{"key": "value"} }')).toBe(false);
		});

		it("should return false for empty strings", () => {
			expect(Is.json("")).toBe(false);
		});
	});
});
