const fs = require('fs');
const path = require('path');
const util = require('util');

const exists = util.promisify(fs.exists);
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

module.exports = async (err, req, res, next) => {
    try {
        const logsFilePath = path.resolve(__dirname, '../../logs');

        if (! await exists(logsFilePath)) {
            await mkdir(logsFilePath, {
                recursive: true,
            });
        }

        const obj = {
            message: err.message,
            time: Date.now(),
            code: err.code,
            stackTrace: err.stack,
        };

        const pathToFile = path.resolve(logsFilePath, 'logs.json');

        if (await exists(pathToFile)) {
            const data = await readFile(pathToFile);
            const json = JSON.parse(data);
            json.push(obj);
            await writeFile(pathToFile, JSON.stringify(json, null, 2), 'utf-8');
        } else {
            await appendFile(pathToFile, JSON.stringify([obj], null, 2), 'utf-8');
        }
        next(err);
    } catch (e) {
        next(e);
    }
};