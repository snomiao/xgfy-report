const main = (await import('es-main')).default(import.meta);
setTimeout(() => process.exit(), 51 * 60e3) // 51 分钟后退出，让docker来重启自己

import loop from "./自动上报";

loop()