# desktop
Basic desktop application with React.

### Basic strategy

Pretty straight forward process for building:

1. Transpile the React code with `electron-renderer` (this will be included in the index.html via `webpack-html-plugin`).
2. Transpile the electron renderer with target `electron-main`.
3. Copy over the package.json, which will point to the `renderer.js` that was transpiled.
4. Run by starting the electron process via `electron`

This is then output to the `dist/` directory like so:

In development, this is slightly different:

1. Run a hot server for React
2. Load the remove