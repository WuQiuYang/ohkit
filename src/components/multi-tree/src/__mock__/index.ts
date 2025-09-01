// tree test data
export const MockDataList = [
    {
        id: '10001',
        label: 'tree center 0',
        openLeft: false,
        leftNum: 3,
        leftVirtualNum: 0,
        left: [
            // left tree
            {
                id: -101,
                label: 'left top',
                openLeft: false,
                leftNum: 0,
                left: []
            },
            {
                id: -102,
                label: 'left middle',
                openLeft: false,
                leftNum: 0,
                left: []
            },
            {
                id: -103,
                label: 'left bottom',
                openLeft: false,
                leftNum: 0,
                left: []
            }
        ],
        openRight: true,
        rightNum: 2,
        rightVirtualNum: 0,
        right: [
            // right tree
            {
                id: 101,
                label: 'right top',
                openRight: false,
                rightNum: 0,
                right: []
            },
            {
                id: 102,
                label: 'right bottom',
                openRight: false,
                rightNum: 0,
                right: []
            }
        ],
        isVirtual: false
    },
    {
        id: '10002',
        label: 'tree center 1',
        openLeft: false,
        leftNum: 2,
        leftVirtualNum: 0,
        left: [
            // left tree
            {
                id: -1001,
                label: 'left top',
                openLeft: false,
                leftNum: 2,
                left: [
                    {
                        id: -2001,
                        label: 'left top',
                        openLeft: false,
                        leftNum: 0,
                        left: []
                    },
                    {
                        id: -2002,
                        label: 'left bottom',
                        openLeft: false,
                        leftNum: 0,
                        left: []
                    }
                ]
            },
            {
                id: -1002,
                label: 'left bottom',
                openLeft: false,
                isVirtual: false,
                leftNum: 2,
                left: [
                    {
                        id: -2001,
                        label: 'left top',
                        openLeft: false,
                        leftNum: 0,
                        left: []
                    },
                    {
                        id: -2002,
                        label: 'left bottom',
                        openLeft: false,
                        leftNum: 0,
                        left: []
                    }
                ]
            }
        ],
        openRight: false,
        rightNum: 2,
        rightVirtualNum: 0,
        right: [
            // right tree
            {
                id: 1001,
                label: 'right top',
                openRight: false,
                rightNum: 0,
                right: []
            },
            {
                id: 1002,
                label: 'right bottom',
                openRight: true,
                rightNum: 0,
                right: []
            }
        ]
    }
];

export type TyMockDataList = typeof MockDataList;

export function getMockDataList() {
    return JSON.parse(JSON.stringify(MockDataList)) as TyMockDataList;
}

function getEasyUniKey() {
  return (Math.random() * 1000000) | 0;
};


export const getZeroNineRange = () => Math.random() * 10 | 0; // 0 ~ 9

const heightRange = [40, 60, 100, 150, 200];

export const getNodeHeight = () => heightRange[Math.floor(getZeroNineRange() / 2)];

export async function fetchChildren<T extends TyMockDataList[number] = TyMockDataList[number]>(node: T, direction: 'left' | 'right', injectProps = {}) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const num = node[`${direction}Num`] || 0;
      const vNum = node[`${direction}VirtualNum`] || 0;
      return Array((num + vNum) || 3).fill(0).map((_, i) => {
        const isVirtual = getZeroNineRange() > 2 && i < vNum;
        return {
            id: `${getEasyUniKey()}-${direction}-${i}`,
            label: `${direction === 'left' ? '左' : '右'}分支-${i+1}`,
            leftNum: Math.floor(getZeroNineRange() / 3),
            rightNum: Math.floor(getZeroNineRange() / 3),
            leftVirtualNum: Math.floor(getZeroNineRange() / 4),
            rightVirtualNum: Math.floor(getZeroNineRange() / 4),
            openLeft: false,
            openRight: false,
            left: [],
            right: [],
            isVirtual,
            ...injectProps
        };
      });
}
