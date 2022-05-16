// 初始化用到的菜单配置，请勿改动
export default {
    mainMenu: [
        {
            name: '用户',
            value: '/user',
            type: 0
        },
        {
            name: '公告',
            value: '/notice',
            type: 0
        },
        {
            name: '反馈',
            value: '/feedback',
            type: 0
        },
        {
            name: '管理',
            value: '/admin',
            type: 0
        },

        {
            name: '权限',
            value: '/permission',
            type: 0
        },
        {
            name: '角色',
            value: '/role',
            type: 0
        },
        {
            name: '轮播图',
            value: '/banner',
            type: 0
        }
    ],
    subMenu: [
        {
            parent: '用户',
            name: '用户列表',
            value: '/user/lists'
        },
        {
            parent: '公告',
            name: '公告列表',
            value: '/notice/lists'
        },
        {
            parent: '广告',
            name: '广告列表',
            value: '/ad/lists'
        },
        {
            parent: '反馈',
            name: '反馈列表',
            value: '/feedback/lists'
        },
        {
            parent: '管理',
            name: '管理员列表',
            value: '/admin/lists'
        },
        {
            parent: '权限',
            name: '菜单列表',
            value: '/permission/menu'
        },
        {
            parent: '权限',
            name: '接口列表',
            value: '/permission/api'
        },
        {
            parent: '角色',
            name: '角色列表',
            value: '/role/lists'
        },
        {
            parent: '轮播图',
            name: '轮播图列表',
            value: '/banner/lists'
        }
    ]
};
