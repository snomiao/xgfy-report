cd /root/xgfy-report
docker build -t xgfy_report .
docker run -d --rm \
    --name xgfy_report \
    --restart=always \
    -v /root/xgfy-report/.env.prod:/app/.env \
    xgfy_report
watch docker logs -t xgfy_report
