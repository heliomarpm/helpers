// biome-ignore-all lint/suspicious/noExplicitAny: false positive
// biome-ignore-all lint/style/noNonNullAssertion: false positive
import { afterEach, beforeAll, beforeEach, describe, expect, it, test, vi } from "vitest";

import { Utils } from "../src";

describe("Utils", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe("gerarCPF function", () => {
		it("deve gerar um CPF válido", () => {
			const cpf = Utils.gerarCPF();
			expect(cpf).toMatch(/^\d{11}$/); // Verifica se o CPF tem 11 dígitos
		});

		it("deve gerar CPFs diferentes em chamadas consecutivas", () => {
			const cpf1 = Utils.gerarCPF();
			const cpf2 = Utils.gerarCPF();
			expect(cpf1).not.toBe(cpf2); // Verifica se os CPFs são diferentes
		});
	});

	describe("gerarCNPJ function", () => {
		it("deve gerar um CNPJ válido", () => {
			const cnpj = Utils.gerarCNPJ();
			expect(cnpj).toMatch(/^\d{14}$/); // Verifica se o CNPJ tem 14 dígitos
		});

		it("deve gerar CNPJs diferentes em chamadas consecutivas", () => {
			const cnpj1 = Utils.gerarCNPJ();
			const cnpj2 = Utils.gerarCNPJ();
			expect(cnpj1).not.toBe(cnpj2); // Verifica se os CNPJs são diferentes
		});
	});

	describe("sortByProps function", () => {
		const data = [
			{ name: "Bob", age: 25 },
			{ name: "Charlie", age: 35 },
			{ name: "Alice", age: 30 },
		];

		it("deve retornar ordem atual se nenhuma propriedade for fornecida", () => {
			const unsorted = [...data].sort(Utils.sortByProps("not-a-property"));
			expect(unsorted[0].name).toBe("Bob");
			expect(unsorted[1].name).toBe("Charlie");
			expect(unsorted[2].name).toBe("Alice");
		});

		it("deve ordenar por uma propriedade em ordem ascendente", () => {
			const sorted = [...data].sort(Utils.sortByProps("name"));
			expect(sorted[0].name).toBe("Alice");
			expect(sorted[1].name).toBe("Bob");
			expect(sorted[2].name).toBe("Charlie");
		});

		it("deve ordenar por uma propriedade em ordem descendente", () => {
			const sorted = [...data].sort(Utils.sortByProps("-age"));
			expect(sorted[0].age).toBe(35);
			expect(sorted[1].age).toBe(30);
			expect(sorted[2].age).toBe(25);
		});

		it("deve ordenar por múltiplas propriedades", () => {
			const data = [
				{ name: "Alice", age: 30 },
				{ name: "Bob", age: 25 },
				{ name: "Alice", age: 20 },
			];
			const sorted = data.sort(Utils.sortByProps(["name", "age"]));
			expect(sorted[0].name).toBe("Alice");
			expect(sorted[0].age).toBe(20);
			expect(sorted[1].name).toBe("Alice");
			expect(sorted[1].age).toBe(30);
			expect(sorted[2].name).toBe("Bob");
			expect(sorted[2].age).toBe(25);
		});
	});

	describe("orderBy function", () => {
		const data = [
			{ name: "Charlie", age: 35 },
			{ name: "Alice", age: 30 },
			{ name: "Bob", age: 45 },
		];

		it("deve ordenar por uma chave em ordem ascendente", () => {
			const sorted = Utils.orderBy(data, "name", "asc");
			expect(sorted[0].name).toBe("Alice");
			expect(sorted[1].name).toBe("Bob");
			expect(sorted[2].name).toBe("Charlie");
		});

		it("deve ordenar por uma chave em ordem descendente", () => {
			const sorted = Utils.orderBy(data, "age", "desc");
			expect(sorted[0].age).toBe(45);
			expect(sorted[1].age).toBe(35);
			expect(sorted[2].age).toBe(30);
		});
	});

	describe("getNestedValue function", () => {
		const data = {
			user: {
				name: {
					first: "John",
					last: "Doe",
				},
			},
		};

		it("should return nested value with valid path", () => {
			expect(Utils.getNestedValue(data, "user.name.first")).toBe("John");
		});

		it("should return undefined with invalid path", () => {
			expect(Utils.getNestedValue(data, "user.name.middle")).toBeUndefined();
		});

		it("should return undefined with non-existent key", () => {
			expect(Utils.getNestedValue(data, "user.address.street")).toBeUndefined();
		});

		it("should return undefined with empty string path", () => {
			expect(Utils.getNestedValue(data, "")).toBeUndefined();
		});
	});

	describe("setNestedValue function", () => {
		it("sets a nested value in an existing object", () => {
			const target = {
				user: {
					name: {
						first: "John",
						last: "Doe",
					},
				},
			};
			Utils.setNestedValue(target, "user.name.first", "Jane");
			Utils.setNestedValue(target, "children[0].name", "John");
			Utils.setNestedValue(target, "animals[0]", "dog");
			Utils.setNestedValue(target, "animals[1]", "cat");

			expect(target.user.name.first).toBe("Jane");
			expect(target).toEqual({
				user: { name: { first: "Jane", last: "Doe" } },
				children: [{ name: "John" }],
				animals: ["dog", "cat"],
			});
		});

		it("sets a nested value in a non-existent object", () => {
			const target = {};
			Utils.setNestedValue(target, "user.name.first", "Jane");
			expect(target).toEqual({ user: { name: { first: "Jane" } } });
		});

		it("sets a nested value with a path that has multiple levels", () => {
			const target = {};
			Utils.setNestedValue(target, "user.name.address.street", "123 Main St");
			expect(target).toEqual({ user: { name: { address: { street: "123 Main St" } } } });
		});

		it("sets a nested value with a path that has a single level", () => {
			const target = {};
			Utils.setNestedValue(target, "name", "John");
			expect(target).toEqual({ name: "John" });
		});

		it("throws an error with an empty path", () => {
			const target = {};
			expect(() => Utils.setNestedValue(target, "", "value")).toThrow("Path is required.");
		});
		it("throws an error with a null target object", () => {
			const target = null;
			expect(() => Utils.setNestedValue(target as never, "user.name.first", "Jane")).toThrow("Target object is required.");
		});
		it("throws an error with an undefined target object", () => {
			const target = undefined;
			expect(() => Utils.setNestedValue(target as never, "user.name.first", "Jane")).toThrow("Target object is required.");
		});
	});

	describe("ifNull function", () => {
		it("returns default value when input is null", () => {
			expect(Utils.ifNull(null, "default")).toBe("default");
			expect(Utils.ifNull(null, null)).toBeNull();
			expect(Utils.ifNull(null, undefined)).toBeUndefined();
		});

		it("returns default value when input is undefined", () => {
			expect(Utils.ifNull(undefined, "default")).toBe("default");
			expect(Utils.ifNull(undefined, null)).toBeNull();
		});

		it("returns original value when input is not null or undefined", () => {
			expect(Utils.ifNull("hello", "default")).toBe("hello");
		});

		it("works with different data types", () => {
			expect(Utils.ifNull(123, null)).toBe(123);
			expect(Utils.ifNull(true, false)).toBe(true);
		});
	});

	describe("ifNullOrEmpty function", () => {
		it("returns undefined for null and undefined values", () => {
			expect(Utils.ifNullOrEmpty(null, undefined)).toBeUndefined();
		});

		it("returns undefined for empty string", () => {
			expect(Utils.ifNullOrEmpty("")).toBeUndefined();
		});

		it("returns undefined for empty array", () => {
			expect(Utils.ifNullOrEmpty([])).toBeUndefined();
		});

		it("returns undefined for empty object", () => {
			expect(Utils.ifNullOrEmpty({})).toBeUndefined();
		});

		it("returns non-empty string", () => {
			expect(Utils.ifNullOrEmpty("hello")).toBe("hello");
		});

		it("returns non-empty array", () => {
			expect(Utils.ifNullOrEmpty([1, 2, 3])).toEqual([1, 2, 3]);
		});

		it("returns non-empty object", () => {
			expect(Utils.ifNullOrEmpty({ a: 1 })).toEqual({ a: 1 });
		});

		it("returns first valid value among multiple values", () => {
			expect(Utils.ifNullOrEmpty(null, undefined, "hello", "world")).toBe("hello");
		});

		it("returns undefined when no valid values are provided", () => {
			const emptyArray = [];
			const emptyObj = {};

			expect(Utils.ifNullOrEmpty(null, undefined, "", emptyArray, emptyObj)).toBeUndefined();
		});
	});

	describe("generateUUIDv4 Function", () => {
		it("should generate a valid GUID", () => {
			const guid = Utils.generateUUIDv4();
			expect(guid).toMatch(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);
		});

		it("should generate unique UUIDs", () => {
			const guid1 = Utils.generateUUIDv4();
			const guid2 = Utils.generateUUIDv4();

			expect(guid1).not.toBe(guid2);
		});

		it("should generate a string of correct length", () => {
			const guid = Utils.generateUUIDv4();

			expect(guid.length).toBe(36);
		});

		it("should generate unique UUIDs on multiple calls", () => {
			const uuids = new Set();
			const numberOfUUIDs = 100;

			for (let i = 0; i < numberOfUUIDs; i++) {
				const uuid = Utils.generateUUIDv4();
				uuids.add(uuid);
			}

			expect(uuids.size).toBe(numberOfUUIDs);
		});

		it("should generate a valid UUIDv4 using crypto.randomUUID when available", () => {
			const mockUUID = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
			vi.spyOn(crypto, "randomUUID").mockReturnValue(mockUUID);

			const result = Utils.generateUUIDv4();

			expect(result).toBe(mockUUID);
			expect(crypto.randomUUID).toHaveBeenCalledOnce();
		});

		it("should generate a valid UUIDv4 using fallback method when crypto.randomUUID is not available", () => {
			const originalCrypto = global.crypto;

			vi.stubGlobal("crypto.randomUUID", undefined);

			const result = Utils.generateUUIDv4();

			// Verifica formato UUIDv4
			expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
			expect(typeof result).toBe("string");
			expect(result.length).toBe(36);

			vi.stubGlobal("crypto", originalCrypto);
		});

		it("should have correct version and variant bits in fallback method", () => {
			const originalCrypto = global.crypto;

			vi.stubGlobal("crypto.randomUUID", undefined);

			const uuid = Utils.generateUUIDv4();
			const parts = uuid.split("-");

			// Verifica versão (4) no terceiro grupo
			expect(parts[2].charAt(0)).toBe("4");

			// Verifica variante (8,9,a,b) no quarto grupo
			expect(["8", "9", "a", "b"]).toContain(parts[3].charAt(0).toLowerCase());

			vi.stubGlobal("crypto", originalCrypto);
		});

		it("should throw an error when the Crypto API is not available", () => {
			const originalCrypto = global.crypto;
			vi.stubGlobal("crypto", undefined);

			expect(() => Utils.generateUUIDv4()).toThrow("Crypto API not available.");

			vi.stubGlobal("crypto", originalCrypto);
		});
	});

	describe("Crypto Helper function", () => {
		let key: CryptoKey;

		beforeAll(async () => {
			key = await Utils.crypto.generateKey();
		});

		test("should generate a valid key", async () => {
			expect(key).toBeDefined();
			expect(key.type).toBe("secret");
			expect(key.algorithm.name).toBe("AES-GCM");
		});

		test("should encrypt and decrypt text", async () => {
			const originalText = "secret message correct";
			const encryptedText = await Utils.crypto.encrypt(originalText, key);

			expect(encryptedText).toBeDefined();
			expect(typeof encryptedText).toBe("string");
			expect(encryptedText.length).toBeGreaterThan(0);

			const decryptedText = await Utils.crypto.decrypt(encryptedText, key);
			expect(decryptedText).toBe(originalText);
		});

		test("should fail to decrypt text with another key", async () => {
			const originalText = "secret message";
			const encryptedText = await Utils.crypto.encrypt(originalText, key);

			const anotherKey = await Utils.crypto.generateKey();

			await expect(Utils.crypto.decrypt(encryptedText, anotherKey)).rejects.toThrow();
		});

		test("should fail to decrypt invalid text", async () => {
			const invalidText = "invalid text";
			await expect(Utils.crypto.decrypt(invalidText, key)).rejects.toThrow();
		});
	});

	describe("months function", () => {
		it("should return month names in default locale", () => {
			const result = Utils.months();
			expect(result.length).toBe(12);
		});

		it("should return month names in specific locale (pt-BR)", () => {
			const result = Utils.months({ locale: "pt-BR" });
			expect(result.length).toBe(12);
			expect(result[0]).toBe("Janeiro");
			expect(result[11]).toBe("Dezembro");
		});

		it("should return month names in specific locale (en-US)", () => {
			const result = Utils.months({ locale: "en-US" });
			expect(result.length).toBe(12);
			expect(result[0]).toBe("January");
			expect(result[11]).toBe("December");
		});

		it("should return month names in specific locale (fr-FR)", () => {
			const result = Utils.months({ locale: "fr-FR" });
			expect(result.length).toBe(12);
			expect(result[0]).toBe("Janvier");
			expect(result[11]).toBe("Décembre");
		});

		it("should throw an error with invalid locale", () => {
			expect(() => Utils.months({ locale: " invalid-locale " })).toThrow();
		});

		it("should return month names in default locale", () => {
			const result = Utils.months({ month: "short" });
			expect(result.length).toBe(12);
		});

		it("should return month names in specific locale (pt-BR)", () => {
			const result = Utils.months({ month: "short", locale: "pt-BR" });
			expect(result.length).toBe(12);
			expect(result[0]).toBe("Jan.");
			expect(result[11]).toBe("Dez.");
		});

		it("should return month names in specific locale (en-US)", () => {
			const result = Utils.months({ month: "short", locale: "en-US" });
			expect(result.length).toBe(12);
			expect(result[0]).toBe("Jan");
			expect(result[11]).toBe("Dec");
		});

		it("should return month names in non-English locale (fr-FR)", () => {
			const result = Utils.months({ month: "short", locale: "fr-FR" });
			expect(result.length).toBe(12);
			expect(result[0]).toBe("Janv.");
			expect(result[11]).toBe("Déc.");
		});

		it("should throw an error with invalid locale", () => {
			expect(() => Utils.months({ locale: " invalid-locale " })).toThrow();
		});
	});

	describe("weekdays function", () => {
		it("should return weekday names in default locale", () => {
			const result = Utils.weekdays();
			expect(result).toHaveLength(7);
		});

		it("should return weekday names in specific locale (pt-BR)", () => {
			const result = Utils.weekdays({ locale: "pt-BR" });
			expect(result).toHaveLength(7);
			expect(result).toEqual(expect.arrayContaining(["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]));
		});

		it("should return weekday names in specific locale (en-US)", () => {
			const result = Utils.weekdays({ locale: "en-US" });
			expect(result).toHaveLength(7);
			expect(result).toEqual(expect.arrayContaining(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]));
		});

		it("should return weekday names in specific locale (fr-FR)", () => {
			const result = Utils.weekdays({ locale: "fr-FR" });
			expect(result).toHaveLength(7);
			expect(result).toEqual(expect.arrayContaining(["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]));
		});

		it("should throw an error with invalid locale", () => {
			expect(() => Utils.weekdays({ locale: " invalid-locale" })).toThrow();
		});

		it("returns expected weekday names for default locale", () => {
			const result = Utils.weekdays({ weekday: "short" });
			expect(result).toHaveLength(7);
		});

		it("returns expected weekday short names in specific locale (pt-BR)", () => {
			const result = Utils.weekdays({ weekday: "short", locale: "pt-BR" });
			expect(result).toEqual(["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."]);
		});

		it("returns expected weekday short names in specific locale (en-US)", () => {
			const result = Utils.weekdays({ weekday: "short", locale: "en-US" });
			expect(result).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
		});

		it("returns expected weekday short names in specific locale (fr-FR)", () => {
			const result = Utils.weekdays({ weekday: "short", locale: "fr-FR" });
			expect(result).toEqual(["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."]);
		});

		it("returns expected weekday narrow names in specific locale (pt-BR)", () => {
			const result = Utils.weekdays({ weekday: "narrow", locale: "pt-BR" });
			expect(result).toEqual(["D", "S", "T", "Q", "Q", "S", "S"]);
		});
	});

	describe("sleep function", () => {
		it("resolves after the specified duration", async () => {
			const startTime = Date.now();
			await Utils.sleep(1000);
			const endTime = Date.now();
			expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
		});

		it("rejects if the input is not a positive number", async () => {
			await expect(Utils.sleep(-1)).rejects.toThrow();
			await expect(Utils.sleep(Number.NaN)).rejects.toThrowError();
		});

		it("resolves immediately if the input is 0", async () => {
			const startTime = Date.now();
			await Utils.sleep(0);
			const endTime = Date.now();
			expect(endTime - startTime).toBeLessThan(30);
		});
	});

	describe("retry function", () => {
		it("should succeed on first attempt", async () => {
			const fn = async () => "success";
			const result = await Utils.retry(fn);
			expect(result).toBe("success");
		});

		it("should succeed after retrying", async () => {
			let attempt = 0;
			const fn = async () => {
				attempt++;
				if (attempt < 2) {
					throw new Error("Mock error");
				}
				return "success";
			};
			const result = await Utils.retry(fn, { retries: 2 });
			expect(result).toBe("success");
			expect(attempt).toBe(2);
		});

		it("should fail after all retries exhausted", async () => {
			const fn = async () => {
				throw new Error("Mock error");
			};
			await expect(Utils.retry(fn, { retries: 3 })).rejects.toThrowError("Mock error");
		});

		it("should use custom retry options", async () => {
			let attempt = 0;
			const fn = async () => {
				attempt++;
				if (attempt < 3) {
					throw new Error("Mock error");
				}
				return "success";
			};
			const result = await Utils.retry(fn, { retries: 3, delay: 50 });
			expect(result).toBe("success");
			expect(attempt).toBe(3);
		});

		it("should call onRetry callback on failure", async () => {
			const onRetry = vi.fn();
			const fn = async () => {
				throw new Error("Mock error");
			};

			try {
				await Utils.retry(fn, { retries: 3, onRetry });
			} catch {
				/* empty */
			}

			expect(onRetry).toHaveBeenCalledTimes(2);
		});

		it("should throw error if retries is 0", async () => {
			const fn = async () => 1 / 0;
			await expect(Utils.retry(fn, { retries: 0 })).rejects.toThrowError("Retry attempts exhausted");
		});

		it("should throw error if delay is 0", async () => {
			const fn = async () => "success";
			await expect(Utils.retry(fn, { delay: 0 })).rejects.toThrowError("The 'delay' parameter must be greater than 0.");
		});
	});

	describe("memoize function", () => {
		it("memoizes a simple function", () => {
			const add = (a: number, b: number) => a + b;
			const memoizedAdd = Utils.memoize(add);

			expect(memoizedAdd(1, 2)).toBe(3);
			expect(memoizedAdd(1, 2)).toBe(3); // returns cached result
		});

		it("memoizes a function with multiple arguments", () => {
			const multiply = (a: number, b: number, c: number) => a * b * c;
			const memoizedMultiply = Utils.memoize(multiply);

			expect(memoizedMultiply(1, 2, 3)).toBe(6);
			expect(memoizedMultiply(1, 2, 3)).toBe(6); // returns cached result
		});

		it("returns cached result for same inputs", () => {
			const add = (a: number, b: number) => a + b;
			const memoizedAdd = Utils.memoize(add);

			expect(memoizedAdd(1, 2)).toBe(3);
			expect(memoizedAdd(1, 2)).toBe(3); // returns cached result
			expect(memoizedAdd(2, 3)).toBe(5); // calls original function
			expect(memoizedAdd(2, 3)).toBe(5); // returns cached result
		});

		it("calls original function if result is not cached", () => {
			const add = (a: number, b: number) => a + b;
			const memoizedAdd = Utils.memoize(add);

			expect(memoizedAdd(1, 2)).toBe(3); // calls original function
			expect(memoizedAdd(1, 2)).toBe(3); // returns cached result
		});

		it("clears the cache", () => {
			const add = (a: number, b: number) => a + b;
			const memoizedAdd = Utils.memoize(add);

			expect(memoizedAdd(1, 2)).toBe(3); // calls original function
			memoizedAdd.clear();
			expect(memoizedAdd(1, 2)).toBe(3); // calls original function again
		});

		it("handles non-primitive argument types", () => {
			const obj1 = { a: 1 };
			const obj2 = { b: 2 };
			const addObjects = (obj1: object, obj2: object) => ({ ...obj1, ...obj2 });
			const memoizedAddObjects = Utils.memoize(addObjects);

			expect(memoizedAddObjects(obj1, obj2)).toEqual({ a: 1, b: 2 });
			expect(memoizedAddObjects(obj1, obj2)).toEqual({ a: 1, b: 2 }); // returns cached result
		});
	});

	describe("debounce function", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.clearAllTimers();
			vi.restoreAllMocks();
		});

		it("debounces a function with a delay", () => {
			const fn = vi.fn();
			const debouncedFn = Utils.debounce(fn, 100);
			debouncedFn();
			expect(fn).not.toHaveBeenCalled();
			vi.advanceTimersByTime(150);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("debounces a function with multiple calls outside the delay period", () => {
			const fn = vi.fn();
			const debouncedFn = Utils.debounce(fn, 100);
			debouncedFn();
			vi.advanceTimersByTime(150);
			debouncedFn();
			vi.advanceTimersByTime(150);
			expect(fn).toHaveBeenCalledTimes(2);
		});

		it("should call the function after the wait time", () => {
			const fn = vi.fn();
			const debounced = Utils.debounce(fn, 1000);

			debounced();
			expect(fn).not.toHaveBeenCalled();

			vi.advanceTimersByTime(1000);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("should not call the function if called again before wait time", () => {
			const fn = vi.fn();
			const debounced = Utils.debounce(fn, 1000);

			debounced();
			vi.advanceTimersByTime(500); // ainda não deve chamar
			debounced(); // reinicia o timer

			vi.advanceTimersByTime(500); // tempo total 1000ms, mas resetou
			expect(fn).not.toHaveBeenCalled();

			vi.advanceTimersByTime(500); // agora sim
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("should only call once after multiple rapid calls", () => {
			const fn = vi.fn();
			const debounced = Utils.debounce(fn, 1000);

			for (let i = 0; i < 10; i++) {
				debounced();
				vi.advanceTimersByTime(100); // chamado a cada 100ms
			}

			expect(fn).not.toHaveBeenCalled();
			vi.advanceTimersByTime(1000);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("should preserve context (this)", () => {
			const context = {
				value: 42,
				method(this: any) {
					return this.value;
				},
			};

			const spy = vi.fn(context.method);
			const debounced = Utils.debounce(spy, 1000);

			debounced.call(context);
			vi.advanceTimersByTime(1000);

			expect(spy).toHaveBeenCalled();
			expect(spy.mock.results[0].value).toBe(42);
		});

		it("should pass arguments to the original function", () => {
			const fn = vi.fn((a, b) => a + b);
			const debounced = Utils.debounce(fn, 1000);

			debounced(3, 4);
			vi.advanceTimersByTime(1000);

			expect(fn).toHaveBeenCalledWith(3, 4);
			expect(fn.mock.results[0].value).toBe(7);
		});

		it("should clear previous timeout on each call", () => {
			const fn = vi.fn();
			const debounced = Utils.debounce(fn, 1000);

			debounced();
			debounced();
			debounced();

			expect(vi.getTimerCount()).toBe(1); // apenas 1 timeout ativo

			vi.advanceTimersByTime(1000);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("should not throw if called with no arguments", () => {
			const fn = vi.fn();
			const debounced = Utils.debounce(fn, 1000);

			expect(() => debounced()).not.toThrow();
			vi.advanceTimersByTime(1000);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("should not execute if never waited enough", () => {
			const fn = vi.fn();
			const debounced = Utils.debounce(fn, 1000);

			debounced();
			vi.advanceTimersByTime(500);
			debounced();
			vi.advanceTimersByTime(500);
			debounced();
			vi.advanceTimersByTime(500);

			expect(fn).not.toHaveBeenCalled();
		});
	});

	describe("throttle function", () => {
		// 	beforeEach(() => {
		// 		vi.useFakeTimers();
		// 	});
		// 	afterEach(() => {
		// 		vi.useRealTimers();
		// 		vi.clearAllTimers();
		// 		vi.restoreAllMocks();
		// 	});

		it("should call the function immediately with a wait time of 0", () => {
			const fn = vi.fn();
			const throttledFn = Utils.throttle(fn, 0);
			throttledFn();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("should call the function after the wait time", () => {
			const fn = vi.fn();
			const throttledFn = Utils.throttle(fn, 100);
			throttledFn(); // chamada imediata
			throttledFn(); // agendada
			vi.advanceTimersByTime(150);
			expect(fn).toHaveBeenCalledTimes(2); // chamada agendada
		});

		it("should call the function multiple times outside the wait time", () => {
			const fn = vi.fn();
			const throttledFn = Utils.throttle(fn, 100);
			throttledFn();
			vi.advanceTimersByTime(150);
			throttledFn();
			vi.advanceTimersByTime(150);
			throttledFn();
			expect(fn).toHaveBeenCalledTimes(3);
		});

		it("should call the function immediately on the first call", () => {
			const fn = vi.fn();
			const throttled = Utils.throttle(fn, 1000);
			throttled();
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("should not call the function again within the wait time", () => {
			const fn = vi.fn();
			const throttled = Utils.throttle(fn, 1000);
			throttled(); // imediato
			throttled(); // ignorado
			vi.advanceTimersByTime(500);
			throttled(); // ainda ignorado
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("should call the function again after the wait time", () => {
			const fn = vi.fn();
			const throttled = Utils.throttle(fn, 1000);
			throttled(); // imediato
			vi.advanceTimersByTime(1000);
			throttled(); // novo chamado
			expect(fn).toHaveBeenCalledTimes(2);
		});

		it("should schedule a trailing call if called within wait time", () => {
			const fn = vi.fn();
			const throttled = Utils.throttle(fn, 1000);
			throttled(); // chamado imediatamente
			vi.advanceTimersByTime(500);
			throttled(); // agendado
			expect(fn).toHaveBeenCalledTimes(1);
			vi.advanceTimersByTime(500); // agora executa o agendado
			expect(fn).toHaveBeenCalledTimes(2);
		});

		it("should return the last result immediately if within wait time", () => {
			const fn = vi.fn(() => "first");
			const throttled = Utils.throttle(fn, 1000);
			const result1 = throttled();
			expect(result1).toBe("first");
			fn.mockReturnValue("second");
			const result2 = throttled(); // não chama `fn` de novo
			expect(result2).toBe("first"); // retorna o mesmo valor anterior
			vi.advanceTimersByTime(1000); // executa o agendado
		});

		it("should throw error from first immediate call", () => {
			const fn = vi.fn(() => {
				throw new Error("Oops");
			});
			const throttled = Utils.throttle(fn, 1000);
			expect(() => throttled()).toThrowError("Oops");
		});

		it("should return the last result during throttle and call fn again after wait time", () => {
			const fn = vi.fn(() => Math.random());
			const throttled = Utils.throttle(fn, 1000);

			const result = throttled();
			expect(throttled()).equals(result);

			vi.advanceTimersByTime(1000);
			expect(throttled()).not.equals(result);

			expect(fn).toHaveBeenCalledTimes(2);
		});
	});

	describe("once function", () => {
		it("calls the function only once with the correct arguments", () => {
			const fn = vi.fn((a: number, b: number) => a + b);
			const onceFn = Utils.once(fn);
			onceFn(1, 2);
			onceFn(3, 4);
			expect(fn).toHaveBeenCalledTimes(1);
			expect(fn).toHaveBeenCalledWith(1, 2);
		});

		it("returns the result of the first call", () => {
			const fn = (a: number, b: number) => a + b;
			const onceFn = Utils.once(fn);
			const result1 = onceFn(1, 2);
			const result2 = onceFn(3, 4);
			expect(result1).toBe(3);
			expect(result2).toBe(3);
		});

		it("does not call the function again with different arguments", () => {
			const fn = vi.fn((a: number, b: number) => a + b);
			const onceFn = Utils.once(fn);
			onceFn(1, 2);
			onceFn(3, 4);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it("returns the correct result when called once", () => {
			const fn = (a: number, b: number) => a + b;
			const onceFn = Utils.once(fn);
			const result = onceFn(1, 2);
			expect(result).toBe(3);
		});

		it("works with functions that return different types", () => {
			const fn1 = (a: number, b: number) => a + b;
			const onceFn1 = Utils.once(fn1);
			const result1 = onceFn1(1, 2);
			expect(result1).toBe(3);

			const fn2 = (a: string, b: string) => a + b;
			const onceFn2 = Utils.once(fn2);
			const result2 = onceFn2("a", "b");
			expect(result2).toBe("ab");

			const fn3 = (a: { foo: string }, b: { bar: string }) => ({ ...a, ...b });
			const onceFn3 = Utils.once(fn3);
			const result3 = onceFn3({ foo: "foo" }, { bar: "bar" });
			expect(result3).toEqual({ foo: "foo", bar: "bar" });
		});
	});

	describe("pipe function", () => {
		it("should compose multiple functions", () => {
			const addOne = (x: number) => x + 1;
			const subTwo = (x: number) => x - 2;
			const valueIs = (x: string) => `Value is: ${x}`;

			const process = Utils.pipe(addOne, subTwo, valueIs);

			expect(process(3)).toBe("Value is: 2"); // 3 -> addOne -> 4 -> subTwo -> 2
		});

		it("should compose single function", () => {
			const addOne = (x: number) => x + 1;
			const process = Utils.pipe(addOne);

			expect(process(3)).toBe(4); // 3 -> addOne -> 4
		});

		it("should compose functions that return different types", () => {
			const addOne = (x: number) => x + 1;
			const numToString = (x: number) => String(x);

			const process = Utils.pipe(addOne, numToString);

			expect(process(3)).toBe("4"); // 3 -> addOne -> 4 -> numToString -> "4"
		});

		it("should throw error when functions are incompatible at runtime", () => {
			const addOne = (x: number) => x + 1;
			const breakIt = (x: string) => x.toUpperCase(); // espera string, mas vai receber number

			const process = Utils.pipe(addOne, breakIt); // breakIt recebe number, erro esperado

			expect(() => process(3)).toThrowError();
		});

		it("should propagate errors from any function", () => {
			const addOne = (x: number) => x + 1;
			const throwError = (x: number) => {
				throw new Error(`Test error: ${x}`);
			};
			const process = Utils.pipe(addOne, throwError);
			expect(() => process(3)).toThrow("Test error: 4");
		});

		it("should return identity function when no functions are provided", () => {
			expect(() => Utils.pipe()).toThrow("No functions provided to pipe");
		});
	});

	describe("compose function", () => {
		it("should compose multiple functions", () => {
			const addOne = (x: number) => x + 1;
			const subTwo = (x: number) => x - 2;
			const valueIs = (x: string) => `Value is: ${x}`;

			const process = Utils.compose(valueIs, addOne, subTwo);

			expect(process(3)).toBe("Value is: 2"); // 3 -> subTwo -> 1 -> addOne -> 2
		});

		it("should compose single function", () => {
			const addOne = (x: number) => x + 1;

			const process = Utils.compose(addOne);

			expect(process(3 as unknown)).toBe(4); // 3 -> addOne -> 4
		});

		it("should compose functions that return different types", () => {
			const addOne = (x: number) => x + 1;
			const numToString = (x: number) => String(x);

			const process = Utils.compose(addOne, numToString);

			expect(process(3)).toBe("31"); // 3 -> numToString -> "3" -> addOne -> "3" + 1 = "31"
		});

		it("should throw error when functions are incompatible at runtime", () => {
			const addOne = (x: number) => x + 1;
			const breakIt = (x: string) => x.toUpperCase(); // espera string, mas vai receber number

			const process = Utils.compose(addOne, breakIt); // breakIt recebe number, erro esperado

			expect(() => process(3)).toThrowError();
		});

		it("should propagate errors from any function", () => {
			const addOne = (x: number) => x + 1;
			const throwError = (x: number) => {
				throw new Error(`Test error: ${x}`);
			};
			const process = Utils.compose(addOne, throwError);
			expect(() => process(3)).toThrow("Test error: 3");
		});

		it("should return identity function when no functions are provided", () => {
			expect(() => Utils.compose()).toThrow("No functions provided to compose");
		});
	});

	describe("randomBetween function", () => {
		it("returns a random integer between min and max", () => {
			const min = 1;
			const max = 10;
			const result = Utils.randomBetween(min, max);
			expect(result).toBeGreaterThanOrEqual(min);
			expect(result).toBeLessThanOrEqual(max);
		});

		it("throws an error when min is greater than or equal to max", () => {
			const min = 10;
			const max = 1;
			expect(() => Utils.randomBetween(min, max)).toThrowError("The 'min' parameter must be less than 'max'.");
		});

		it("returns a random integer that is inclusive of min and max", () => {
			const min = 1;
			const max = 10;
			const results: number[] = [];

			for (let i = 0; i < 100; i++) {
				results.push(Utils.randomBetween(min, max));
			}

			expect(results).toContain(min);
			expect(results).toContain(max);
		});

		it("returns a different random integer on each call", () => {
			const min = 1000;
			const max = 3000;

			const result1 = Utils.randomBetween(min, max);
			const result2 = Utils.randomBetween(min, max);

			expect(result1).not.toBe(result2);
			expect(result1).toBeGreaterThanOrEqual(min);
			expect(result1).toBeLessThanOrEqual(max);
			expect(result2).toBeGreaterThanOrEqual(min);
			expect(result2).toBeLessThanOrEqual(max);
		});
	});
});
