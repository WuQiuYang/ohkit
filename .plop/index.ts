import { NodePlopAPI } from 'plop';
import path from 'path';

export default function (plop: NodePlopAPI) {
  // 设置组件生成器
  plop.setGenerator('component', {
    description: '创建一个新的组件包',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '请输入组件名称(kebab-case):',
        validate: (value) => /^[a-z]+(-[a-z]+)*$/.test(value) || '必须使用kebab-case格式'
      },
      {
        type: 'input',
        name: 'description',
        message: '请输入组件描述:'
      }
    ],
    actions: [
      {
        type: 'addMany',
        destination: path.join(process.cwd(), 'src/components/{{name}}'),
        templateFiles: 'plop-templates/component/**',
        base: 'plop-templates/component',
        stripExtensions: ['hbs'],
        globOptions: { dot: true }
      }
    ]
  });

  // 设置工具函数生成器
  plop.setGenerator('utils', {
    description: '创建一个新的工具函数包',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '请输入工具包名称(kebab-case):',
        validate: (value) => /^[a-z]+(-[a-z]+)*$/.test(value) || '必须使用kebab-case格式'
      },
      {
        type: 'input',
        name: 'description',
        message: '请输入工具包描述:'
      }
    ],
    actions: [
      {
        type: 'addMany',
        destination: path.join(process.cwd(), 'src/utils/packages/{{name}}'),
        templateFiles: 'plop-templates/utils/**',
        base: 'plop-templates/utils',
        stripExtensions: ['hbs'],
        globOptions: { dot: true }
      },
      {
        type: 'modify',
        path: path.join(process.cwd(), 'src/utils/src/index.ts'),
        pattern: '/* plop.append:UTILS_EXPORT */',
        template: `export * from '@ohkit/{{name}}';\n/* plop.append:UTILS_EXPORT */`
      },
    ]
  });
}
