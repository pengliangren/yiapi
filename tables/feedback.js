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
    user_id: {
        meta: {
            comment: '用户ID'
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
    merchant_id: {
        meta: {
            comment: '商户ID'
        },
        table: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        schema: {
            type: 'integer',
            minimum: 1
        }
    },
    goods_id: {
        meta: {
            comment: '商品ID'
        },
        table: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        schema: {
            type: 'integer',
            minimum: 1
        }
    },
    content: {
        meta: {
            comment: '留言内容'
        },
        table: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 500
        }
    },
    reply: {
        meta: {
            comment: '回复内容'
        },
        table: {
            type: DataTypes.STRING(500),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 500
        }
    }
};

const option = {
    comment: '反馈'
};

export const { tableDescribe, tableName, tableData } = utils.getTableData(import.meta.url, data, option);
