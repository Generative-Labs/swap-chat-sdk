import path from 'path';
import resolve from 'rollup-plugin-node-resolve'; // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs'; // commonjs模块转换插件
import ts from 'rollup-plugin-typescript2';
import { eslint } from 'rollup-plugin-eslint';
import packageJSON from './package.json';

const getPath = (_path) => path.resolve(__dirname, _path);

const extensions = ['.js', '.ts', '.tsx'];

// ts
const tsPlugin = ts({
  tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
  extensions,
});

// eslint
const esPlugin = eslint({
  throwOnError: true,
  include: ['src/**/*.ts'],
  exclude: ['node_modules/**', 'lib/**'],
});

// 基础配置
const commonConf = {
  input: getPath('./src/index.ts'),
  plugins: [
    resolve({ browser: true }, extensions),
    commonjs(),
    esPlugin,
    tsPlugin,
  ],
  external: ['axios'],
};

// 需要导出的模块类型
const outputMap = [
  {
    file: packageJSON.main, // 通用模块
    format: 'umd',
    globals: {
      axios: 'Axios',
    },
  },
  {
    file: packageJSON.module, // es6模块
    format: 'es',
    globals: {
      axios: 'Axios',
    },
  },
];

const buildConf = (options) => Object.assign({}, commonConf, options);

export default outputMap.map((output) =>
  buildConf({ output: { name: packageJSON.name, ...output } })
);
