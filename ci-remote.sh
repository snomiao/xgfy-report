cd /root/xgfy-report
docker build -t xgfy_report .
docker rm xgfy_report
docker run -d \
    --name xgfy_report \
    --restart=always \
    -v /root/xgfy-report/.env.prod:/app/.env \
    xgfy_report
watch docker logs -t xgfy_report
