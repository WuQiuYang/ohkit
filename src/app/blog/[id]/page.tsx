import Layout from '../../components/Layout'
import { MDXRemote } from 'next-mdx-remote/rsc'
import './style.scss'

const posts = {
  '1': `
# React Hooks 最佳实践

React Hooks 是 React 16.8 中添加的新特性。它们让你不用编写 class 就能使用状态和其他的 React 特性。以下是一些 React Hooks 的最佳实践：

## 1. 使用多个 useState 而不是一个对象

不好的做法：

\`\`\`jsx
const [state, setState] = useState({ name: '', age: 0 });
\`\`\`

好的做法：

\`\`\`jsx
const [name, setName] = useState('');
const [age, setAge] = useState(0);
\`\`\`

## 2. 使用 useCallback 优化性能

当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 \`shouldComponentUpdate\`）的子组件时，它将非常有用。

\`\`\`jsx
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
\`\`\`

## 3. 使用 useMemo 优化计算性能

\`\`\`jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
\`\`\`

这些只是 React Hooks 最佳实践的一小部分。随着你对 Hooks 的深入了解，你会发现更多优化和使用技巧。
`,
  '2': `
# Next.js 13 新特性解析

Next.js 13 带来了许多激动人心的新特性，大大提升了开发体验和应用性能。以下是一些主要的新特性：

## 1. 新的 app 目录

Next.js 13 引入了一个新的 \`app\` 目录，它使用了基于文件系统的路由，并支持共享布局。这个新的目录结构提供了更好的代码组织和更直观的路由定义。

## 2. 服务器组件

服务器组件允许你在服务器上渲染复杂的组件，减少发送到客户端的 JavaScript 数量，从而提高性能。

## 3. 流式渲染

Next.js 13 支持流式渲染，这意味着你可以逐步渲染页面内容，而不是等待所有数据都加载完毕。这可以显著提高大型页面的加载速度和用户体验。

## 4. 新的图像组件

新的 Image 组件提供了更好的性能和更简单的 API，使得优化图像变得更加容易。

## 5. 改进的字体系统

Next.js 13 引入了一个新的字体系统，它可以自动优化和加载自定义字体，无需额外的配置。

这些新特性使得 Next.js 13 成为一个更强大、更灵活的 React 框架。随着你深入使用，你会发现更多令人兴奋的改进和优化。
`,
  '3': `
# TypeScript 高级技巧

TypeScript 是 JavaScript 的超集，它添加了静态类型检查和其他功能，使得开发大型应用程序变得更加容易。以下是一些 TypeScript 的高级技巧：

## 1. 条件类型

条件类型允许你根据某个类型的特征来决定最终的类型。

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;

type WithArray = IsArray<string[]>;  // true
type WithoutArray = IsArray<number>;  // false
\`\`\`

## 2. 映射类型

映射类型允许你基于旧类型创建新类型。

\`\`\`typescript
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

interface Todo {
    title: string;
    description: string;
}

type ReadonlyTodo = Readonly<Todo>;
\`\`\`

## 3. 类型推断在泛型中的应用

TypeScript 的类型推断可以在泛型中发挥强大作用，减少冗余代码。

\`\`\`typescript
function identity<T>(arg: T): T {
    return arg;
}

let output = identity("myString");  // 类型被推断为 string
\`\`\`

## 4. 联合类型和类型守卫

联合类型允许一个值为多种类型之一，而类型守卫帮助你在运行时确定具体类型。

\`\`\`typescript
type StringOrNumber = string | number;

function printId(id: StringOrNumber) {
    if (typeof id === "string") {
        console.log(id.toUpperCase());
    } else {
        console.log(id);
    }
}
\`\`\`

## 5. 高级的 keyof 和 typeof

\`keyof\` 和 \`typeof\` 操作符可以用来创建更灵活和可重用的类型。

\`\`\`typescript
const colors = {
    red: "#FF0000",
    green: "#00FF00",
    blue: "#0000FF"
};

type Colors = keyof typeof colors;  // "red" | "green" | "blue"
\`\`\`

这些高级技巧可以帮助你更好地利用 TypeScript 的类型系统，编写更安全、更可维护的代码。随着你对 TypeScript 的深入学习，你会发现更多强大的特性和用法。
`
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  const post = posts[id as keyof typeof posts]

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <Layout>
      <div className="md-container max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <MDXRemote source={post} />
      </div>
    </Layout>
  )
}

