const { execSync } = require('child_process');

// 获取命令行参数
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: ts-node root-install-deps.ts [--scope=<scope>] <dependencies...> [--other-args...]');
  process.exit(1);
}

// 解析参数
// 添加的依赖
const dependencies = args.filter(arg => !arg.startsWith('-'));
// 其他参数 eg: -D
const otherArg = args.filter(arg => arg.startsWith('-') && !arg.startsWith('--scope=')).join(' ');
// 作用域参数
const scopeArg = args.find(arg => arg.startsWith('--scope='));

const scope = scopeArg ? scopeArg.split('=')[1] : '@ohkit/site'; // 默认安装在 @ohkit/site 包中

// 遍历依赖列表并调用 lerna add
dependencies.forEach(dep => {
  try {
    const cmd = `lerna add ${dep} --scope=${scope} ${otherArg}`;
    console.log(`Running command: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to add dependency ${dep}:`, error.message);
    } else {
      console.error(`Failed to add dependency ${dep}:`, String(error));
    }
  }
});
