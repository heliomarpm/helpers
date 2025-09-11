import { beforeEach, describe, expect, it } from "vitest";
import { Cryptor } from "../src";

describe("Cryptor()", () => {
	it("should create real example practice", async () => {
		const password = "minhaSenhaForte123!";
		const hashedPassword = await Cryptor.hash(password);
		expect(hashedPassword).not.toBe(password);
		expect(hashedPassword.length).toBe(64);

		// Comparação de senha (login)
		const loginPassword = "minhaSenhaForte123!";
		const match = await Cryptor.compareHash(loginPassword, hashedPassword);
		expect(match).toBe(true);

		// Geração de par de chaves (para assinatura digital)
		const keyPair = await Cryptor.generateKeyPair();
		expect(keyPair).toHaveProperty("publicKey");
		expect(keyPair).toHaveProperty("privateKey");

		// Assinar um payload (ex: dados de um documento ou token)
		const payload = JSON.stringify({
			id: 123,
			nome: "Heliomar",
			timestamp: Date.now(),
		});

		const signature = await Cryptor.sign(payload, keyPair.privateKey);
		expect(signature.length).toBe(512);
		console.log("Signature:", Buffer.from(signature).toString("base64"));

		// Verificar a assinatura
		const isValid = await Cryptor.verify(payload, signature, keyPair.publicKey);
		expect(isValid).toBe(true);
	});

	describe("Cryptor.hash()", () => {
		it("should hash a simple string", async () => {
			const text = "hello";
			const hashedText = await Cryptor.hash(text);
			expect(hashedText).toBe("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
		});

		it("should hash a string with special characters", async () => {
			const text = "hello!@#$%^&*()";
			const hashedText = await Cryptor.hash(text);
			expect(hashedText).toBe("843bfe5bb70aef0dc3c5c06f5073776fa55f1b00b4352d6f33f6ec1621e83c13");
		});

		it("should hash a string with non-ASCII characters", async () => {
			const text = "hëllo";
			const hashedText = await Cryptor.hash(text);
			expect(hashedText).toBe("b0f13c28aa973b9a148b9b79b3a5a5d4c56b963f6cf00f90fd5e98c5d3e7b26a");
		});

		it("should hash an empty string", async () => {
			await expect(() => Cryptor.hash("")).rejects.toThrow();
		});

		it("should throw an error for null or undefined input", async () => {
			await expect(Cryptor.hash(null as unknown as string)).rejects.toThrow();
			await expect(Cryptor.hash(undefined as unknown as string)).rejects.toThrow();
		});
	});

	describe("Cryptor.compareHash", () => {
		it("should return true for matching hash", async () => {
			const text = "myPassword";
			const hash = await Cryptor.hash(text);
			const result = await Cryptor.compareHash(text, hash);
			expect(result).toBe(true);
		});

		it("should return false for non-matching hash", async () => {
			const text = "myPassword";
			const hash = await Cryptor.hash("differentPassword");
			const result = await Cryptor.compareHash(text, hash);
			expect(result).toBe(false);
		});

		it("should return false for empty text", async () => {
			const text = "password";
			const hash = await Cryptor.hash("myPassword");
			const result = await Cryptor.compareHash(text, hash);
			expect(result).toBe(false);
		});

		it("should return false for empty hash", async () => {
			const text = "myPassword";
			const hash = "password";
			const result = await Cryptor.compareHash(text, hash);
			expect(result).toBe(false);
		});

		it("should throw error for null text", async () => {
			const text = null as unknown as string;
			const hash = await Cryptor.hash("myPassword");
			await expect(Cryptor.compareHash(text, hash)).rejects.toThrow();
		});

		it("should throw error for null hash", async () => {
			const text = "myPassword";
			const hash = null as unknown as string;
			await expect(Cryptor.compareHash(text, hash)).rejects.toThrow();
		});
	});

	describe("Cryptor.generateSalt", () => {
		it("should generate a salt with default length (16 bytes)", async () => {
			const salt = await Cryptor.generateSalt();
			expect(salt.length).toBe(32); // 16 bytes * 2 (hex encoding)
			expect(typeof salt).toBe("string");
		});

		it("should generate a salt with custom length", async () => {
			const length = 32;
			const salt = await Cryptor.generateSalt(length);
			expect(salt.length).toBe(length * 2); // length bytes * 2 (hex encoding)
			expect(typeof salt).toBe("string");
		});

		it("should throw an error for invalid salt length (non-numeric)", async () => {
			await expect(Cryptor.generateSalt("abc" as any)).rejects.toThrow();
		});

		it("should throw an error for invalid salt length (negative)", async () => {
			await expect(Cryptor.generateSalt(-1)).rejects.toThrow();
		});

		it("should throw an error for invalid salt length (zero)", async () => {
			await expect(Cryptor.generateSalt(0)).rejects.toThrow();
		});

		it("should generate different salts for multiple calls with same length", async () => {
			const length = 16;
			const salt1 = await Cryptor.generateSalt(length);
			const salt2 = await Cryptor.generateSalt(length);
			expect(salt1).not.toBe(salt2);
		});
	});

	describe("Cryptor.generateKeyPair", () => {
		beforeEach(async () => {
			// Make sure the crypto module is available
			await import("crypto");
		});

		it("generates a key pair with the correct properties", async () => {
			const keyPair = await Cryptor.generateKeyPair();
			expect(keyPair).toHaveProperty("publicKey");
			expect(keyPair).toHaveProperty("privateKey");
		});

		it("generates publicKey and privateKey in PEM format", async () => {
			const keyPair = await Cryptor.generateKeyPair();
			expect(keyPair.publicKey).toMatch(/^-----BEGIN PUBLIC KEY-----/);
			expect(keyPair.publicKey).toMatch(/-----END PUBLIC KEY-----\s*$/);
			expect(keyPair.privateKey).toMatch(/^-----BEGIN PRIVATE KEY-----/);
			expect(keyPair.privateKey).toMatch(/-----END PRIVATE KEY-----\s*$/);
		});
	});

	describe("Cryptor.sign()", () => {
		let privateKey: string;

		beforeEach(async () => {
			const keyPair = await Cryptor.generateKeyPair();
			privateKey = keyPair.privateKey;
		});

		it("should generate a signature with valid data and private key", async () => {
			const data = "Hello, world!";
			const signature = await Cryptor.sign(data, privateKey);
			expect(signature).toBeTypeOf("string");
			expect(signature.length).toBeGreaterThan(0);
		});

		it("should throw an error with invalid data (null)", async () => {
			const data = null as unknown as string;
			await expect(Cryptor.sign(data, privateKey)).rejects.toThrow();
		});

		it("should throw an error with invalid data (undefined)", async () => {
			const data = undefined as unknown as string;
			await expect(Cryptor.sign(data, privateKey)).rejects.toThrow();
		});

		it("should throw an error with invalid data (empty string)", async () => {
			await expect(Cryptor.sign("", privateKey)).rejects.toThrow();
		});

		it("should throw an error with invalid private key (null)", async () => {
			const privateKey = null as unknown as string;
			await expect(Cryptor.sign("Hello, world!", privateKey)).rejects.toThrow();
		});

		it("should throw an error with invalid private key (undefined)", async () => {
			const privateKey = undefined as unknown as string;
			await expect(Cryptor.sign("Hello, world!", privateKey)).rejects.toThrow();
		});

		it("should throw an error with invalid private key (empty string)", async () => {
			await expect(Cryptor.sign("Hello, world!", "")).rejects.toThrow();
		});

		it("should throw an error with non-PEM formatted private key", async () => {
			const invalidPrivateKey = " invalid private key ";
			await expect(Cryptor.sign("Hello, world!", invalidPrivateKey)).rejects.toThrow();
		});

		it("should generate a signature with different data types (number)", async () => {
			const data = 123;
			const signature = await Cryptor.sign(data.toString(), privateKey);
			expect(signature).toBeTypeOf("string");
			expect(signature.length).toBeGreaterThan(0);
		});

		it("should generate a signature with different data types (object)", async () => {
			const data = { foo: "bar" };
			const signature = await Cryptor.sign(JSON.stringify(data), privateKey);
			expect(signature).toBeTypeOf("string");
			expect(signature.length).toBeGreaterThan(0);
		});

		it("should generate a signature with different data types (array)", async () => {
			const data = [1, 2, 3];
			const signature = await Cryptor.sign(JSON.stringify(data), privateKey);
			expect(signature).toBeTypeOf("string");
			expect(signature.length).toBeGreaterThan(0);
		});
	});

	describe("Cryptor.verify()", () => {
		let publicKey: string;
		let privateKey: string;
		let data: string;
		let signature: string;

		beforeEach(async () => {
			const keyPair = await Cryptor.generateKeyPair();
			publicKey = keyPair.publicKey;
			privateKey = keyPair.privateKey;
			data = "Hello, world!";
			signature = await Cryptor.sign(data, privateKey);
		});

		it("should verify a valid signature", async () => {
			const isValid = await Cryptor.verify(data, signature, publicKey);
			expect(isValid).toBe(true);
		});

		it("should not verify an invalid signature", async () => {
			const invalidSignature = "invalid-signature";
			const isValid = await Cryptor.verify(data, invalidSignature, publicKey);
			expect(isValid).toBe(false);
		});

		it("should not verify with empty data", async () => {
			await expect(() => Cryptor.verify("", signature, publicKey)).rejects.toThrow();
		});

		it("should not verify with empty signature", async () => {
			await expect(() => Cryptor.verify(data, "", publicKey)).rejects.toThrow();
		});

		it("should not verify with empty public key", async () => {
			await expect(() => Cryptor.verify(data, signature, " ")).rejects.toThrow();
		});

		it("should not verify with null data", async () => {
			const nullData = null as unknown as string;
			await expect(Cryptor.verify(nullData, signature, publicKey)).rejects.toThrow();
		});

		it("should not verify with null signature", async () => {
			const nullSignature = null as unknown as string;
			await expect(Cryptor.verify(data, nullSignature, publicKey)).rejects.toThrow();
		});

		it("should not verify with null public key", async () => {
			const nullPublicKey = null as unknown as string;
			await expect(Cryptor.verify(data, signature, nullPublicKey)).rejects.toThrow();
		});

		it("should not verify with undefined data", async () => {
			const undefinedData = undefined as unknown as string;
			await expect(Cryptor.verify(undefinedData, signature, publicKey)).rejects.toThrow();
		});

		it("should not verify with undefined signature", async () => {
			const undefinedSignature = undefined as unknown as string;
			await expect(Cryptor.verify(data, undefinedSignature, publicKey)).rejects.toThrow();
		});

		it("should not verify with undefined public key", async () => {
			const undefinedPublicKey = undefined as unknown as string;
			await expect(Cryptor.verify(data, signature, undefinedPublicKey)).rejects.toThrow();
		});
	});
});
