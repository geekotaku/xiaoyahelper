#!/bin/sh

if [ -n "$TZ" ]; then
  ln -snf /usr/share/zoneinfo/$TZ /etc/localtime
  echo $TZ > /etc/timezone
fi

echo "$cron node /app/main.js > /proc/1/fd/1 2>&1" > /etc/cron.d/root

crond -f