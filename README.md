# angular2-template-loader
Chain-to loader for webpack that inlines all html and style's in angular2 components. 

[![Build Status](https://travis-ci.org/TheLarkInn/angular2-template-loader.svg?branch=master)](https://travis-ci.org/TheLarkInn/angular2-template-loader)
[![Coverage](https://codecov.io/gh/TheLarkInn/angular2-template-loader/branch/master/graph/badge.svg)](https://codecov.io/gh/TheLarkInn/angular2-template-loader)
[![Taylor Swift](https://img.shields.io/badge/secured%20by-taylor%20swift-brightgreen.svg)](https://twitter.com/SwiftOnSecurity)

### Quick Links
- [Installation](#installation)
- [Requirements](#requirements)
- [Example markup](#example-markup)
- [Awesome Typescript Loader](#awesome-typescript-loader)
- [How does it work](#how-does-it-work)

### Installation
Install the webpack loader from [npm](https://www.npmjs.com/package/angular2-template-loader).
- `npm install angular2-template-loader --save-dev`

Chain the `angular2-template-loader` to your currently used typescript loader.

```js
loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
```

### Requirements
To be able to use the template loader you must have a loader registered, which can handle `.html` and `.css` files.
> The most recommended loader is [`raw-loader`](https://github.com/webpack/raw-loader)

### Example Markup
Here is an example markup of the `webpack.config.js`, which chains the `angular2-template-loader` to the `tsloader`

```js
module: {
  loaders: [
    {
      test: /\.ts$/,
      loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
      exclude: [/\.(spec|e2e)\.ts$/]
    },
    { 
      test: /\.(html|css)$/, 
      loader: 'raw-loader'
    }
  ]
}
```

### Awesome Typescript Loader
When using `awesome-typescript-loader` to load your typescript files you have to set the `useWebpackText` property to `true`.
Otherwise the `angular2-template-loader` is not able to chain into it.

Here is an example markup (`tsconfig.json`)
```js
{
  "compilerOptions": {
    ...
  },
  "awesomeTypescriptLoaderOptions": {
    ...
    "useWebpackText": true // Allows other loaders to be chained to awesome-typescript-loader.
  },
}
```

### How does it work
The `angular2-template-loader` searches for `templateUrl` and `styleUrls` declarations inside of the Angular 2 Component metadata and replaces the paths with the corresponding `require` statement.

The generated `require` statements will be handled by the given loader for `.html` and `.js` files.
