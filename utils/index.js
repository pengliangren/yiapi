import path from 'path';
import url from 'url';
import * as _ from 'lodash-es';
import md5 from 'blueimp-md5';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

import { appConfig } from '../config/app.js';
import { apiConfig } from '../config/api.js';

const apiByValue = _.keyBy(apiConfig, 'value');

// 获取文件名（不包括扩展名）
export function getApiInfo(metaUrl) {
    let _filename = filename(metaUrl);
    let _dirname = dirname(metaUrl);
    const pureFileName = path.basename(_filename, '.js');
    let parentDirname = path.relative(path.dirname(_dirname), _dirname);
    let apiData = apiByValue[`/${parentDirname}`];
    return {
        pureFileName: pureFileName,
        parentDirname: apiData ? apiData.name : parentDirname,
        apiPath: `/${parentDirname}/${pureFileName}`
    };
}

// 获取请求的接口路径
export function getApiPath(metaUrl) {
    let apiPath = '/' + path.relative(path.resolve('./apis'), url.fileURLToPath(metaUrl)).replace('.js', '').replace(/\\+/, '/');
    return apiPath;
}

// 清理对象的空数据
export function clearEmptyData(obj, expludeFields = ['id']) {
    let newObj = {};
    _.forOwn(obj, (value, key) => {
        if (value !== null && value !== undefined) {
            newObj[key] = value;
        }
    });
    return _.omit(newObj, expludeFields);
}

// 随机hash值
export function RandomHASH() {
    return md5(nanoid(), appConfig.salt);
}

// 加密md5值
export function MD5(value) {
    return md5(value, appConfig.salt);
}

// 解密MD5值
export function HMAC_MD5(value) {
    return md5(value, appConfig.salt, true);
}

// 获得分页的偏移值
export function getOffset(page, limit) {
    return (page - 1) * limit;
}

export function getDatetime() {
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

export function relativePath(from, to) {
    let _relative = path.relative(from, to);
    let _covertPath = _relative.replace(/\\+/g, '/');

    // 如果第一个不是（.），则自动拼接点
    if (_covertPath.indexOf('.') !== 0) {
        _covertPath = './' + _covertPath;
    }
    return _covertPath;
}

export function filename(metaUrl) {
    return url.fileURLToPath(metaUrl);
}

export function dirname(metaUrl) {
    const filename = url.fileURLToPath(metaUrl);
    return path.dirname(filename);
}

export function existsRole(session, role) {
    return session.role_codes.split(',').includes(role);
}

/**
 * 返回路由地址的路径段
 * @param {String} url 请求路径（不带host）
 * @returns {String} 返回路径字段
 */
export function routerPath(url) {
    let urls = new URL(url, 'http://127.0.0.1');
    let apiPath = urls.pathname;
    return apiPath;
}

/**
 * 检查传参有效性
 */
export function checkApiParams(req) {
    return new Promise((resolve, reject) => {
        let fields = req.body;

        let fieldsParams = _.omit(fields, ['sign']);

        if (_.isEmpty(fieldsParams)) {
            return resolve({ code: 0, msg: '接口未带参数' });
        }

        if (!fieldsParams.t) {
            return reject({ code: 1, msg: '接口请求时间无效' });
        }

        let diffTime = Date.now() - Number(fieldsParams.t);
        if (diffTime > appConfig.apiTimeout) {
            return reject({ code: 1, msg: '接口请求时间已过期' });
        }

        let fieldsArray = [];
        _.forOwn(fieldsParams, (value, key) => {
            fieldsArray.push(`${key}=${value}`);
        });

        let fieldsSort = fieldsArray.sort().join('&');

        let fieldsMd5 = md5(fieldsSort);

        if (fieldsMd5 !== fields.sign) {
            return reject({ code: 1, msg: '接口请求参数校验失败', sign: fieldsMd5 });
        }

        return resolve({ code: 0, msg: '接口参数正常' });
    });
}

export function getTableData(url, data, option) {
    let apiInfo = getApiInfo(url);
    let data2 = {};
    _.forOwn(_.cloneDeep(data), (item, key) => {
        item.table.comment = item.meta.comment;
        item.schema.title = item.meta.comment;
        data2[key] = item;
    });
    return {
        tableName: _.snakeCase(apiInfo.pureFileName),
        tableDescribe: option.comment,
        tableData: data2,
        tableOption: option
    };
}

/**
 * 可控导入
 * @param {String} path 导入路径
 * @param {Any} default 默认值
 */
export async function importNew(path, dv) {
    try {
        const data = await import(path);
        return data;
    } catch (err) {
        return dv;
    }
}
