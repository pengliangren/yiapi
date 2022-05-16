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
    uuid: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '唯一ID',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '唯一ID'
        }
    },
    role_codes: {
        type: DataTypes.STRING(2000),
        allowNull: false,
        defaultValue: '',
        comment: '用户角色码组',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 2000,
            title: '用户角色码组'
        }
    },
    account: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: 'column',
        defaultValue: '',
        comment: '用户名',
        schema: {
            type: 'string',
            minLength: 3,
            maxLength: 20,
            title: '用户名'
        }
    },
    password: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '密码',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '密码'
        }
    },
    nickname: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
        comment: '昵称',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 50,
            title: '昵称'
        }
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '手机号',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 20,
            title: '手机号'
        }
    },
    weixin: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '微信号',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 20,
            title: '微信号'
        }
    },
    qq: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: 'QQ号',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 20,
            title: 'QQ号'
        }
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
        comment: '邮箱',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 50,
            title: '邮箱'
        }
    },
    avatar: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '头像',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '头像'
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
