cd /root/xgfy-report
docker build -t xgfy_report .
docker rm -f xgfy_report
docker run -d \
    --name xgfy_report \
    --restart=always \
    -v /root/xgfy-report/.env:/app/.env \
    xgfy_report
