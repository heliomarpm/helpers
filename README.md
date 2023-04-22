<span id="top"></span>
<h1 align="center">
  
  [![Electron Logo](https://electronjs.org/images/electron-logo.svg)](https://electronjs.org)
  HELPER

  ![CodeQL](https://github.com/heliomarpm/electron-helper/actions/workflows/codeql-analysis.yml/badge.svg) ![Publish](https://github.com/heliomarpm/electron-helper/actions/workflows/publish.yml/badge.svg) <a href="https://navto.me/heliomarpm" target="_blank"><img src="https://navto.me/assets/navigatetome-brand.png" width="32"/></a>

  ![electron version](https://img.shields.io/github/package-json/dependency-version/heliomarpm/electron-helper/dev/electron)
  ![typescript version](https://img.shields.io/github/package-json/dependency-version/heliomarpm/electron-helper/dev/typescript)
  
</h1>

<p align="center">
  <!-- PayPal -->
  <a href="https://bit.ly/support-heliomarpm" target="_blank" rel="noopener noreferrer">
    <img alt="paypal url" src="https://img.shields.io/badge/donate%20on-paypal-1C1E26?style=for-the-badge&labelColor=1C1E26&color=0475fe"/>
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
  <!-- <a href="https://github.com/heliomarpm/electron-helper/releases" target="_blank" rel="noopener noreferrer">
     <img alt="releases url" src="https://img.shields.io/github/v/release/heliomarpm/electron-vuevite-quick-start?style=for-the-badge&labelColor=1C1E26&color=2ea043"/>
  </a>   -->
  <!-- License -->
  <a href="https://github.com/heliomarpm/electron-helper/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
    <img alt="license url" src="https://img.shields.io/badge/license%20-MIT-1C1E26?style=for-the-badge&labelColor=1C1E26&color=61ffca"/>
  </a>
</p>


A utility for Electron with many useful features

## Install 

`npm i @heliomarpm/electron-helper`

## How to use

```ts
import {is, helper} from '@heliomarpm/electron-helper'
```

### API Is

- **is.windows()**  
Verifies that it's running on the `Windows OS`.

- **is.linux()**  
Verifies that it's running on the `Linux OS`.

- **is.macOS()** *aliases* **is.osx()**  
Verifies that it's running on the `Mac OS`.

- **is.x86()**  
Check if the processor architecture is `ia32`.

- **is.x64()**  
Check if the processor architecture is  `x64`.

- **is.arm()**  
Check if the processor architecture is  `arm`.

- **is.arm64()**  
Check if the processor architecture is `arm64`.

- **is.dev()**  
Check if you are running in `developer mode` 
```bash
# (i.e.) Environment 'ELECTRON_IS_DEV' or not electron.app.isPackage.
```

## Dev Dependencies

- [electron](https://ghub.io/electron): Build cross platform desktop apps with JavaScript, HTML, and CSS


## Resources for Learning Electron

- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation

# Contributing

Please make sure to read the [Contributing Guide](https://github.com/heliomarpm/electron-vuevite-quick-start/blob/master/docs/CONTRIBUTING.md) before making a pull request.


Thank you to all the people who already contributed to project!

<a href="https://github.com/heliomarpm/electron-vuevite-quick-start/graphs/contributors" target="_blank">
  <img src="https://contrib.rocks/image?repo=heliomarpm/electron-vuevite-quick-start" />
</a>

###### Made with [contrib.rocks](https://contrib.rocks).

That said, there's a bunch of ways you can contribute to this project, like by:

- :beetle: Reporting a bug
- :page_facing_up: Improving this documentation
- :rotating_light: Sharing this project and recommending it to your friends
- :dollar: Supporting this project on GitHub Sponsors or Ko-fi
- :star2: Giving a star on this repository


## Donate

If you appreciate that, please consider donating to the Developer.

<p align="center">
  <!-- PayPal -->
  <a href="https://bit.ly/paypal-udeler" target="_blank" rel="noopener noreferrer">
    <img alt="paypal url" src="https://img.shields.io/badge/donate%20on-paypal-1C1E26?style=for-the-badge&labelColor=1C1E26&color=0475fe"/>
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

## License

[MIT © Heliomar P. Marques](https://github.com/heliomarpm/electron-vuevite-quick-start/blob/main/LICENSE) <a href="#top">🔝</a>
