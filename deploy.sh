#!/bin/bash

# Скрипт деплоя для VPS сервера с PM2
# Использование: ./deploy.sh

set -e

echo "🚀 Начинаем деплой calc-app на VPS..."

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

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    error "package.json не найден. Убедитесь, что вы находитесь в корне проекта."
fi

# Проверяем, что ecosystem.config.js существует
if [ ! -f "ecosystem.config.js" ]; then
    error "ecosystem.config.js не найден."
fi

# Проверяем, что PM2 установлен
if ! command -v pm2 &> /dev/null; then
    error "PM2 не установлен. Установите PM2: npm install -g pm2"
fi

log "📦 Устанавливаем зависимости..."
npm install

log "🔨 Собираем приложение..."
npm run build

log "🧹 Очищаем логи PM2..."
pm2 flush calc-app 2>/dev/null || true

log "🔄 Перезапускаем приложение с PM2..."
pm2 reload ecosystem.config.js --env production

log "📊 Проверяем статус приложения..."
pm2 status

log "📋 Показываем логи..."
pm2 logs calc-app --lines 10

log "✅ Деплой завершен успешно!"
echo ""
echo "🌐 Приложение должно быть доступно по адресу: http://your-vps-ip:3000"
echo ""
echo "📝 Полезные команды PM2:"
echo "  pm2 status                    - статус приложений"
echo "  pm2 logs calc-app             - логи приложения"
echo "  pm2 restart calc-app          - перезапуск"
echo "  pm2 stop calc-app             - остановка"
echo "  pm2 delete calc-app           - удаление из PM2"
echo "" 
