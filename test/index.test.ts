// import { describe, it, expect } from "@jest/globals";

import { Is, To, Utils } from '../src';

interface IPerson {
	name: string;
	age: number;
}
const people: IPerson[] = [
	{ name: 'John', age: 23 },
	{ name: 'Jane', age: 19 },
	{ name: 'Bob', age: 35 }
];

describe('test', () => {
	it('test dynamicSort ascending', () => {
		const n = Utils.orderBy(people, 'age');
		expect(n[0].age).toBe(19);
	});

	it('test dynamicSort descending', () => {
		const n = Utils.orderBy(people, 'age', 'desc');
		expect(n[0].age).toBe(35);
	});

	it('test is numeric', () => {
		const b = Is.numeric('15.4');
		expect(b).toBeTruthy();
	});

	it('test is not numeric', () => {
		const b = !Is.numeric('15px');
		expect(b).toBeTruthy();
	});

	it('test number 0 to boolean', () => {
		const b = !To.boolean('0');
		expect(b).toBeTruthy();
	});

	it('test number to boolean', () => {
		const b = To.boolean('55');
		expect(b).toBeTruthy();
	});

	it('test `true` to boolean', () => {
		const b = To.boolean('true');
		expect(b).toBeTruthy();
	});

	it('test dateExplode', () => {
		const date = new Date();
		const dateExploded = To.dateParts(date);
		expect(dateExploded.year).toBe(date.getFullYear());
		expect(dateExploded.month).toBe(date.getMonth() + 1);
		expect(dateExploded.day).toBe(date.getDate());
		expect(dateExploded.hour).toBe(date.getHours());
		expect(dateExploded.minute).toBe(date.getMinutes());
		expect(dateExploded.second).toBe(date.getSeconds());
	});

	it('test dateExplode with string', () => {
		const date = new Date();
		const dateExploded = To.dateParts(date.toString());
		expect(dateExploded.year).toBe(date.getFullYear());
		expect(dateExploded.month).toBe(date.getMonth() + 1);
		expect(dateExploded.day).toBe(date.getDate());
		expect(dateExploded.hour).toBe(date.getHours());
		expect(dateExploded.minute).toBe(date.getMinutes());
		expect(dateExploded.second).toBe(date.getSeconds());
	});
});
