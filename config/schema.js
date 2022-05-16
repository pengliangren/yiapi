export default {
    // 当前第几页
    id: {
        type: 'integer',
        minimum: 1
    },
    // 当前第几页
    page: {
        type: 'integer',
        minimum: 1,
        default: 1
    },
    // 每页数量
    limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 30
    },
    // 布尔数字
    boolNumber: {
        type: 'integer',
        enum: [0, 1]
    },
    // 数据状态
    state: {
        type: 'integer',
        enum: [0, 1, 2, 3],
        describe: '0 正常 1 禁用 2 删除'
    },
    // 搜索关键字
    string: {
        type: 'string',
        minLength: 0,
        maxLength: 100
    },
    // 搜索关键字
    keywords: {
        type: 'string',
        minLength: 0,
        maxLength: 100
    },
    // 单个图片类型的字段
    image: {
        type: 'string',
        minLength: 0,
        maxLength: 200
    }
};
