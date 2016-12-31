import typescript from 'rollup-plugin-typescript';

export default {
    entry: './src/main/index.ts',
    dest: './dist/ObjectMapper.es2015.js',
    format: 'iife',
    moduleName: 'ObjectMapper',
    exports: 'named',
    external: [
        'reflect-metadata'
    ],
    globals: {
        "reflect-metadata" : "Reflect"
    },
    plugins: [
        typescript(),
    ]
}