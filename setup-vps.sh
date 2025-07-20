#!/bin/bash

# Скрипт первоначальной настройки VPS для calc-app
# Запускать на VPS сервере один раз для настройки

set -e

echo "🔧 Настройка VPS сервера для calc-app..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для логирования
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Проверяем, что мы root
if [ "$EUID" -ne 0 ]; then
    error "Этот скрипт должен быть запущен от имени root"
fi

log "📦 Обновляем пакеты..."
apt update && apt upgrade -y

log "🐍 Устанавливаем Node.js и npm..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

log "📊 Устанавливаем PM2 глобально..."
npm install -g pm2

log "📁 Создаем директории..."
mkdir -p /var/www/calc-app
mkdir -p /var/log/calc-app

log "👤 Настраиваем права доступа..."
chown -R $SUDO_USER:$SUDO_USER /var/www/calc-app
chown -R $SUDO_USER:$SUDO_USER /var/log/calc-app

log "🔒 Настраиваем firewall (если UFW установлен)..."
if command -v ufw &> /dev/null; then
    ufw allow 3000/tcp
    ufw allow 22/tcp
    log "✅ Порт 3000 открыт в firewall"
else
    warning "UFW не установлен. Убедитесь, что порт 3000 открыт в вашем firewall"
fi

log "📋 Создаем systemd сервис для PM2..."
pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER

log "✅ Настройка VPS завершена!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Клонируйте репозиторий: git clone https://github.com/RaufERK/calc-app.git /var/www/calc-app"
echo "2. Перейдите в директорию: cd /var/www/calc-app"
echo "3. Запустите деплой: ./deploy.sh"
echo ""
echo "🔧 Полезные команды:"
echo "  pm2 status                    - статус приложений"
echo "  pm2 logs calc-app             - логи приложения"
echo "  pm2 monit                     - мониторинг в реальном времени"
echo "  pm2 save                      - сохранить текущую конфигурацию"
echo "  pm2 startup                   - настроить автозапуск PM2"
echo "" 
