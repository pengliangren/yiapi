import { resolve, basename, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { forOwn as _forOwn, omit as _omit, isEmpty as _isEmpty, toUpper as _toUpper } from 'lodash-es';
import md5 from 'blueimp-md5';
import appConfig from '../config/app.js';
import dayjs from 'dayjs';

// 获取文件名（不包括扩展名）
export function fn_getFileInfos(metaUrl) {
    let _filename = fn_filename(metaUrl);
    let _dirname = fn_dirname(metaUrl);
    const pureFileName = basename(_filename, '.js');
    return {
        pureFileName: pureFileName,
        parentDirname: relative(dirname(_dirname), _dirname)
    };
}

export function fn_getApiPath(metaUrl) {
    let apiPath = '/' + relative(resolve('./apis'), fileURLToPath(metaUrl)).replace('.js', '').replace(/\\+/, '/');
    return apiPath;
}

// 清理对象的空数据
export function fn_clearEmptyData(obj, expludeFields = ['id']) {
    let newObj = {};
    _forOwn(obj, (value, key) => {
        if (value !== null && value !== undefined) {
            newObj[key] = value;
        }
    });
    return _omit(newObj, expludeFields);
}

// 加密md5值
export function fn_MD5(value) {
    return md5(value, appConfig.md5Key);
}

// 解密MD5值
export function fn_HMAC_MD5(value) {
    return md5(value, appConfig.md5Key, true);
}

// 获得分页的偏移值
export function fn_getOffset(page, limit) {
    return (page - 1) * limit;
}

export function fn_getDatetime() {
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

export function fn_relativePath(from, to) {
    let _relative = relative(from, to);
    let _covertPath = _relative.replace(/\\+/g, '/');

    // 如果第一个不是（.），则自动拼接点
    if (_covertPath.indexOf('.') !== 0) {
        _covertPath = './' + _covertPath;
    }
    return _covertPath;
}

export function fn_filename(metaUrl) {
    return fileURLToPath(metaUrl);
}

export function fn_dirname(metaUrl) {
    const filename = fileURLToPath(metaUrl);
    return dirname(filename);
}

export function fn_existsRole(session, role) {
    return session.role_codes.split(',').includes(role);
}

/**
 * 返回路由地址的路径段
 * @param {String} url 请求路径（不带host）
 * @returns {String} 返回路径字段
 */
export function fn_routerPath(url) {
    let apiPath = new URL(url, 'http://127.0.0.1').pathname;
    return apiPath;
}

/**
 * 检查传参有效性
 */
export function fn_checkParams(req) {
    return new Promise((resolve, reject) => {
        let fields = {};

        // 判断接口是否超时
        if (_toUpper(req.method) === 'GET') {
            fields = req.query;
        }
        if (_toUpper(req.method) === 'POST') {
            fields = req.body;
        }
        // console.log('======================================');
        // console.log(req.method);
        // console.log('🚀 ~ file: index.js ~ line 94 ~ returnnewPromise ~ fields', fields);

        let fieldsParams = _omit(fields, ['sign']);

        if (_isEmpty(fieldsParams)) {
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
        _forOwn(fieldsParams, (value, key) => {
            fieldsArray.push(`${key}=${value}`);
        });

        let fieldsSort = fieldsArray.sort().join('&');

        let fieldsMd5 = md5(fieldsSort);

        if (fieldsMd5 !== fields.sign) {
            return reject({ code: 1, msg: '接口请求参数校验失败' });
        }

        return resolve({ code: 0, msg: '接口参数正常' });
    });
}
