import { join } from 'path';
import { fn_dirname } from './utils/index.js';

// yicode命令路径
export const rootDir = join(fn_dirname(import.meta.url));

// 项目根目录路径
export const cwdDir = join(process.cwd());
