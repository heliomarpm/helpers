<div id="top" align="center">
  <h1>
    <!-- <img src="./logo.png" alt="Helpers Library" width="128" /> -->
    <br>Helpers Library <a href="https://navto.me/heliomarpm" target="_blank"><img src="https://navto.me/assets/navigatetome-brand.png" width="32"/></a>
  </h1>
</div>

## 📚 Summary

`@heliomarpm/helpers` is a comprehensive collection of TypeScript utility functions for formatting, type checking, conversion, and general utilities. This library provides a set of helper functions to make common programming tasks easier and more maintainable.

### Requirements

- Node.js v16+

## 🚀 Features

- Type checking utilities (is.ts)
- String and data formatting helpers (format.ts) 
- Type conversion functions (to.ts)
- General utility functions (utils.ts)
- Fully typed with TypeScript
- Zero dependencies
- Tree-shakeable exports
- CommonJS and ES Module support


## 📦 Installation

You can install the library using `npm` or `yarn`:

```bash
npm i @heliomarpm/helpers
# or 
yarn add @heliomarpm/helpers
```

## 🔧 Basic Usage

To use the library in a TypeScript or modern JavaScript project, you can import it directly:

```typescript
import { Is, To, Format, Utils } from '@heliomarpm/helpers';

// Type checking
Is.CPF('111.222.333-00'); // false
Is.CNPJ('11.222.333/0001-00'); // false

// Conversion
To.boolean('1'); // true
To.boolean('false'); // false
To.boolean('invalid'); // false

// Formatting
Format.date('2025-03-02', 'dddd, dd mmmm yyyy', 'en-US'); // "Sunday, 02 March 2025"
Format.ptBr.valorPorExtenso(100_000); // "cem mil"

// General utilities
Utils.getNestedValue({ user: { name: { first: 'John' } }}, "user.name.first"); // "John"

const target = {user: {name: {first: 'John',last: 'Doe'} } };

Utils.setNestedValue(target, "user.name.first", "Jane"); 
Utils.setNestedValue(target, 'user.name.first', 'Jane');
Utils.setNestedValue(target, 'children[0].name', 'John');
Utils.setNestedValue(target, 'animals[0]', 'dog');
Utils.setNestedValue(target, 'animals[1]', 'cat');

// output will be target:
{ 
  user: { name: { first: 'Jane', last: 'Doe' } }, 
  children: [{ name: 'John' }], 
  animals: ['dog', 'cat'] 
}

```

## 🚀 Main functionalities

Import utilities directly:

```typescript
import { Format, Is, To, Utils } from '@heliomarpm/helpers';
```

## 📚 API Reference

### Format Helpers

#### Brazilian Formats (ptBr)

```typescript
Format.ptBr.cnpj('12345678901234'); // Formatar CNPJ '12.345.678/9012-34'
Format.ptBr.cnpj('1234567890123400', 'CNPJ não pode ser formatado'); // 'CNPJ não pode ser formatado'

Format.ptBr.cpf('12345678901'); // '123.456.789-01'
Format.ptBr.cpf('1234567890100', 'CPF não pode ser formatado'); // 'CPF não pode ser formatado'

Format.ptBr.cep('12345678'); // '12345-678'
Format.ptBr.cep('1234567800', 'CEP não pode ser formatado'); // 'CEP não pode ser formatado'

Format.ptBr.telefone('11999999999'); // '11 99999-9999'
Format.ptBr.telefone('1199999999900', 'Telefone não pode ser formatado'); // 'Telefone não pode ser formatado'
Format.ptBr.valorPorExtenso(1234); // 'mil duzentos e trinta e quatro'
```

#### Date Formatting

```typescript
Format.date(new Date(), 'dd/mm/yyyy HH:MM:ss'); // '31/12/2023 23:59:59'
Format.date('2025-03-02', 'dddd, dd mmmm yyyy', 'en-US'); // "Sunday, 02 
```

###### Supported formats are:

```js
/**
 * @param {string} format - The desired format for the output string.
 * - 'a': 'am' or 'pm' in lowercase
 * - 'A': 'AM' or 'PM' in uppercase
 * - 'hh': two-digit hours in 12h format (01-12)
 * - 'h': hours in 12h format (1-12)
 * - 'HH': two-digit hours in 24h format (00-23)
 * - 'H': hours in 24h format (0-23)
 * - 'MM': two-digit minutes (00-59)
 * - 'ss': two-digit seconds (00-59)
 * - 'SSS': three-digit milliseconds (000-999)
 * - 'yyyy': four-digit year (2024)
 * - 'yy': two-digit year (24)
 * - 'mmmm': full month name (January, February, ...)
 * - 'mmm': full month name abbreviated month (Jan, Feb, ...)
 * - 'mm': two-digit month (01-12)
 * - 'dddd': full weekday name (Sun, Mon, ...)
 * - 'ddd': abbreviated weekday name (Sun, Mon, ...)
 * - 'dd': two-digit day (01-31)
 */
  ```


#### Number Formatting

```typescript
// Format currency
Format.currency(1234.56, { locale: 'en', currency: 'USD' }); // '$1,234.56'

// Formating number (1.234,56)
Format.number(1234.56); // '1.234,56'

// Abreviate number (1.23K, 1.23M, etc.)
Format.abbreviateNumber(1234567); // '1.23M'

// Remove non-numeric characters from a string.
Format.onlyNumbers('abc123'); // '123'

// Pads a number with leading zeros to match the number of digits in a given maximum value
Format.padZerosByRef(5, 100); // '005'
```

#### String Formatting
```typescript
// Capitalizes the first letter of a string
Format.titleCase('john doe'); // 'John Doe'
Format.titleCase('MARIA DA SILVA'); // 'Maria da Silva'

// Mask a part of a string with a single character
Format.maskIt('1234567890', 3, 6, '*'); // '123****890'
Format.maskItParts('Heliomar P. Marques', '*', 1); // 'H******* P. M******'
```

### Is Helpers (Validation)

```typescript
Is.cpf('123.456.789-01'); // Validates CPF
Is.cnpj('12.345.678/9012-34'); // Validates CNPJ, can be in '12.345.678/9012-34' or '12345678901234'
Is.cnpj('12.ABC.345/01DE-35'); //after 2026, the CNPJ will transition to a new format with letters and numbers
Is.numeric('123'); // true
Is.equals(obj1, obj2); // Deep comparison
Is.date('2023-12-31'); // Validates date
Is.nullOrEmpty(value); // Checks for null/empty
Is.object({}); // Validates object type
Is.email('user@example.com'); // Validates email
Is.odd(123); // Checks if a number is odd
Is.even(123); // Checks if a number is even
Is.uuid('12345678-1234-1234-1234-123456789012'); // Validates UUID
Is.promise(new Promise(() => {})); // Checks if a value is a promise
Is.function(() => {}); // Checks if a value is a function
Is.url('https://example.com'); // Validates URL
Is.json('{"name": "John", "age": 30}'); // Validates JSON

// OS and Architecture checks
Is.plataform.windowsOS
Is.plataform.linuxOS
Is.plataform.macOS
Is.plataform.arch_x86
Is.plataform.arch_x64
Is.plataform.arch_Arm
Is.plataform.arch_Arm64
```

### To Helpers (Conversion)

```typescript
To.dictionary(jsonObject); // Converts to Record<string, T>
To.boolean('true'); // Converts to boolean
To.dateParts(new Date()); // Extracts date components
To.number('123'); // Converts to number
```

### Utils Helpers

```typescript
Utils.gerarCPF(); // Generates valid CPF
Utils.gerarCNPJ(); // Generates valid CNPJ
Utils.sortByProps(['name', '-age']); // Sort function for arrays
Utils.orderBy(array, 'key', 'asc'); // Sort array by key
Utils.getNestedValue(obj, 'user.name'); // Get nested object value
Utils.setNestedValue(obj, 'user.name', value); // Set nested object value
Utils.ifNull(value, defaultValue); // Null coalescing
Utils.ifNullOrEmpty(value, value2, defaultValue); // Returns the first non-null, non-undefined, and non-empty value from the given arguments.
Utils.generateGuid(); // Generate GUID (e.g. '00000000-0000-0000-0000-000000000000') 
Utils.months({locale: 'pt-BR', month: 'long'}); // Get month names array (e.g. ['Janeiro', 'Fevereiro', ...])
Utils.weekdays({locale: 'pt-BR', weekday: 'long'}); // Get weekday names array (e.g. ['Domingo', 'Segunda-feira', ...])
Utils.sleep(1000); // Sleep for 1 second
Utils.retry(fn, {retries: 5, delay: 500, onRetry: (error, attempt) => console.log(`Attempt ${attempt} failed with error ${error.message}`)}); // Retry function
Utils.memoize(fn); // Memoize function
Utils.debounce(fn, 100); // Debounce function
Utils.throttle(fn, 100); // Throttle function
Utils.once(fn); // Once function
Utils.pipe(fn1, fn2, fn3); // Pipe function
Utils.compose(fn1, fn2, fn3); // Compose function

// Crypto utilities
Utils.crypto.generateKey(); // Generate encryption key
Utils.crypto.encrypt(text, key); // Encrypt text
Utils.crypto.decrypt(encryptedText, key); // Decrypt text
```

## 📦 Project Scripts

* `npm run check` — runs formatter, linter and import sorting to the requested files
* `npm run format` — run the formatter on a set of files
* `npm run lint` — run various checks on a set of files
* `npm run test` — run unit tests
* `npm run test:c` — run unit tests with coverage
* `npm run docs:dev` — run documentation locally
* `npm run commit` - run conventional commits check
* `npm run release:test` — dry run semantic release 
* `npm run build` — build library


## 📦 Dependencies

✅ Zero runtime dependencies | Lightweight & secure  
🔄 All devDependencies are pinned to latest stable versions


## 🤝 Contributing

We welcome contributions! Please read:

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

Thank you to everyone who has already contributed to the project!

<a href="https://github.com/heliomarpm/helpers/graphs/contributors" target="_blank">
  <!-- <img src="https://contrib.rocks/image?repo=heliomarpm/helpers" /> -->
  <img src="https://contrib.nn.ci/api?repo=heliomarpm/helpers&no_bot=true" />
</a>

<!-- ###### Made with [contrib.rocks](https://contrib.rocks). -->
###### Made with [contrib.nn](https://contrib.nn.ci).

### ❤️ Support this project

If this project helped you in any way, there are several ways to contribute. \
Help us maintain and improve this template:

⭐ Starring the repository \
🐞 Reporting bugs \
💡 Suggest features \
🧾 Improving the documentation \
📢 Share with others

💵 Supporting via GitHub Sponsors, Ko-fi, Paypal or Liberapay, you decide. 😉

<div class="badges">

  [![PayPal][url-paypal-badge]][url-paypal]
  [![Ko-fi][url-kofi-badge]][url-kofi]
  [![Liberapay][url-liberapay-badge]][url-liberapay]
  [![GitHub Sponsors][url-github-sponsors-badge]][url-github-sponsors]

</div>


## 📝 License

[MIT © Heliomar P. Marques](./LICENSE)  <a href="#top">🔝</a>

----
<!-- Sponsor badges -->
[url-paypal-badge]: https://img.shields.io/badge/donate%20on-paypal-1C1E26?style=for-the-badge&labelColor=1C1E26&color=0475fe
[url-paypal]: https://bit.ly/paypal-sponsor-heliomarpm
[url-kofi-badge]: https://img.shields.io/badge/kofi-1C1E26?style=for-the-badge&labelColor=1C1E26&color=ff5f5f
[url-kofi]: https://ko-fi.com/heliomarpm
[url-liberapay-badge]: https://img.shields.io/badge/liberapay-1C1E26?style=for-the-badge&labelColor=1C1E26&color=f6c915
[url-liberapay]: https://liberapay.com/heliomarpm
[url-github-sponsors-badge]: https://img.shields.io/badge/GitHub%20-Sponsor-1C1E26?style=for-the-badge&labelColor=1C1E26&color=db61a2
[url-github-sponsors]: https://github.com/sponsors/heliomarpm
