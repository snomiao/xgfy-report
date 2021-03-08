# 功能设计

名单 - 全部名单 自动名单 未报名单 +
上报 - 手动上报
查询 - 次数

/user/unreported/
/user/unreported/:uid/
/user/unreported/:uid/report
/user/autoreport/
/user/autoreport/:uid/report
/user/:uid/report

[Docker + Node (Typescript) :: HeberGB Blog](https://www.hebergb.com/docker-node-typescript)

docker run \
    --name xgfy_report \
    --restart=always \
    -e TGBOT_URI=https://api.telegram.org/bot1090548869:AAES_LbDbehMFy4larmi7fk5HDbBtk7-mKo/sendMessage?chat_id=617647325&text= \
    -e MONGODB_URI=mongodb+srv://ChengYuan:6QWFMSahejd1ynOk@chengyuan-ujh0o.azure.mongodb.net/xgfy_report \
    xgfy_report

docker run -ti \
    --name xgfy_report \
    --restart=always \
    -e TGBOT_SEND=https://api.telegram.org/bot1090548869:AAES_LbDbehMFy4larmi7fk5HDbBtk7-mKo/sendMessage?chat_id=617647325&text= \
    -e MONGODB_URI=mongodb+srv://ChengYuan:6QWFMSahejd1ynOk@chengyuan-ujh0o.azure.mongodb.net/xgfy_report xgfy_report
