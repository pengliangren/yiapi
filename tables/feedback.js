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
    merchant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '商户ID',
        defaultValue: 0,
        schema: {
            type: 'integer',
            minimum: 1,
            title: '商户ID'
        }
    },
    goods_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '商品ID',
        defaultValue: 0,
        schema: {
            type: 'integer',
            minimum: 1,
            title: '商品ID'
        }
    },
    content: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: '留言内容',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 500,
            title: '留言内容'
        }
    },
    reply: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: '',
        comment: '回复内容',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 500,
            title: '回复内容'
        }
    }
};
