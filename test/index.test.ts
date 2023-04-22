import { Is, To, Utils } from '../src'

interface IPerson{
  name: string;
  age: number;
}
const people: IPerson[] = [
  { name: 'John', age: 23 },
  { name: 'Jane', age: 19 },
  { name: 'Bob', age: 35 },
];

test('test dynamicSort ascending', () => {
  const n = Utils.sortBy(people, "age");
  expect(n[0].age).toBe(19)
})

test('test dynamicSort descending', () => {
  const n = Utils.sortBy(people, "age", "desc");
  expect(n[0].age).toBe(35)
})

test('test is numeric', () => {
  const b = Is.numeric("15.4")
  expect(b).toBeTruthy()
})

test('test is not numeric', () => {
  const b = !Is.numeric("15px")
  expect(b).toBeTruthy()
})

test('test number 0 to boolean', () => {
  const b = !To.boolean("0")
  expect(b).toBeTruthy()
})


test('test number to boolean', () => {
  const b = To.boolean("55")
  expect(b).toBeTruthy()
})

test('test `true` to boolean', () => {
  const b = To.boolean("true")
  expect(b).toBeTruthy()
})


// test('test is developer mode', () => {
//   expect(is.dev).toBeTruthy()
// })
