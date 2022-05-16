import fp from 'fastify-plugin';
import OSS from 'ali-oss';
import appConfig from '../config/app.js';
async function main(fastify, opts) {
    let client = new OSS({
        accessKeyId: appConfig.aliyunOSS.accessKeyId,
        accessKeySecret: appConfig.aliyunOSS.accessKeySecret,
        region: appConfig.aliyunOSS.region,
        bucket: appConfig.aliyunOSS.bucket
    });
    fastify.decorate('aliyunOSS', client);
    console.log('aliOSS已初始化');
}
export default fp(main, { name: 'aliyunOSS', dependencies: ['upload'] });
