@echo off
npm run build && ^
scp -r -P 27142 lib/ root@calif.snomiao.com:~/xgfy-report/ && ^
scp -r -P 27142 package.json root@calif.snomiao.com:~/xgfy-report/ && ^
scp -r -P 27142 package-lock.json root@calif.snomiao.com:~/xgfy-report/ && ^
ssh -p 27142 root@calif.snomiao.com sh ~/xgfy-report/ci.sh