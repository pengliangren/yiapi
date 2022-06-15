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
    article_id: {
        meta: {
            comment: '文章ID'
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
    title: {
        meta: {
            comment: '标题'
        },
        table: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: ''
        },

        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100
        }
    },
    thumbnail: {
        meta: {
            comment: '轮播图'
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
    comment: '轮播图'
};

export const { tableDescribe, tableName, tableData } = utils.getTableData(import.meta.url, data, option);
