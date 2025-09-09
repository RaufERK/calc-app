module.exports = {
  apps: [
    {
      name: 'calc-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3033', // ← был 3001, ставим 3033
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: { NODE_ENV: 'production' },
      env_production: { NODE_ENV: 'production' },
    },
  ],

  deploy: {
    production: {
      user: 'appuser',
      host: 'amster_app', // ← как у тебя
      ref: 'origin/main',
      repo: 'https://github.com/RaufERK/calc-app.git',
      path: '/home/appuser/apps/calc-app',
      'post-deploy': [
        'source ~/.nvm/nvm.sh && nvm use --lts',
        'ln -sf /home/appuser/shared/calc-app/.env.production ./.env.production || true',
        'npm ci --include=dev',
        'npm run build',
        'pm2 startOrReload ecosystem.config.cjs --env production',
        'pm2 save',
      ].join(' && '),
      env: { NODE_ENV: 'production' },
    },
  },
};
