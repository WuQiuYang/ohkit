// tree test data
export const MockDataList = [
    {
        id: 10001,
        label: 'tree center 0',
        openLeft: false,
        leftNum: 3,
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
        ]
    },
    {
        id: 10002,
        label: 'tree center 1',
        openLeft: false,
        leftNum: 2,
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
                openRight: false,
                rightNum: 0,
                right: []
            }
        ]
    }
];
