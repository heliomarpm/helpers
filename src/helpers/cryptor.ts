import { createHash, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const randomBytesAsync = promisify(randomBytes);

export interface KeyPair {
	publicKey: string;
	privateKey: string;
}

function validateInput(inputText: string, inputName: string | null = ""): void {
	if (typeof inputText !== "string" || inputText.trim() === "") {
		const name = (inputName || "").trim() === "" ? "" : `${(inputName || "").trim()} `;
		throw new Error(`Input ${name}must not be empty or whitespace.`);
	}
}

export const Cryptor = {
	/**
	 * Generates a SHA256 hash of the given text.
	 *
	 * @param text - The input text to hash.
	 * @returns A Promise that resolves to a hexadecimal string representing the SHA256 hash of the text.
	 *
	 * @example
	 * ```js
	 * const hashedPass = await Cryptor.hash('myPassword');
	 * console.log(hashedPass); // e.g., "9a0b...7f"
	 * ```
	 */
	async hash(text: string): Promise<string> {
		validateInput(text, "text");

		const hash = createHash("sha256");
		hash.update(text);

		return hash.digest("hex");
	},

	/**
	 * Compares a plain text string to a hashed string to determine if they are equivalent.
	 *
	 * @param text - The plaintext string to hash and compare.
	 * @param hash - The hash string to compare against the hashed text.
	 * @returns A Promise that resolves to `true` if the hashed text matches the given hash, `false` otherwise.
	 *
	 * @example
	 * ```js
	 * const isMatch = await Cryptor.compareHash("myPassword", hashedPass);
	 * console.log(isMatch); // Outputs true if 'example' hashes to 'hash', otherwise false
	 * ```
	 */
	async compareHash(text: string, hash: string): Promise<boolean> {
		validateInput(text, "text");
		validateInput(hash, "hash");

		const textHash = await this.hash(text);
		return textHash === hash;
	},

	/**
	 * Generates a cryptographically secure random salt value as a hexadecimal string.
	 *
	 * @param length - The length of the salt in bytes. Defaults to 16.
	 * @returns A Promise that resolves to a hexadecimal string representing the generated salt.
	 *
	 * @example
	 * ```js
	 * const salt = await Cryptor.generateSalt();
	 * console.log(salt); // Outputs a random hexadecimal string of length 16.
	 * ```
	 */
	async generateSalt(length = 16): Promise<string> {
		if (length <= 0) {
			throw new Error("Salt length must be greater than 0.");
		}
		const salt = await randomBytesAsync(length);
		return salt.toString("hex");
	},

	/**
	 * Generates a new 2048-bit RSA key pair and returns it as an object with `publicKey` and `privateKey` properties.
	 *
	 * @returns A Promise that resolves to an object with `publicKey` and `privateKey` properties, both as PEM-formatted strings.
	 *
	 * @example
	 * ```js
	 * const keyPair = await Cryptor.generateKeyPair();
	 * console.log(keyPair.publicKey); // Outputs the PEM-formatted public key
	 * console.log(keyPair.privateKey); // Outputs the PEM-formatted private key
	 * ```
	 */
	async generateKeyPair(): Promise<KeyPair> {
		const { generateKeyPairSync } = await import("node:crypto");

		const { publicKey, privateKey } = generateKeyPairSync("rsa", {
			modulusLength: 2048,
			publicKeyEncoding: {
				type: "spki",
				format: "pem",
			},
			privateKeyEncoding: {
				type: "pkcs8",
				format: "pem",
			},
		});

		return { publicKey, privateKey };
	},

	/**
	 * Generates a digital signature for the given data using the private key.
	 *
	 * @param data - The data to sign.
	 * @param privateKey - The PEM-formatted private key to use for signing.
	 * @returns A Promise that resolves to the generated signature as a hexadecimal string.
	 *
	 * @example
	 * ```js
	 * const payload = JSON.stringify({id: 123, nome: "Heliomar", timestamp: Date.now()})
	 * const  { publicKey, privateKey } = await Cryptor.generateSalt();
	 *
	 * const signature = await Cryptor.sign(payload, privateKey);
	 * console.log(Buffer.from(signature).toString("base64"));
	 *
	 * const isValid = await Cryptor.verify(payload, signature, publicKey);
	 * console.log(isValid); // Outputs true
	 * ```
	 */
	async sign(data: string, privateKey: string): Promise<string> {
		validateInput(data, "data");
		validateInput(privateKey, "privateKey");

		const { createSign } = await import("node:crypto");

		const signer = createSign("SHA256");
		signer.update(data);
		return signer.sign(privateKey, "hex");
	},

	/**
	 * Verifies the digital signature of the given data using the public key.
	 *
	 * @param data - The data whose signature needs to be verified.
	 * @param signature - The hexadecimal string representing the signature to verify.
	 * @param publicKey - The PEM-formatted public key to use for verification.
	 * @returns A Promise that resolves to `true` if the signature is valid, `false` otherwise.
	 *
	 * @example
	 * ```js
	 * const isValid = await Cryptor.verify('Hello, world!', signature, publicKey);
	 * console.log(isValid); // Outputs true if the signature is valid, otherwise false
	 * ```
	 */
	async verify(data: string, signature: string, publicKey: string): Promise<boolean> {
		validateInput(data, "data");
		validateInput(signature, "signature");
		validateInput(publicKey, "publicKey");

		const { createVerify } = await import("node:crypto");

		const verifier = createVerify("SHA256");
		verifier.update(data);
		return verifier.verify(publicKey, signature, "hex");
	},
};
