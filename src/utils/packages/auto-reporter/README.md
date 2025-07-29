# auto-reporter

**数据变更自动上报器**
 * 适用于自动保存、操作频次埋点等场景（综合考虑时长与频率）

## Installation

```bash
npm install @ohkit/auto-reporter
```

## Usage

```typescript
import { AutoReporter, AutoReporterConstructorProps } from '@ohkit/auto-reporter';

const autoReporter = new AutoReporter({
    onReport: async () => {
        console.log('report');
        // maybe promise
        await new Promise((resolve) => setTimeout(resolve, 2000));
    },
    // beforeUploadConfirm: true,
    // reportPipe: true,
});

autoReporter.change();
// autoReporter.flush();
// autoReporter.reset();

```
