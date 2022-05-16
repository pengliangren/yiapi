import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import * as $tea from '@alicloud/tea-typescript';
import appConfig from '../config/app.js';

export async function sendSMS(phone, code) {
    try {
        let config = new $OpenApi.Config({
            accessKeyId: appConfig.aliyunSMS.accessKeyId,
            accessKeySecret: appConfig.aliyunSMS.accessKeySecret
        });
        // 访问的域名
        config.endpoint = `dysmsapi.aliyuncs.com`;
        let client = new Dysmsapi20170525.default(config);
        let sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
            phoneNumbers: phone,
            signName: '注册验证',
            templateCode: 'SMS_2265050',
            templateParam: JSON.stringify({ code: `【${code}】`, product: '【找货平台】' })
        });
        let res = await client.sendSms(sendSmsRequest);
        return res;
    } catch (err) {
        return err;
    }
}
