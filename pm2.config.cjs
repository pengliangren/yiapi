module.exports = {
    apps: [
        {
            name: 'api.front-end.world',
            instances: 'max',
            script: './app.js',
            exec_mode: 'cluster',
            watch: false,
            autorestart: true,
            ignore_watch: ['node_modules', 'logs', 'data'],
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};
