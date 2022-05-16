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
    type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '字典类型',
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            title: '字典类型'
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '字典名称',
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            title: '字典名称'
        }
    },
    value: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '字典值',
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            title: '字典值'
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
