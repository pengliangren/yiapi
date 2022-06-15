// 初始化用到的菜单配置，请勿改动
import path from 'path';
import * as _ from 'lodash-es';
import * as utils from '../utils/index.js';
import { systemConfig } from '../system.js';

let apiRelativePath = utils.relativePath(utils.dirname(import.meta.url), path.resolve(systemConfig.appDir, 'config', 'menu.js'));
let _menuConfig = await utils.importNew(apiRelativePath, []);

const menuConfig = _.concat(
    [
        {
            name: '管理',
            value: '/_admin',
            describe: '管理',
            children: [
                {
                    name: '管理员列表',
                    value: '/admin'
                }
            ]
        },
        {
            name: '公告',
            value: '/_notice',
            describe: '公告',
            children: [
                {
                    name: '公告列表',
                    value: '/notice'
                }
            ]
        },
        {
            name: '轮播',
            value: '/_banner',
            describe: '轮播',
            children: [
                {
                    name: '轮播图列表',
                    value: '/banner'
                }
            ]
        },
        {
            name: '反馈',
            value: '/_feedback',
            describe: '反馈',
            children: [
                {
                    name: '反馈列表',
                    value: '/feedback'
                }
            ]
        },
        {
            name: '角色',
            value: '/_role',
            describe: '角色',
            children: [
                {
                    name: '角色列表',
                    value: '/role'
                }
            ]
        },
        {
            name: '字典',
            value: '/_dictionary',
            describe: '字典',
            children: [
                {
                    name: '字典列表',
                    value: '/dictionary'
                },
                {
                    name: '字典分类',
                    value: '/dictionary/category'
                }
            ]
        },
        {
            name: '目录',
            value: '/_tree',
            describe: '目录',
            children: [
                {
                    name: '目录列表',
                    value: '/tree'
                }
            ]
        }
    ],
    _menuConfig
);

export { menuConfig };
