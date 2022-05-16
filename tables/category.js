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
        comment: '分类名称',
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            title: '分类名称'
        }
    },
    icon: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '分类图标',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '分类图标'
        }
    },
    value: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '分类值',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '分类值'
        }
    },
    clicks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '点击数',
        schema: {
            type: 'integer',
            minimum: 0,
            title: '点击数'
        }
    },
    sort: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '分类排序',
        schema: {
            type: 'integer',
            minimum: 0,
            title: '分类排序'
        }
    },
    describe: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '分类描述',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '分类描述'
        }
    },
    level: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '分类等级',
        schema: {
            type: 'integer',
            minimum: 1,
            title: '分类等级'
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
