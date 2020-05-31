const path = require('path');
const {exists, readFile, mkdir, writeFile} = require('../nodeFunctions');

module.exports = async (err, req, res, next) => {
    try {
        const {message, code, stack} = err;

        const logsFolderPath = path.resolve(__dirname, '../../logs');

        if (! await exists(logsFolderPath)) {
            await mkdir(logsFolderPath, {
                recursive: true,
            });
        }

        const obj = {
            message,
            time: Date.now(),
            code,
            stackTrace: stack,
        };

        const pathToFile = path.resolve(logsFolderPath, 'logs.json');

        if (await exists(pathToFile) && JSON.parse(await readFile(pathToFile))) {
            const data = await readFile(pathToFile);
            const json = JSON.parse(data);
            json.push(obj);
            await writeFile(pathToFile, JSON.stringify(json, null, 2), 'utf-8');
        } else {
            await writeFile(pathToFile, JSON.stringify([obj], null, 2), 'utf-8');
        }
        next(err);
    } catch (e) {
        next(e);
    }
};