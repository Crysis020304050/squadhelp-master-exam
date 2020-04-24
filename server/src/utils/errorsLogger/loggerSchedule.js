const fs = require('fs');
const path = require('path');
const util = require('util');

const exists = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

module.exports = async () => {
    try {
        const logsFolderPath = path.resolve(__dirname, '../../logs');
        const pathToFile = path.resolve(logsFolderPath, 'logs.json');
        if (await exists(pathToFile)) {
            const newFileName = `${Date.now()}.json`;
            const fileData = await readFile(pathToFile);
            const preparedData = JSON.parse(fileData)
                ? JSON.parse(fileData).map(({stackTrace, ...rest}) => rest)
                : JSON.parse(fileData);
            await appendFile(path.resolve(logsFolderPath, newFileName), JSON.stringify(preparedData, null, 2), 'utf-8');
            await writeFile(pathToFile, 0);
        }
    } catch (e) {
        throw e;
    }
};