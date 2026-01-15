
/**
 * 不重复的随机选择器(不放回抽签)
 * 
 * 支持两种模式：
 * 1. 普通模式：每轮都重新随机选择，可能重复
 * 2. 保持顺序模式：第一轮随机选择，后续按第一轮顺序循环
 * 
 * @template T 元素类型，默认为string
 * @example
 * // 普通模式
 * const selector = new NonRepeatRandomSelector(['A', 'B', 'C']);
 * 
 * // 保持顺序模式
 * const selector = new NonRepeatRandomSelector(['A', 'B', 'C'], { preserveOrder: true });
 */
export class NonRepeatRandomSelector<T = string> {
    /**
     * 当前可用的索引数组，存储尚未选择的元素索引
     * 在非保持顺序模式下，每轮结束后会重置；在保持顺序模式下，只在第一轮使用
     */
    private availableIndices: number[];

    /**
     * 原始元素列表，用于根据索引获取实际元素
     */
    private readonly list: readonly T[];

    /**
     * 是否开启保持顺序模式
     * true: 第一轮随机选择，后续按第一轮顺序循环
     * false: 每轮都重新随机选择
     */
    private preserveOrder = false;

    /**
     * 固定顺序数组，仅在保持顺序模式下使用
     * 记录第一轮随机选择的顺序，用于后续轮次的循环选择
     */
    private fixedOrder: number[] | null = null;

    /**
     * 当前在固定顺序数组中的索引位置
     * 用于跟踪下一轮选择应在 fixedOrder 中的哪个位置开始
     */
    private currentOrderIndex = 0;

    /**
     * 创建单轮不重复随机选择器实例
     * 
     * @param list - 要随机选择的元素列表，必须是非空数组
     * @param options - 配置选项
     * @param options.preserveOrder - 是否开启保持顺序模式，默认为false
     * @throws {Error} 当列表为空或不是数组时抛出错误
     */
    constructor(list: readonly T[], options: { preserveOrder?: boolean } = {}) {
        // 验证输入参数，确保列表有效
        if (!Array.isArray(list) || list.length === 0) {
            throw new Error('NonRepeatRandomSelector: list must be a non-empty array');
        }
        this.list = list;
        this.preserveOrder = options.preserveOrder || false;
        // 初始化可用索引数组
        this.availableIndices = Array.from({length: list.length}, (_, i) => i);
    }

    /**
     * 获取下一个随机元素
     * 
     * @returns 选择的元素
     * 
     * @example
     * ```typescript
     * const selector = new NonRepeatRandomSelector(['A', 'B', 'C'], { preserveOrder: true });
     * 
     * // 第一轮：随机选择（如 C, A, B）
     * console.log(selector.getRandom()); // C
     * console.log(selector.getRandom()); // A  
     * console.log(selector.getRandom()); // B
     * 
     * // 第二轮：按第一轮顺序循环（C, A, B 循环）
     * console.log(selector.getRandom()); // C
     * console.log(selector.getRandom()); // A
     * console.log(selector.getRandom()); // B
     * console.log(selector.getRandom()); // 再次 C
     * ```
     */
    getRandom(): T {
        // 如果开启了保持顺序模式且固定顺序已确定
        if (this.preserveOrder && this.fixedOrder && this.fixedOrder.length === this.list.length) {
            const selectedIndex = this.fixedOrder[this.currentOrderIndex];
            this.currentOrderIndex = (this.currentOrderIndex + 1) % this.fixedOrder.length;
            return this.list[selectedIndex];
        }
        
        // 随机选择一个索引
        const randomIndex = Math.random() * this.availableIndices.length | 0;
        const selectedIndex = this.availableIndices[randomIndex];
        
        // 移除已选择的索引，使用交换+pop避免O(n)的开销
        this.availableIndices[randomIndex] = this.availableIndices[this.availableIndices.length - 1];
        this.availableIndices.pop();
        
        // 如果开启了保持顺序模式，记录第一轮的实际选择顺序
        if (this.preserveOrder) {
            if (!this.fixedOrder) {
                this.fixedOrder = [];
            }
            this.fixedOrder.push(selectedIndex);
        }
        // 如果已经用完所有选项，只在非保持顺序模式下重置
        if (this.availableIndices.length === 0 && !this.preserveOrder) {
            this.availableIndices = Array.from({length: this.list.length}, (_, i) => i);
        }
        
        return this.list[selectedIndex];
    }

    /**
     * 获取已使用过的项目数量
     */
    getUsedCount(): number {
        return this.list.length - this.availableIndices.length;
    }

    /**
     * 获取剩余未使用过的项目数量
     */
    getRemainingCount(): number {
        return this.availableIndices.length;
    }

    /**
     * 获取总项目数量
     */
    getTotalCount(): number {
        return this.list.length;
    }

    /**
     * 是否已经使用过所有项目
     */
    isExhausted(): boolean {
        return this.availableIndices.length === 0;
    }

    /**
     * 是否已确定固定顺序（仅在preserveOrder模式下有效）
     */
    hasFixedOrder(): boolean {
        return !!this.fixedOrder && this.fixedOrder.length === this.list.length;
    }

    /**
     * 获取当前的固定顺序（仅在preserveOrder模式下有效）
     */
    getFixedOrder(): number[] | null {
        return this.fixedOrder || null;
    }

    /**
     * 手动重置选择器状态
     */
    reset(): void {
        this.availableIndices = Array.from({length: this.list.length}, (_, i) => i);
        this.fixedOrder = null;
        this.currentOrderIndex = 0;
    }
}
