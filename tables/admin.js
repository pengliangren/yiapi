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
    uuid: {
        meta: {
            comment: '唯一ID'
        },
        table: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200
        }
    },
    role_codes: {
        meta: {
            comment: '用户角色码组'
        },
        table: {
            type: DataTypes.STRING(2000),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 2000
        }
    },
    account: {
        meta: {
            comment: '用户名'
        },
        table: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: 'column',
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 3,
            maxLength: 20
        }
    },
    password: {
        meta: {
            comment: '密码'
        },
        table: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200
        }
    },
    nickname: {
        meta: {
            comment: '昵称'
        },
        table: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 50
        }
    },
    phone: {
        meta: {
            comment: '手机号'
        },
        table: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 20
        }
    },
    weixin: {
        meta: {
            comment: '微信号'
        },
        table: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 20
        }
    },
    qq: {
        meta: {
            comment: 'QQ号'
        },
        table: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 20
        }
    },
    email: {
        meta: {
            comment: '邮箱'
        },
        table: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 50
        }
    },
    avatar: {
        meta: {
            comment: '头像'
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
            enum: [0, 1, 2],
            title: '状态'
        }
    }
};

const option = {
    comment: '管理员'
};

export const { tableDescribe, tableName, tableData } = utils.getTableData(import.meta.url, data, option);
