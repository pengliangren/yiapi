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
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '标题',
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            title: '标题'
        }
    },
    summary: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '摘要',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '摘要'
        }
    },
    recommend_state: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: '推荐状态',
        schema: {
            type: 'number',
            enum: [0, 1],
            title: '推荐状态'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: '正文',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 50000,
            title: '摘要'
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
