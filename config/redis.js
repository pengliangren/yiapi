export default {
    host: '127.0.0.1',
    port: 6379,
    username: null,
    password: process.env.NODE_ENV === 'development' ? 'aRWPmhybFAiYKxRhxqymN53uXCl1HZT8' : 'aRWPmhybFAiYKxRhxqymN53uXCl1HZT8',
    keyPrefix: 'font-end-world#'
};
