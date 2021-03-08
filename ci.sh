cd ~/xgfy-report
docker build -t xgfy_report .
docker rm -f xgfy_report
docker run -d \
    --name xgfy_report \
    --restart=always \
    -v ~/xgfy-report/.env.prod:/app/.env \
    xgfy_report
docker attach xgfy_report
