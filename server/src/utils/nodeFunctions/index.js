const fs = require('fs');
const util = require('util');

const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

module.exports = {
    exists,
    mkdir,
    readFile,
    writeFile,
    appendFile,
};