import { is, memory, to, utils } from '../src'

interface IPerson {
  name: string;
  age: number;
}
const people: IPerson[] = [
  { name: 'John', age: 23 },
  { name: 'Jane', age: 19 },
  { name: 'Bob', age: 35 },
];

test('test dynamicSort ascending', () => {
  const n = utils.sortBy(people, "age");
  expect(n[0].age).toBe(19)
})

test('test dynamicSort descending', () => {
  const n = utils.sortBy(people, "age", "desc");
  expect(n[0].age).toBe(35)
})

test('test is numeric', () => {
  const b = is.numeric("15.4")
  expect(b).toBeTruthy()
})

test('test is not numeric', () => {
  const b = !is.numeric("15px")
  expect(b).toBeTruthy()
})

test('test number 0 to boolean', () => {
  const b = !to.boolean("0")
  expect(b).toBeTruthy()
})


test('test number to boolean', () => {
  const b = to.boolean("55")
  expect(b).toBeTruthy()
})

test('test `true` to boolean', () => {
  const b = to.boolean("true")
  expect(b).toBeTruthy()
})

test('test set memory boolean', () => {
  memory.set("b", true);
})
test('test set memory object', () => {
  memory.set("o", { value: true });
})


test('test get memory boolean', () => {
  const b = memory.get<boolean>("b")
  expect(b).toBeTruthy()
})

test('test get memory object', () => {
  const b = memory.get("o")
  expect(b).toEqual({ value: true });
})

test('test remove memory boolean', () => {
  memory.remove("b");
  const b = memory.get("b");
  expect(b).toBeUndefined();
})


test('test clear memory', () => {
  memory.clear();
  const n = memory.size();
  expect(n).toBe(0);
})