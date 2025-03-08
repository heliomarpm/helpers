<div id="top" align="center" style="text-align:center;">
<h1>
  <img src="https://raw.githubusercontent.com/heliomarpm/helpers/refs/heads/master/logo.png" alt="Helpers Library" width="128" />
  <br>Helpers Library
  <a href="https://navto.me/heliomarpm" target="_blank"><img src="https://navto.me/assets/navigatetome-brand.png" width="32"/></a>

  [![DeepScan grade][url-deepscan-badge]][url-deepscan]
  [![CodeFactor][url-codefactor-badge]][url-codefactor] 
  ![CodeQL][url-codeql]<!-- ![Publish][url-publish] --> [![NPM version][url-npm-badge]][url-npm]
  [![Downloads][url-downloads-badge]][url-downloads]
  
  <!-- ![lodash](https://img.shields.io/github/package-json/dependency-version/heliomarpm/helpers/lodash)   -->
</h1>

<p>
  <!-- PixMe -->
  <a href="https://www.pixme.bio/heliomarpm" target="_blank" rel="noopener noreferrer">
    <img alt="pixme url" src="https://img.shields.io/badge/donate%20on-pixme-1C1E26?style=for-the-badge&labelColor=1C1E26&color=28f4f4"/>
  </a>
  <!-- PayPal -->
  <a href="https://bit.ly/paypal-sponsor-heliomarpm" target="_blank" rel="noopener noreferrer">
    <img alt="paypal url" src="https://img.shields.io/badge/paypal-1C1E26?style=for-the-badge&labelColor=1C1E26&color=0475fe"/>
  </a>
  <!-- Ko-fi -->
  <a href="https://ko-fi.com/heliomarpm" target="_blank" rel="noopener noreferrer">
    <img alt="kofi url" src="https://img.shields.io/badge/kofi-1C1E26?style=for-the-badge&labelColor=1C1E26&color=ff5f5f"/>
  </a>
  <!-- LiberaPay -->  
  <a href="https://liberapay.com/heliomarpm" target="_blank" rel="noopener noreferrer">
     <img alt="liberapay url" src="https://img.shields.io/badge/liberapay-1C1E26?style=for-the-badge&labelColor=1C1E26&color=f6c915"/>
  </a>
  <!-- Version -->
  <!-- <a href="https://github.com/heliomarpm/helpers/releases" target="_blank" rel="noopener noreferrer">
     <img alt="releases url" src="https://img.shields.io/github/v/release/heliomarpm/helpers?style=for-the-badge&labelColor=1C1E26&color=2ea043"/>
  </a>   -->
  <!-- License -->
  <!-- <a href="https://github.com/heliomarpm/helpers/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
    <img alt="license url" src="https://img.shields.io/badge/license%20-MIT-1C1E26?style=for-the-badge&labelColor=1C1E26&color=61ffca"/>
  </a> -->
</p>
</div>


## 🎯 About

`@heliomarpm/helpers` is a comprehensive collection of TypeScript utility functions for formatting, type checking, conversion, and general utilities. This library provides a set of helper functions to make common programming tasks easier and more maintainable.


## 🚀 Features

- Type checking utilities (is.ts)
- String and data formatting helpers (format.ts) 
- Type conversion functions (to.ts)
- General utility functions (utils.ts)
- Fully typed with TypeScript
- Zero dependencies
- Tree-shakeable exports
- CommonJS and ES Module support

## 📁 Project structure:

```
src/
├── helpers/
│   ├── format.ts    # Formatting utilities
│   ├── is.ts        # Type checking functions
│   ├── to.ts        # Type conversion helpers
│   └── utils.ts     # General utilities
└── index.ts         # Main entry point
```



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

## Main functionalities

### Usage

```typescript
import { Format, Is, To, Utils } from '@heliomarpm/helpers';
```

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

	Supported formats:
	- 'a': 'am' or 'pm' (lowercase)
	- 'A': 'AM' or 'PM' (uppercase)
	- 'hh': hours in 12h format (01-12)
	- 'h': hours in 12h format (1-12)
	- 'HH': hours in 24h format (00-23)
	- 'H': hours in 24h format (0-23)
	- 'MM': minutes (00-59)
	- 'ss': seconds (00-59)
	- 'SSS': milliseconds (000-999)
	- 'yyyy': full year
	- 'yy': year (two digits)
	- 'mmmm': month name
	- 'mmm': abbreviated month
	- 'mm': month (01-12)
	- 'dddd': weekday name
	- 'ddd': abbreviated weekday
	- 'dd': day (01-31)


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

// Capitalizes the first letter of a string
Format.titleCase('john doe'); // 'John Doe'
Format.titleCase('MARIA DA SILVA'); // 'Maria da Silva'
```

### Is Helpers (Validation)

```typescript
Is.cpf('123.456.789-01'); // Validates CPF
Is.cnpj('12.345.678/9012-34'); // Validates CNPJ
Is.numeric('123'); // true
Is.equals(obj1, obj2); // Deep comparison
Is.date('2023-12-31'); // Validates date
Is.nullOrEmpty(value); // Checks for null/empty
Is.object({}); // Validates object type
Is.email('user@example.com'); // Validates email

// OS and Architecture checks
Is.windowsOS
Is.linuxOS
Is.macOS
Is.arch_x86
Is.arch_x64
Is.arch_Arm
Is.arch_Arm64
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
Utils.ifNullOrEmpty(value, defaultValue); // Empty check with default
Utils.generateGuid(); // Generate GUID (e.g. '00000000-0000-0000-0000-000000000000') 
Utils.months({locale: 'pt-BR', month: 'long'}); // Get month names array (e.g. ['Janeiro', 'Fevereiro', ...])
Utils.weekdays({locale: 'pt-BR', weekday: 'long'}); // Get weekday names array (e.g. ['Domingo', 'Segunda-feira', ...])

// Crypto utilities
Utils.crypto.generateKey(); // Generate encryption key
Utils.crypto.encrypt(text, key); // Encrypt text
Utils.crypto.decrypt(encryptedText, key); // Decrypt text
```

## Dependencies

	This library has no dependencies


## 🤝 Contributing

Please make sure to read the [Contributing Guide](docs/CONTRIBUTING.md) before making a pull request.


Thank you to all the people who already contributed to project!

<a href="https://github.com/heliomarpm/helpers/graphs/contributors" target="_blank">
  <img src="https://contrib.rocks/image?repo=heliomarpm/helpers" />
</a>

###### Made with [contrib.rocks](https://contrib.rocks).

That said, there's a bunch of ways you can contribute to this project, like by:

- :beetle: Reporting a bug
- :page_facing_up: Improving this documentation
- :rotating_light: Sharing this project and recommending it to your friends
- :dollar: Supporting this project on GitHub Sponsors or Ko-fi
- :star2: Giving a star on this repository


## 📢 Support the Project

If you appreciate that, please consider donating to the Developer.

<p>
  <!-- PixMe -->
  <a href="https://www.pixme.bio/heliomarpm" target="_blank" rel="noopener noreferrer">
    <img alt="pixme url" src="https://img.shields.io/badge/donate%20on-pixme-1C1E26?style=for-the-badge&labelColor=1C1E26&color=28f4f4"/>
  </a>
  <!-- PayPal -->
  <a href="https://bit.ly/paypal-sponsor-heliomarpm" target="_blank" rel="noopener noreferrer">
    <img alt="paypal url" src="https://img.shields.io/badge/paypal-1C1E26?style=for-the-badge&labelColor=1C1E26&color=0475fe"/>
  </a>
  <!-- Ko-fi -->
  <a href="https://ko-fi.com/heliomarpm" target="_blank" rel="noopener noreferrer">
    <img alt="kofi url" src="https://img.shields.io/badge/kofi-1C1E26?style=for-the-badge&labelColor=1C1E26&color=ff5f5f"/>
  </a>
  <!-- LiberaPay -->  
  <a href="https://liberapay.com/heliomarpm" target="_blank" rel="noopener noreferrer">
     <img alt="liberapay url" src="https://img.shields.io/badge/liberapay-1C1E26?style=for-the-badge&labelColor=1C1E26&color=f6c915"/>
  </a>  
  <!-- GitHub Sponsors -->
  <a href="https://github.com/sponsors/heliomarpm" target="_blank" rel="noopener noreferrer">
    <img alt="github sponsors url" src="https://img.shields.io/badge/GitHub%20-Sponsor-1C1E26?style=for-the-badge&labelColor=1C1E26&color=db61a2"/>
  </a>
</p>

## 📝 License

[MIT © Heliomar P. Marques](LICENSE) <a href="#top">🔝</a>
