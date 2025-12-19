const { execSync } = require('child_process');

// 参数处理
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const useCaretPrefix = args.includes('--caret');

console.log('🔄 开始更新内部依赖...');
if (isDryRun) {
  console.log('🔍 [干运行模式] 仅检查不实际修改');
}

// 获取所有包的最新版本信息
console.log('\n📦 获取包列表和当前版本...');
const packagesOutput = execSync('npx lerna ls --json', { encoding: 'utf8' });
const packages = JSON.parse(packagesOutput);

// 创建包名到版本的映射
const packageVersions = {};
packages.forEach(pkg => {
  packageVersions[pkg.name] = pkg.version;
});

// 分析内部依赖关系
console.log('\n🔍 分析内部依赖关系...');
const internalDependencies = {};

packages.forEach(pkg => {
  const pkgJsonPath = `${pkg.location}/package.json`;
  const pkgJson = require(pkgJsonPath);
  
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
    if (pkgJson[depType]) {
      Object.keys(pkgJson[depType]).forEach(dep => {
        if (dep.startsWith('@ohkit/') && dep !== pkg.name) {
          if (!internalDependencies[pkg.name]) {
            internalDependencies[pkg.name] = [];
          }
          internalDependencies[pkg.name].push({
            dependency: dep,
            currentVersion: pkgJson[depType][dep],
            latestVersion: packageVersions[dep],
            depType
          });
        }
      });
    }
  });
});

// 检查并更新需要更新的依赖
console.log('\n🔄 检查内部依赖更新...');
let needsUpdate = false;

for (const [pkgName, deps] of Object.entries(internalDependencies)) {
  for (const dep of deps) {
    // 解析当前版本号（去掉 ^/~ 前缀）
    const extractVersion = (version) => version.replace(/^[\^~]/, '');
    const currentPureVersion = extractVersion(dep.currentVersion);
    const shouldUpdate = currentPureVersion !== dep.latestVersion;
    
    if (shouldUpdate) {
      const updatedVersion = useCaretPrefix ? `^${dep.latestVersion}` : dep.latestVersion;
      console.log(`📌 ${pkgName} -> ${dep.dependency}: ${dep.currentVersion} → ${updatedVersion} (${dep.depType})`);
      needsUpdate = true;
      
        try {
          // 根据依赖类型构建正确的命令
          const versionPrefix = useCaretPrefix ? '^' : '';
          let cmd = `npx lerna add ${dep.dependency}@${versionPrefix}${dep.latestVersion} --scope=${pkgName}`;
          if (dep.depType === 'devDependencies') {
            cmd += ' --dev';
          } else if (dep.depType === 'peerDependencies') {
            cmd += ' --peer';
          }
          
          if (isDryRun) {
            console.log(`[干运行] 将执行: ${cmd}`);
            console.log(`✅ [干运行] 将更新 ${pkgName} 的 ${dep.dependency} 依赖 (${dep.depType})`);
          } else {
            execSync(cmd, { stdio: 'inherit' });
            console.log(`✅ 已更新 ${pkgName} 的 ${dep.dependency} 依赖 (${dep.depType})`);
          }
        } catch (error) {
          console.warn(`⚠️ 更新失败: ${error.message}`);
          if (!isDryRun) {
            console.warn('继续流程...');
          }
        }
    }
  }
}

if (!needsUpdate) {
  console.log('✅ 所有内部依赖已是最新版本');
}

console.log('\n🎉 内部依赖更新完成！');