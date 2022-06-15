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
    pid: {
        meta: {
            comment: '父级ID'
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
    pids: {
        meta: {
            comment: '父级ID链'
        },
        table: {
            type: DataTypes.STRING(1000),
            allowNull: false,
            defaultValue: '0'
        },
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 1000
        }
    },
    type: {
        meta: {
            comment: '树类型'
        },
        table: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: ''
        },
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 20
        }
    },
    icon: {
        meta: {
            comment: '树图标'
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
    name: {
        meta: {
            comment: '树名称'
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
    value: {
        meta: {
            comment: '树值'
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
    sort: {
        meta: {
            comment: '树排序'
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
    describe: {
        meta: {
            comment: '权限描述'
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
    level: {
        meta: {
            comment: '树层次'
        },
        table: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        },
        schema: {
            type: 'integer',
            minimum: 1
        }
    },
    is_bool: {
        meta: {
            comment: '真假树（0:虚拟的,1:真实的）'
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
    is_open: {
        meta: {
            comment: '是否公开'
        },
        table: {
            type: DataTypes.INTEGER,
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
    comment: '目录'
};

export const { tableDescribe, tableName, tableData } = utils.getTableData(import.meta.url, data, option);
