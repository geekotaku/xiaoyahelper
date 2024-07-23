#!/bin/sh

echo "$cron node /app/main.js > /proc/1/fd/1 2>&1" > /etc/cron.d/root

crond -f