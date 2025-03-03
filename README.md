
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

`@heliomarpm\helpers` is a comprehensive collection of TypeScript utility functions for formatting, type checking, conversion, and general utilities. This library provides a set of helper functions to make common programming tasks easier and more maintainable.


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

## Main files:

- `format.ts` - String formatting, date formatting, number formatting
- `is.ts` - Type checking and validation functions
- `to.ts` - Type conversion and transformation utilities
- `utils.ts` - Common utility functions
- `index.ts` - Main export file

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
Is.linuxOS; // true

// Conversion
To.boolean('1'); // true
To.boolean('false'); // false

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

### Main functionalities

#### Type Checking (is.ts)
- `Is.windowsOS` - Verifies that it's running on the Windows OS.
- `Is.linuxOS` - Verifies that it's running on the Linux OS.
- `Is.macOS` - Verifies that it's running on the Mac OS.
- `Is.arch_x64` - Check if the processor architecture is x64.
- `Is.arch_x86` - Check if the processor architecture is ia32.
- `Is.arch_Arm` - Check if the processor architecture is arm.	
- `Is.arch_Arm64` - Check if the processor architecture is arm64.
- `Is.cpf()` - Validate a CPF (Brazilian National Register of Individuals).
- `Is.cnpj()` - Validate a CNPJ (Brazilian National Corporate Registration Number).
- `Is.equals()` - Compares two values recursively.
- `Is.numeric()` - Check if a value is numeric.
- `Is.date()` - Check if a value is a date.
- `Is.object()` - Check if a value is an object.
- `Is.nullOrEmpty()` - Check if a value is null or an empty object or array.

#### Formatting (format.ts)
- `Format.date()` - Formats a Date object into a string according to the specified format.
- `Format.number()` - Format numbers
- `Format.currency()` - Format currency values
- `Format.onlyNumbers()` - Remove non-numeric characters from a string.
- `Format.padZerosByMax()` - Pad a number with zeros to a specified maximum length.
- `Format.ptBr.` - Brazilian Portuguese formatting helpers

#### Conversion (to.ts)
- `To.dictionary()` - Converts a JSON object to a Record<string, T> type.
- `To.boolean()` - Convert to boolean
- `To.dateParts()` - Extracts parts of a date such as year, month, day, etc.
- `To.number()` - Convert to number, fallback to NaN

#### Utilities (utils.ts)
- `Utils.gerarCPF()` - Generate a random CPF (Brazilian National Register of Individuals).
- `Utils.gerarCNPJ()` - Generate a random CNPJ (Brazilian National Corporate Registration Number).
- `Utils.sortByProps()` - Returns a comparison function to be used with the `sort` method for sorting an array of objects.	
- `Utils.orderBy()` - Sorts an array of objects by the specified key in ascending or descending order.
- `Utils.getNestedValue()` - Retrieves a value from a nested object using a dot-separated path.
- `Utils.setNestedValue()` - Sets a value in a nested object using a dot-separated path.
- `Utils.ifNull()` - Returns a default value if the input value is null or undefined.
- `Utils.ifNullOrEmpty()` - Returns a default value if the input value is null, undefined, or an empty string.
- `Utils.generateGuid()` - Generates a globally unique identifier (GUID).
- `Utils.generateKey()` - Generates a new 256-bit AES-GCM key.
- `Utils.encrypt()` - Encrypts a string using AES-GCM algorithm.
- `Utils.decrypt()` - Decrypts an encrypted string using AES-GCM algorithm.
___

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


----
[url-npm]: https://www.npmjs.com/package/@heliomarpm/helpers
[url-npm-badge]: https://img.shields.io/npm/v/@heliomarpm/helpers.svg
[url-downloads]: http://badge.fury.io/js/@heliomarpm/helpers.svg
[url-downloads-badge]: https://img.shields.io/npm/dm/@heliomarpm/helpers.svg  
[url-deepscan]: https://deepscan.io/dashboard#view=project&tid=19612&pid=28935&bid=933374
[url-deepscan-badge]: https://deepscan.io/api/teams/19612/projects/28935/branches/933374/badge/grade.svg
[url-codefactor]: https://www.codefactor.io/repository/github/heliomarpm/helpers
[url-codefactor-badge]: https://www.codefactor.io/repository/github/heliomarpm/helpers/badge
[url-codeql]: https://github.com/heliomarpm/helpers/actions/workflows/codeql.yml/badge.svg 
[url-publish]: https://github.com/heliomarpm/helpers/actions/workflows/publish.yml/badge.svg 
