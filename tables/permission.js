import { DataTypes } from 'sequelize';

export default {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '自增',
        schema: {
            type: 'integer',
            minimum: 1,
            title: '自增'
        }
    },
    pid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '父级ID',
        schema: {
            type: 'integer',
            minimum: 0,
            title: '父级ID'
        }
    },
    pids: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        defaultValue: '0',
        comment: '父级ID链',
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 1000,
            title: '父级ID链'
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '权限名称',
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            title: '权限名称'
        }
    },
    icon: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '权限图标',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '权限图标'
        }
    },
    value: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '权限值',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '权限值'
        }
    },
    sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '权限排序',
        schema: {
            type: 'integer',
            minimum: 0,
            title: '权限排序'
        }
    },
    describe: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '权限描述',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '权限描述'
        }
    },
    level: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '权限等级',
        schema: {
            type: 'integer',
            minimum: 1,
            title: '权限等级'
        }
    },
    tag: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: '',
        comment: '权限标签',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 10,
            title: '权限标签'
        }
    },
    type: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: '权限类型（0:虚拟的,1:真实的）',
        schema: {
            type: 'integer',
            minimum: 1,
            title: '权限类型'
        }
    },
    is_open: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '是否为开放接口',
        schema: {
            type: 'integer',
            enum: [0, 1],
            title: '是否为开放接口'
        }
    },
    state: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: '状态',
        schema: {
            type: 'integer',
            enum: [0, 1, 2],
            title: '状态'
        }
    }
};
