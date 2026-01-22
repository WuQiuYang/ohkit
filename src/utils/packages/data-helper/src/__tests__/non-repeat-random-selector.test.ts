import { NonRepeatRandomSelector } from '../non-repeat-random-selector';

describe('NonRepeatRandomSelector', () => {
  describe('普通模式', () => {
    it('应该正确初始化', () => {
      const selector = new NonRepeatRandomSelector(['A', 'B', 'C']);
      expect(selector.getTotalCount()).toBe(3);
      expect(selector.getRemainingCount()).toBe(3);
      expect(selector.getUsedCount()).toBe(0);
      expect(selector.isExhausted()).toBe(false);
    });

    it('应该在不重复的情况下选择所有项目', () => {
      const items = ['A', 'B', 'C', 'D'];
      const selector = new NonRepeatRandomSelector(items);
      const selected: string[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = selector.getRandom();
        expect(selected).not.toContain(item);
        selected.push(item);
      }

      expect(selected).toHaveLength(items.length);
      expect(selector.isExhausted()).toBe(false); // 普通模式下会自动重置
    });

    it('选择所有项目后应该重置', () => {
      const items = ['A', 'B'];
      const selector = new NonRepeatRandomSelector(items);
      
      // 第一轮选择
      const firstItem = selector.getRandom();
      expect(selector.isExhausted()).toBe(false);
      
      const secondItem = selector.getRandom();
      expect(selector.isExhausted()).toBe(false); // 普通模式下会自动重置
      
      // 第三轮选择（已经重置）
      const thirdItem = selector.getRandom();
      expect(items).toContain(thirdItem);
      expect(new Set([firstItem, secondItem, thirdItem]).size).toBe(2); // 可能出现重复
    });

    it('应该抛出错误当列表为空', () => {
      expect(() => new NonRepeatRandomSelector([])).toThrow('NonRepeatRandomSelector: list must be a non-empty array');
    });
  });

  describe('保持顺序模式', () => {
    it('应该在第一轮确定固定顺序', () => {
      const items = ['A', 'B', 'C'];
      const selector = new NonRepeatRandomSelector(items, { preserveOrder: true });
      
      expect(selector.hasFixedOrder()).toBe(false);
      
      // 选择所有项目
      for (let i = 0; i < items.length; i++) {
        selector.getRandom();
      }
      
      expect(selector.hasFixedOrder()).toBe(true);
      expect(selector.getFixedOrder()).toHaveLength(items.length);
    });

    it('应该在后续轮次中按固定顺序循环', () => {
      const items = ['A', 'B', 'C'];
      const selector = new NonRepeatRandomSelector(items, { preserveOrder: true });
      
      // 第一轮：确定顺序
      const firstRound: string[] = [];
      for (let i = 0; i < items.length; i++) {
        firstRound.push(selector.getRandom());
      }
      
      // 第二轮：应该按第一轮顺序循环
      for (let i = 0; i < items.length * 2; i++) {
        const expectedIndex = i % items.length;
        const expectedItem = firstRound[expectedIndex];
        const actualItem = selector.getRandom();
        expect(actualItem).toBe(expectedItem);
      }
    });

    it('重置后应该清除固定顺序', () => {
      const items = ['A', 'B', 'C'];
      const selector = new NonRepeatRandomSelector(items, { preserveOrder: true });
      
      // 确定固定顺序
      for (let i = 0; i < items.length; i++) {
        selector.getRandom();
      }
      expect(selector.hasFixedOrder()).toBe(true);
      
      // 重置
      selector.reset();
      expect(selector.hasFixedOrder()).toBe(false);
      expect(selector.getRemainingCount()).toBe(items.length);
    });
  });

  describe('统计功能', () => {
    it('应该正确统计已使用和剩余数量', () => {
      const items = ['A', 'B', 'C', 'D'];
      const selector = new NonRepeatRandomSelector(items);
      
      expect(selector.getUsedCount()).toBe(0);
      expect(selector.getRemainingCount()).toBe(4);
      
      selector.getRandom();
      expect(selector.getUsedCount()).toBe(1);
      expect(selector.getRemainingCount()).toBe(3);
      
      selector.getRandom();
      expect(selector.getUsedCount()).toBe(2);
      expect(selector.getRemainingCount()).toBe(2);
    });
  });

  describe('实际应用场景测试', () => {
    it('团队任务分配场景', () => {
      const teamMembers = ['张三', '李四', '王五'];
      const selector = new NonRepeatRandomSelector(teamMembers, { preserveOrder: true });
      
      // 第一周分配
      const week1: string[] = [];
      for (let i = 0; i < teamMembers.length; i++) {
        week1.push(selector.getRandom());
      }
      
      // 第二周应该按第一周顺序
      for (let i = 0; i < teamMembers.length; i++) {
        const member = selector.getRandom();
        expect(member).toBe(week1[i]);
      }
    });

    it('课堂提问场景', () => {
      const students = ['小明', '小红', '小刚', '小丽'];
      const selector = new NonRepeatRandomSelector(students);
      
      // 第一轮提问3个学生
      const round1: string[] = [];
      for (let i = 0; i < 3; i++) {
        round1.push(selector.getRandom());
      }
      
      expect(round1).toHaveLength(3);
      expect(new Set(round1).size).toBe(3); // 确保不重复
      
      // 重置后开始第二轮
      selector.reset();
      const round2: string[] = [];
      for (let i = 0; i < 3; i++) {
        round2.push(selector.getRandom());
      }
      expect(new Set(round2).size).toBe(3);
    });
  });
});