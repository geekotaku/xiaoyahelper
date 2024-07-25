# 小雅阿里云盘自动清理
node写的脚本直接调用阿里云盘api，用cron自动执行脚本

docker: geekotaku/xiaoyahelper:latest

映射小雅配置目录/etc/xiaoya至/data

环境变量：
- TZ=Asia/Shanghai
- cron=定时任务参数(linux cron)

exec进去执行node main.js进行测试

docker componse:
```yaml
services:
  helper:
    container_name: xiaoya-helper
    image: geekotaku/xiaoyahelper:latest
    restart: always
    environment:
      - TZ=Asia/Shanghai
      - cron=0 2 * * * #每日凌晨2点
    volumes:
      - /etc/xiaoya:/data