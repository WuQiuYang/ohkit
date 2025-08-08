# Contributing to Ohkit!

## Intro
**Ohkit**(you can understand it as **one handy kit** or **oh! kit!**) is a collection of web frontend components and utils, designed to simplify the development process.

## About Next.js

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
# 安装依赖
lerna bootstrap

# 同时启动 Next.js 和 Storybook 开发服务器
npm run site

# 或者只启动 Next.js 开发服务器（使用 Turbopack）
npm run dev
# 或
npm run dev:next

# 或者只启动 Storybook 开发服务器
npm run dev:storybook

# 或者并行运行所有组件的开发模式
npm run dev:lerna

# 构建所有包
npm run build:lerna

# 构建指定的包 eg: npm run build:lerna -- --scope @ohkit/text-ellipsis
npm run build:lerna -- --scope {{package-name}}
```

在浏览器中打开以下地址查看结果：
- Next.js 应用：[http://localhost:3000](http://localhost:3000)
- Storybook：[http://localhost:6006](http://localhost:6006)

# 其他可能用到的常用命令
- `lerna clean`: 清理所有包的 node_modules 目录
- `lerna run clean`: 清理所有组件的构建产物（实际上执行每个包内的 `npm run clean` 命令）


You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
