var fs = require('fs');
const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// 输出到文件
const logger = new console.Console({ stdout: output, stderr: errorOutput });
const count = 5;
logger.log('hello')
logger.log('count: ', count);
// 输出到 stderr 文件
logger.error('error1')