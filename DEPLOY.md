# 🚀 Деплой на VPS сервер

Инструкция по развертыванию calc-app на VPS сервере с использованием PM2.

## 📋 Требования

- VPS сервер с Ubuntu/Debian
- Root доступ или sudo права
- Git установлен на сервере

## 🔧 Шаг 1: Первоначальная настройка VPS

### 1.1 Подключитесь к серверу

```bash
ssh root@your-vps-ip
```

### 1.2 Загрузите скрипт настройки

```bash
wget https://raw.githubusercontent.com/RaufERK/calc-app/main/setup-vps.sh
chmod +x setup-vps.sh
```

### 1.3 Запустите настройку

```bash
./setup-vps.sh
```

Этот скрипт установит:

- Node.js 20.x
- PM2
- Создаст необходимые директории
- Настроит firewall
- Настроит автозапуск PM2

## 📦 Шаг 2: Клонирование и деплой

### 2.1 Клонируйте репозиторий

```bash
git clone https://github.com/RaufERK/calc-app.git /var/www/calc-app
cd /var/www/calc-app
```

### 2.2 Настройте ecosystem.config.js

Отредактируйте файл `ecosystem.config.js`:

```bash
nano ecosystem.config.js
```

Замените `your-vps-ip` на IP вашего сервера:

```javascript
host: '123.456.789.012', // Ваш IP
```

### 2.3 Сделайте скрипты исполняемыми

```bash
chmod +x deploy.sh
```

### 2.4 Запустите деплой

```bash
./deploy.sh
```

## 🔍 Шаг 3: Проверка работы

### 3.1 Проверьте статус PM2

```bash
pm2 status
```

### 3.2 Проверьте логи

```bash
pm2 logs calc-app
```

### 3.3 Откройте приложение

Перейдите в браузере по адресу: `http://your-vps-ip:3000`

## 🔄 Обновление приложения

### Автоматическое обновление через PM2

```bash
cd /var/www/calc-app
git pull origin main
./deploy.sh
```

### Ручное обновление

```bash
cd /var/www/calc-app
git pull origin main
npm install
npm run build
pm2 reload calc-app
```

## 📊 Управление PM2

### Основные команды

```bash
pm2 status                    # Статус всех приложений
pm2 logs calc-app             # Логи приложения
pm2 restart calc-app          # Перезапуск
pm2 stop calc-app             # Остановка
pm2 delete calc-app           # Удаление из PM2
pm2 monit                     # Мониторинг в реальном времени
```

### Сохранение конфигурации

```bash
pm2 save                      # Сохранить текущую конфигурацию
pm2 startup                   # Настроить автозапуск при перезагрузке
```

## 🔒 Настройка Nginx (опционально)

Если хотите использовать домен и HTTPS:

### 1. Установите Nginx

```bash
apt install nginx
```

### 2. Создайте конфигурацию

```bash
nano /etc/nginx/sites-available/calc-app
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Активируйте сайт

```bash
ln -s /etc/nginx/sites-available/calc-app /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 🐛 Устранение неполадок

### Проверка логов

```bash
pm2 logs calc-app --lines 50
tail -f /var/log/calc-app/err.log
tail -f /var/log/calc-app/out.log
```

### Проверка портов

```bash
netstat -tlnp | grep :3000
```

### Перезапуск PM2

```bash
pm2 kill
pm2 start ecosystem.config.js --env production
```

## 📝 Полезные команды

```bash
# Мониторинг ресурсов
htop

# Проверка дискового пространства
df -h

# Проверка использования памяти
free -h

# Проверка процессов Node.js
ps aux | grep node
```

## 🔄 Автоматический деплой

Для автоматического деплоя при push в GitHub можно настроить webhook или использовать GitHub Actions.

### GitHub Actions (рекомендуется)

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /var/www/calc-app
            git pull origin main
            ./deploy.sh
```

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи: `pm2 logs calc-app`
2. Проверьте статус: `pm2 status`
3. Убедитесь, что порт 3000 открыт
4. Проверьте права доступа к файлам
