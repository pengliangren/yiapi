import { DataTypes } from 'sequelize';
import * as utils from '../utils/index.js';

const data = {
    id: {
        meta: {
            comment: '自增'
        },
        table: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        schema: {
            type: 'integer',
            minimum: 1
        }
    },
    publisher_id: {
        meta: {
            comment: '发布者ID'
        },
        table: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        schema: {
            type: 'integer',
            minimum: 1
        }
    },
    title: {
        meta: {
            comment: '标题'
        },
        table: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100
        }
    },

    summary: {
        meta: {
            comment: '摘要'
        },
        table: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200
        }
    },
    thumbnail: {
        meta: {
            comment: '缩略图'
        },
        table: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 200
        }
    },
    views: {
        meta: {
            comment: '浏览人数'
        },
        table: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        schema: {
            type: 'integer',
            minimum: 0
        }
    },
    content: {
        meta: {
            comment: '正文'
        },
        table: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 50000
        }
    },
    recommend_state: {
        meta: {
            comment: '推荐状态'
        },
        table: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        schema: {
            type: 'integer',
            enum: [0, 1]
        }
    },
    state: {
        meta: {
            comment: '状态'
        },
        table: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        schema: {
            type: 'integer',
            enum: [0, 1, 2]
        }
    }
};

const option = {
    comment: '公告'
};

export const { tableDescribe, tableName, tableData } = utils.getTableData(import.meta.url, data, option);
