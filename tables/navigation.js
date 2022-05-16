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
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '分类ID',
        schema: {
            type: 'integer',
            minimum: 1,
            title: '分类ID'
        }
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: '导航名称',
        schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            title: '导航名称'
        }
    },
    thumbnail: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '缩略图',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '缩略图'
        }
    },
    link: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '导航地址',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '导航地址'
        }
    },
    describe: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: '',
        comment: '导航描述',
        schema: {
            type: 'string',
            minLength: 0,
            maxLength: 200,
            title: '导航描述'
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
