/**
 * 树节点的上下文信息
 * @template TreeNode 树节点的类型
 * @template Path 树节点中存储子节点数组的键名
 */
export class TreeContext<
  TreeNode extends object,
  Path extends keyof TreeNode = keyof TreeNode
> {
  constructor(
    props: Partial<TreeContext<TreeNode>> = {},
    opts: {
      path?: Path;
    } = {}
  ) {
    Object.assign(this.opts, opts);
    Object.assign(this, props);
  }

  opts: {
    path?: Path;
  } = {
    path: "children" as Path,
  };

  status?: "skip" | "break";
  depth = 1;
  index = 0;
  node: TreeNode | null = null;
  paths: number[] = [];
  // children: TreeNode[] = [];
  parents: TreeNode[] = [];
  parent: TreeNode | null = null;
  parentCtx: TreeContext<TreeNode, Path> | null = null;

  get children() {
    return this.node && this.opts.path ? this.node[this.opts.path] : null;
  }

  skip() {
    this.status = "skip";
  }

  break() {
    this.status = "break";
  }
}

/**
 * 判断传入的值是否为数组。
 *
 * @param value 要判断的值，可选参数，默认为 undefined。
 * @returns 如果传入的值是数组，则返回 true；否则返回 false。
 */
export function isArrayLike(value?: unknown): value is any[] {
  if (
    value &&
    typeof value === "object" &&
    "slice" in value &&
    typeof value.slice === "function"
  ) {
    return Array.isArray(value.slice(0, 1));
  }
  return false;
}

/**
 * 在树形上下文中遍历父级上下文。
 *
 * @param ctx 起始的上下文或 null。
 * @param walk 遍历每个上下文时要执行的函数。
 * @template T 树形上下文中包含的对象类型。
 */
function walkParentCtx<T extends object>(
  ctx: TreeContext<T> | null,
  walk: (ctx: TreeContext<T>) => void
) {
  while (ctx) {
    walk(ctx);
    ctx = ctx.parentCtx;
  }
}

/**
 * 获取给定上下文及其所有父上下文的路径索引数组。
 *
 * @param srcCtx 源上下文对象或其父上下文的路径索引数组。
 * @returns 返回包含所有父上下文路径索引的数组。
 * @template T 上下文对象的类型，必须是一个对象。
 */
function getPaths<T extends object>(srcCtx: TreeContext<T> | null) {
  const paths: number[] = [];
  walkParentCtx(srcCtx, (ctx) => {
    if (ctx.parent) {
      paths.unshift(ctx.index);
    }
  });
  return paths;
}

/**
 * 获取指定节点及其所有父节点的信息。
 *
 * @param srcCtx 要查询的初始上下文。
 * @returns 返回包含所有父节点信息的数组，按从父节点到根节点的顺序排列。
 * @template T 上下文对象的类型，必须是一个对象。
 */
function getParents<T extends object>(srcCtx: TreeContext<T> | null) {
  const parents: T[] = [];
  walkParentCtx(srcCtx, (ctx) => {
    if (ctx.parent) {
      parents.unshift(ctx.parent);
    }
  });
  return parents;
}

export interface IOption<T, C extends true | false> {
  path?: keyof T;
  needCtx?: C;
}

export type Visit<T extends object, C extends boolean> = (
  node: T,
  ctx: C extends true ? TreeContext<T, keyof T> : null
) => void | boolean;

/**
 * 使用深度优先搜索（DFS）遍历树结构并处理每个节点。
 *
 * @param tree 树结构的根节点或节点数组。
 * @param visit 处理每个节点的回调函数。如果泛型参数 C 为 true，则回调函数的参数包括节点和上下文信息；否则只包括节点。
 * @param options 可选参数，包含遍历路径(path)和是否创建上下文信息(needCtx)的选项。
 * @returns 返回第一个满足条件的节点，或者为 null（如果未找到）。
 *
 * @template T 树节点的类型，必须是一个对象。
 * @template K 树节点中存储子节点数组的键名。
 * @template C 一个布尔值，指示回调函数是否需要上下文信息。默认为 false。
 */
export function dfsTree<T extends object, C extends boolean>(
  tree: T | T[],
  visit: Visit<T, C>,
  options: IOption<T, C> = {
    path: "children" as keyof T,
    needCtx: false as C,
  }
): T | null {
  const { needCtx = false as C, ...opt } = options;

  function dfs(
    tree: T | T[],
    pCtx: null | TreeContext<T, keyof T> = null
  ): T | null {
    if (!tree) {
      return null;
    }
    if (!isArrayLike(tree)) {
      tree = [tree] as T[];
    }

    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      const ctx = new TreeContext<T, keyof T>(
        {
          node,
          index: i,
          parent: pCtx?.node || null,
          parentCtx: pCtx,
          depth: (pCtx?.depth || 0) + 1,
        },
        opt
      );

      if (needCtx) {
        if (!ctx.paths?.length) {
          ctx.paths = getPaths(ctx);
        } else {
          ctx.paths = ctx.paths.concat(ctx.index);
        }

        if (!ctx.parents?.length) {
          ctx.parents = getParents(ctx);
        } else {
          ctx.parents = ctx.parents.concat(ctx.parent!);
        }
        const stop = (visit as Visit<T, true>)(node, ctx);
        if (stop || ctx.status === "break") {
          return node;
        }
        if (ctx.status === "skip") {
          continue;
        }
      } else {
        const stop = (visit as Visit<T, false>)(node, null);
        if (stop) {
          return node;
        }
      }

      if (isArrayLike(ctx.children)) {
        const result = dfs(ctx.children, ctx);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  return dfs(tree, null);
}
