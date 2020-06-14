# broccoli-nearley [![Build Status](https://travis-ci.org/yapplabs/broccoli-nearley.svg?branch=master)](https://travis-ci.org/yapplabs/broccoli-nearley)

Broccoli plugin for compiling [nearley](https://nearley.js.org/) grammars with a persistent cache for fast restarts.

## Installation

```
yarn add broccoli-nearley
```

## Usage

```js
let Nearly = require('broccoli-nearley');
let outputNode = new Nearly(inputNode, {
  persist: false
});
```

## Options

### persist

Type: `Boolean`  
Default: `true`

Enable\disable a persistent cache to improve build performance across restarts. Check out [broccoli-persistent-filter](https://github.com/stefanpenner/broccoli-persistent-filter) for more details.

## Running Tests

```
yarn install
yarn test
```

## License

This project is distributed under the MIT license.
