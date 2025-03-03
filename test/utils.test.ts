import { Utils } from '../src';

describe('Utils', () => {
	describe('gerarCPF', () => {
		it('deve gerar um CPF válido', () => {
			const cpf = Utils.gerarCPF();
			expect(cpf).toMatch(/^\d{11}$/); // Verifica se o CPF tem 11 dígitos
		});

		it('deve gerar CPFs diferentes em chamadas consecutivas', () => {
			const cpf1 = Utils.gerarCPF();
			const cpf2 = Utils.gerarCPF();
			expect(cpf1).not.toBe(cpf2); // Verifica se os CPFs são diferentes
		});
	});

	describe('gerarCNPJ', () => {
		it('deve gerar um CNPJ válido', () => {
			const cnpj = Utils.gerarCNPJ();
			expect(cnpj).toMatch(/^\d{14}$/); // Verifica se o CNPJ tem 14 dígitos
		});

		it('deve gerar CNPJs diferentes em chamadas consecutivas', () => {
			const cnpj1 = Utils.gerarCNPJ();
			const cnpj2 = Utils.gerarCNPJ();
			expect(cnpj1).not.toBe(cnpj2); // Verifica se os CNPJs são diferentes
		});
	});

	describe('sortByProps', () => {
		const data = [
			{ name: 'Bob', age: 25 },
			{ name: 'Charlie', age: 35 },
			{ name: 'Alice', age: 30 }
		];

		it('deve retornar ordem atual se nenhuma propriedade for fornecida', () => {
			const unsorted = [...data].sort(Utils.sortByProps('not-a-property'));
			expect(unsorted[0].name).toBe('Bob');
			expect(unsorted[1].name).toBe('Charlie');
			expect(unsorted[2].name).toBe('Alice');
		});

		it('deve ordenar por uma propriedade em ordem ascendente', () => {
			const sorted = [...data].sort(Utils.sortByProps('name'));
			expect(sorted[0].name).toBe('Alice');
			expect(sorted[1].name).toBe('Bob');
			expect(sorted[2].name).toBe('Charlie');
		});

		it('deve ordenar por uma propriedade em ordem descendente', () => {
			const sorted = [...data].sort(Utils.sortByProps('-age'));
			expect(sorted[0].age).toBe(35);
			expect(sorted[1].age).toBe(30);
			expect(sorted[2].age).toBe(25);
		});

		it('deve ordenar por múltiplas propriedades', () => {
			const data = [
				{ name: 'Alice', age: 30 },
				{ name: 'Bob', age: 25 },
				{ name: 'Alice', age: 20 }
			];
			const sorted = [...data].sort(Utils.sortByProps(['name', 'age']));
			expect(sorted[0].name).toBe('Alice');
			expect(sorted[0].age).toBe(20);
			expect(sorted[1].name).toBe('Alice');
			expect(sorted[1].age).toBe(30);
			expect(sorted[2].name).toBe('Bob');
			expect(sorted[2].age).toBe(25);
		});
	});

	describe('orderBy', () => {
		const data = [
			{ name: 'Charlie', age: 35 },
			{ name: 'Alice', age: 30 },
			{ name: 'Bob', age: 45 }
		];

		it('deve ordenar por uma chave em ordem ascendente', () => {
			const sorted = Utils.orderBy(data, 'name', 'asc');
			expect(sorted[0].name).toBe('Alice');
			expect(sorted[1].name).toBe('Bob');
			expect(sorted[2].name).toBe('Charlie');
		});

		it('deve ordenar por uma chave em ordem descendente', () => {
			const sorted = Utils.orderBy(data, 'age', 'desc');
			expect(sorted[0].age).toBe(45);
			expect(sorted[1].age).toBe(35);
			expect(sorted[2].age).toBe(30);
		});
	});

	describe('getNestedValue', () => {
		const data = {
			user: {
				name: {
					first: 'John',
					last: 'Doe'
				}
			}
		};

		it('should return nested value with valid path', () => {
			expect(Utils.getNestedValue(data, 'user.name.first')).toBe('John');
		});

		it('should return undefined with invalid path', () => {
			expect(Utils.getNestedValue(data, 'user.name.middle')).toBeUndefined();
		});

		it('should return undefined with non-existent key', () => {
			expect(Utils.getNestedValue(data, 'user.address.street')).toBeUndefined();
		});

		it('should return undefined with empty string path', () => {
			expect(Utils.getNestedValue(data, '')).toBeUndefined();
		});

		it('should return undefined with null object', () => {
			expect(Utils.getNestedValue(null, 'user.name.first')).toBeUndefined();
		});

		it('should return undefined with undefined object', () => {
			expect(Utils.getNestedValue(undefined, 'user.name.first')).toBeUndefined();
		});
	});

	describe('setNestedValue', () => {
		it('sets a nested value in an existing object', () => {
			const target = {
				user: {
					name: {
						first: 'John',
						last: 'Doe'
					}
				}
			};
			Utils.setNestedValue(target, 'user.name.first', 'Jane');
			Utils.setNestedValue(target, 'children[0].name', 'John');
			Utils.setNestedValue(target, 'animals[0]', 'dog');
			Utils.setNestedValue(target, 'animals[1]', 'cat');

			expect(target.user.name.first).toBe('Jane');
			expect(target).toEqual({
				user: { name: { first: 'Jane', last: 'Doe' } },
				children: [{ name: 'John' }],
				animals: ['dog', 'cat']
			});
		});

		it('sets a nested value in a non-existent object', () => {
			const target = {};
			Utils.setNestedValue(target, 'user.name.first', 'Jane');
			expect(target).toEqual({ user: { name: { first: 'Jane' } } });
		});

		it('sets a nested value with a path that has multiple levels', () => {
			const target = {};
			Utils.setNestedValue(target, 'user.name.address.street', '123 Main St');
			expect(target).toEqual({ user: { name: { address: { street: '123 Main St' } } } });
		});

		it('sets a nested value with a path that has a single level', () => {
			const target = {};
			Utils.setNestedValue(target, 'name', 'John');
			expect(target).toEqual({ name: 'John' });
		});

		it('throws an error with an empty path', () => {
			const target = {};
			expect(() => Utils.setNestedValue(target, '', 'value')).toThrowError('Path is required.');
		});
		it('throws an error with a null target object', () => {
			let target = null;
			expect(() => Utils.setNestedValue(target!, 'user.name.first', 'Jane')).toThrowError('Target object is required.');
		});
		it('throws an error with an undefined target object', () => {
			const target = undefined;
			expect(() => Utils.setNestedValue(target!, 'user.name.first', 'Jane')).toThrowError('Target object is required.');
		});
	});

	describe('ifNull function', () => {
		it('returns default value when input is null', () => {
			const result = Utils.ifNull(null, 'default');
			expect(result).toBe('default');
		});

		it('returns default value when input is undefined', () => {
			const result = Utils.ifNull(undefined, 'default');
			expect(result).toBe('default');
		});

		it('returns original value when input is not null or undefined', () => {
			const result = Utils.ifNull('hello', 'default');
			expect(result).toBe('hello');
		});

		it('works with different data types', () => {
			const result1 = Utils.ifNull(123, 456);
			expect(result1).toBe(123);

			const result2 = Utils.ifNull(true, false);
			expect(result2).toBe(true);

			const result3 = Utils.ifNull('hello', 'world');
			expect(result3).toBe('hello');
		});
	});

	describe('ifNullOrEmpty', () => {
		it('returns default value when input is null', () => {
			const result = Utils.ifNullOrEmpty(null, 'default');
			expect(result).toBe('default');
		});

		it('returns default value when input is undefined', () => {
			const result = Utils.ifNullOrEmpty(undefined, 'default');
			expect(result).toBe('default');
		});

		it('returns undefined when default value is undefined', () => {
			const result = Utils.ifNullOrEmpty(null, undefined);
			expect(result).toBeUndefined();
		});

		it('returns default value when input is an empty string', () => {
			const result = Utils.ifNullOrEmpty('', 'default');
			expect(result).toBe('default');
		});

		it('returns original value when input is a non-empty string', () => {
			const result = Utils.ifNullOrEmpty('hello', 'default');
			expect(result).toBe('hello');
		});

		it('returns original value when input is a non-string value', () => {
			const result = Utils.ifNullOrEmpty(123, 0);
			expect(result).toBe(123);
		});
	});

	describe('generateGuid Function', () => {
		test('should generate a valid GUID', () => {
			const guid = Utils.generateGuid();
			const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

			expect(guid).toMatch(guidRegex);
		});

		test('should generate unique GUIDs', () => {
			const guid1 = Utils.generateGuid();
			const guid2 = Utils.generateGuid();

			expect(guid1).not.toBe(guid2);
		});

		test('should generate a string of correct length', () => {
			const guid = Utils.generateGuid();

			expect(guid.length).toBe(36);
		});
	});

	describe('Crypto Helper', () => {
		let key: CryptoKey;

		beforeAll(async () => {
			key = await Utils.generateKey();
		});

		test('should generate a valid key', async () => {
			expect(key).toBeDefined();
			expect(key.type).toBe('secret');
			expect(key.algorithm.name).toBe('AES-GCM');
		});

		test('should encrypt and decrypt text', async () => {
			const originalText = 'secret message correct';
			const encryptedText = await Utils.encrypt(originalText, key);

			expect(encryptedText).toBeDefined();
			expect(typeof encryptedText).toBe('string');
			expect(encryptedText.length).toBeGreaterThan(0);

			const decryptedText = await Utils.decrypt(encryptedText, key);
			expect(decryptedText).toBe(originalText);
		});

		test('should fail to decrypt text with another key', async () => {
			const originalText = 'secret message';
			const encryptedText = await Utils.encrypt(originalText, key);

			const anotherKey = await Utils.generateKey();

			await expect(Utils.decrypt(encryptedText, anotherKey)).rejects.toThrow();
		});

		test('should fail to decrypt invalid text', async () => {
			const invalidText = 'invalid text';
			await expect(Utils.decrypt(invalidText, key)).rejects.toThrow();
		});
	});
});
