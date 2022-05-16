import { resolve } from 'path';
import { fn_dirname } from '../utils/index.js';
export default {
    // 应用名称
    appname: 'yicode后台管理模板',
    md5Key: 'yicode-template-vue2-admin-123456.',
    // 根目录
    rootDir: resolve(fn_dirname(import.meta.url), '..'),
    // 监听端口
    port: 3000,
    // 监听主机
    host: '127.0.0.1',
    // 插件配置
    plugin: [''],
    // 默认开发管理员密码
    devPassword: 'dev123456!@#',
    // 接口超时 3 分钟
    apiTimeout: 3 * 60 * 1000,
    // 阿里云短信发送
    aliyunSMS: {
        accessKeyId: 'LTAI5tKpFsKADTuTJeUros7M',
        accessKeySecret: 'bOQNrAVnHtHArHzdxeqIitzWjNsdQg'
    },
    // 阿里云OSS对象存储
    aliyunOSS: {
        accessKeyId: 'LTAI5tPQii9UV44p5KkQykQZ',
        accessKeySecret: 'BqUCr3Her5iiDychF2Cf7meRtMOB7C',
        region: 'oss-cn-beijing',
        bucket: 'findgoods'
    },
    // 腾讯云OSS对象存储
    tencentOSS: {
        secretId: 'AKIDUKtDH7zxqW05vVGsnSr1zh8MLBli7CKB',
        secretKey: 'jKipXy3tUpxtYy8ByVVUDfW9NLQGXYFi',
        region: 'ap-hongkong',
        bucket: 'find-goods-1251319172'
    },
    // 不需要鉴权的接口
    whiteLists: [
        //
        '/',
        '/admin/login',
        '/user/login',
        '/user/register'
    ]
};
