import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const systemConfig = {
    appDir: process.cwd(),
    yiapiDir: __dirname
};

export { systemConfig };
