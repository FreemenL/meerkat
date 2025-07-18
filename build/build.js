const path = require('path')
const json = require('@rollup/plugin-json')
const { babel } = require('@rollup/plugin-babel')

const resolveFile = function (filePath) {
    return path.join(__dirname, filePath)
}

const plugins = [
    json({
        compact: true,
    }),
    babel({
        extensions: ['.js', '.ts'],
        babelHelpers: 'bundled',
        presets: [[
            '@babel/env',
            {
                targets: {
                    browsers: [
                        '> 1%',
                        'last 2 versions',
                        'not ie <= 8',
                    ],
                },
            },
        ]],
    }),
]

module.exports = [
    {
        plugins,
        input: resolveFile('../src/index.js'),
        output: {
            file: resolveFile('../dist/meerkat.js'),
            format: 'iife',
            name: 'meerkat',
            sourcemap: true,
        },
    },
    {
        plugins,
        input: resolveFile('../src/index.js'),
        output: {
            file: resolveFile('../dist/meerkat.esm.js'),
            format: 'esm',
            name: 'meerkat',
            sourcemap: true,
        },
    },
    {
        plugins,
        input: resolveFile('../src/index.js'),
        output: {
            file: resolveFile('../dist/meerkat.cjs.js'),
            format: 'cjs',
            name: 'meerkat',
            sourcemap: true,
        },
    },
]
