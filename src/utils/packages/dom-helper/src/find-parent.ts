
export function findParent(
    el: HTMLElement | Range,
    match: (el: HTMLElement) => boolean | undefined,
    {excludeOwn = false} = {}
) {
    let htmlOrNode: HTMLElement | Node | null = null;
    // el支持Range和Element
    if (el instanceof Range) {
        htmlOrNode = el.commonAncestorContainer || el.startContainer;
    }
    let node = (excludeOwn && htmlOrNode) ? htmlOrNode.parentElement : (el as HTMLElement);

    while (node) {
        if (match(node)) {
            return node;
        }

        node = node.parentElement;
    }
    return null;
}
