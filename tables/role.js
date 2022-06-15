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
    code: {
        meta: {
            comment: '角色编码'
        },
        table: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: 'column'
        },
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 20
        }
    },
    name: {
        meta: {
            comment: '角色名称'
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
    describe: {
        meta: {
            comment: '角色描述'
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
    menu_ids: {
        meta: {
            comment: '角色菜单组'
        },
        table: {
            type: DataTypes.STRING(5000),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 5000
        }
    },
    api_ids: {
        meta: {
            comment: '角色接口组'
        },
        table: {
            type: DataTypes.STRING(5000),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 5000
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
    comment: '角色'
};

export const { tableDescribe, tableName, tableData } = utils.getTableData(import.meta.url, data, option);
