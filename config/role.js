// 角色初始化配置
export default [
    {
        code: 'visitor',
        name: '游客',
        describe: '具备有限的权限和有限的查看内容'
    },
    {
        code: 'user',
        name: '用户',
        describe: '用户权限和对于的内容查看'
    },
    {
        code: 'merchant',
        name: '商户',
        describe: '商户权限、商品管理、广告竞价等'
    },
    {
        code: 'admin',
        name: '管理',
        describe: '管理权限、除开发相关权限之外的权限等'
    },
    {
        code: 'super',
        name: '超级管理',
        describe: '超级管理权限、除开发相关权限之外的权限等'
    }
];
