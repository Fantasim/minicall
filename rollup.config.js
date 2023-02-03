
import typescript from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify';
import commonjs from '@rollup/plugin-commonjs';

const config = {
    input: './index.ts',
    output: [
        {
            file: "dist/index.js",
            format: 'umd',
            name: 'minicall',
        },
    ],
    plugins: [
        typescript({
            tsconfig: 'tsconfig.json',
            tsconfigOverride: { compilerOptions: { module: 'ES2020' } },
        }),
        commonjs(),
        uglify()
    ]
}

export default config