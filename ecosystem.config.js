module.exports = {
  apps: [
    {
      name: 'calc-app',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/calc-app',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/var/log/calc-app/err.log',
      out_file: '/var/log/calc-app/out.log',
      log_file: '/var/log/calc-app/combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],

  deploy: {
    production: {
      user: 'root',
      host: '89.111.172.86',
      ref: 'origin/main',
      repo: 'https://github.com/RaufERK/calc-app.git',
      path: '/var/www/calc-app',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'post-setup': 'mkdir -p /var/log/calc-app',
    },
  },
};
