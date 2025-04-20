import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		reporters: ['verbose']
		// environment: 'jsdom', // Use jsdom for browser-like tests
		// coverage: {
		// 	reporter: ['text', 'json', 'html'] // Optional: Add coverage reports
		// }
	}
});
