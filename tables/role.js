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
    code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: 'column',
        comment: '角色编码',
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 20,
            title: '角色编码'
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '角色名称',
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            title: '角色名称'
        }
    },
    describe: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '角色描述',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '角色描述'
        }
    },
    menu_ids: {
        type: DataTypes.STRING(5000),
        allowNull: false,
        defaultValue: '',
        comment: '角色菜单组',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 5000,
            title: '角色菜单组'
        }
    },
    api_ids: {
        type: DataTypes.STRING(5000),
        allowNull: false,
        defaultValue: '',
        comment: '角色接口组',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 5000,
            title: '角色接口组'
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
