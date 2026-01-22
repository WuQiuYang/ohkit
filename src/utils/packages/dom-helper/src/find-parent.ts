export interface IFindParentOption<P extends 'parentElement' | 'parentNode' = 'parentElement'> {
    /**
     * 父元素类型
     * @default 'parentElement'
     */
    parentType?: P;
    /**
     * 是否排除自身
     * @default false
     */
    excludeOwn?: boolean;
}

export type ParentType<P extends 'parentElement' | 'parentNode'> = P extends 'parentElement' ? HTMLElement : ParentNode;

/**
 * 在 DOM 树中向上查找符合条件的父元素
 * 
 * @param el - 起始元素或 Range 对象
 * @param match - 匹配函数，返回 true 表示找到符合条件的父元素
 * @param options - 查找选项，可选参数
 * @param options.parentType - 父元素类型，默认为 'parentElement'
 * @param options.excludeOwn - 是否排除自身，默认为 false
 * @returns 符合条件的父元素，如果未找到则返回 null
 */
export function findParent<P extends 'parentElement' | 'parentNode' = 'parentElement'>(
    el: HTMLElement | Range | null,
    match: (el: ParentType<P>) => boolean | undefined,
    {parentType = 'parentElement' as P, excludeOwn = false}: IFindParentOption<P> = {}
): ParentType<P> | null {
    let node: HTMLElement | ParentNode | null = null;
    if (!el) {
        return null;
    }
    // el支持Range和Element
    if (el instanceof Range) {
        const htmlOrNode = el.commonAncestorContainer || el.startContainer;
        node = htmlOrNode[parentType];
    } else {
        node = excludeOwn ? el[parentType] : el;
    }

    while (node) {
        if (match(node as ParentType<P>)) {
            return node as ParentType<P>;
        }

        node = node[parentType];
    }
    return null;
}
