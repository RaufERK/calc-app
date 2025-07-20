module.exports = {
  apps: [
    {
      name: 'calc-app',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/calc-app/current',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
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
      user: 'appuser',
      host: '89.111.172.86',
      ref: 'origin/main',
      repo: 'https://github.com/RaufERK/calc-app.git',
      path: '/var/www/calc-app',
      'pre-deploy-local': '',
      'post-deploy': `
        export PATH=$HOME/.nvm/versions/node/v22.15.1/bin:$PATH &&
        npm install &&
        npm run build &&
        PORT=3001 pm2 reload ecosystem.config.js --env production
      `,
      'pre-setup': '',
      'post-setup': 'mkdir -p /var/log/calc-app',
      ssh_options: 'StrictHostKeyChecking=no',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  },
};
