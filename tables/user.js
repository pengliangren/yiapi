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
            minLength: 1,
            maxLength: 200,
            title: '唯一ID'
        }
    },
    username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '用户名',
        schema: {
            type: 'string',
            minLength: 0,
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
            minLength: 6,
            maxLength: 200,
            title: '密码'
        }
    },
    realname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
        comment: '真实姓名',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 20,
            title: '真实姓名'
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
            minLength: 11,
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
            maxLength: 30,
            title: '微信号'
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
    views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '浏览量',
        schema: {
            type: 'integer',
            minimum: 0,
            title: '浏览量'
        }
    },
    role_codes: {
        type: DataTypes.STRING(2000),
        allowNull: false,
        defaultValue: 'visitor',
        comment: '角色码组(默认是游客角色)',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 1000,
            title: '角色码组'
        }
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '关注人数',
        schema: {
            type: 'integer',
            minimum: 0,
            title: '关注人数'
        }
    },
    audit_state: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: '审核状态（0:未审核,1:审核中,2:已通过,3:已拒绝）',
        schema: {
            type: 'integer',
            enum: [0, 1, 2, 3],
            title: '审核状态'
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
