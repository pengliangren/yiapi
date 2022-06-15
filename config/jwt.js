import { appConfig } from './app.js';
const jwtConfig = {
    secret: appConfig.salt,
    expiresIn: appConfig.expires,
    algorithm: 'HS256'
};
export { jwtConfig };
