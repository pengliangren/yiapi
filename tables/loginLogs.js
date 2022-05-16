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
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '用户ID',
        schema: {
            type: 'integer',
            minimum: 1,
            title: '用户ID'
        }
    },
    platform: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: '登录平台',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 500,
            title: '登录平台'
        }
    }
};
