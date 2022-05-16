import fp from 'fastify-plugin';
import OSS from 'cos-nodejs-sdk-v5';
import appConfig from '../config/app.js';

async function main(fastify, opts) {
    let client = new OSS({
        SecretId: appConfig.tencentOSS.secretId,
        SecretKey: appConfig.tencentOSS.secretKey
    });
    fastify.decorate('tencentOSS', client);
    console.log('tencentOSS已初始化');
}
export default fp(main, { name: 'tencentOSS', dependencies: ['upload'] });
