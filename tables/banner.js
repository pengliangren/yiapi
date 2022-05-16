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
    thumbnail: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: '轮播图',
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            title: '轮播图'
        }
    },
    recommend_state: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: '推荐状态',
        schema: {
            type: 'integer',
            enum: [0, 1],
            title: '推荐状态'
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
