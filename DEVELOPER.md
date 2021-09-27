# Development

This document describes how you can test, build and publish the library.

## Prerequisite

Before you can build and test this library you must install and configure the following products on your development machine:

* [Git][git]
* [Node.js][nodejs]

You will then need to install the required dependencies:

```sh
$ cd <library-path>
$ npm install
```

## Building the library

The library will be built in the `./dist/library` directory.

```sh
$ npm run build
```

## Publishing to NPM repository

This project comes with automatic continuous delivery (CD) using *GitHub Actions*.

1. Bump the library version in `./package.json`
2. Push the changes
3. Create a new: [GitHub release](https://github.com/DSI-HUG/eslint-config/releases/new)
4. Watch the results in: [Actions](https://github.com/DSI-HUG/eslint-config/actions)



[git]: https://git-scm.com/
[nodejs]: https://nodejs.org/