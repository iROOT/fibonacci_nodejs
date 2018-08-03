const fs = require('fs');
const path = require('path');

const server = require('./http-api');
const logger = require('./logger');
const core = require('./core');


const hostname = '127.0.0.1';
const port = 3000;


(async() => {
    try {
        logger.info('Console arguments:', process.argv.join(' '));

        switch (process.argv[2]) {
            case 'server':
                server.listen(port, hostname, () => {
                    logger.info(`Server running at http://${hostname}:${port}/`);
                });
                break;
            case 'fibonacci':
            case 'factorial':
                const result = core.getResult(process.argv[2], parseInt(process.argv[3], 10));
                console.log(result);
                logger.debug('Printed result', result);
                break;
            case 'view':
                const rootDir = path.resolve(__dirname, 'public');
                let filePath = path.join(rootDir, process.argv[3]);
                if (filePath.indexOf(rootDir) !== 0) {
                    throw URIError('Directory traversal');
                }
                let file = fs.createReadStream(filePath);

                file.pipe(process.stdout);

                await new Promise((resolve, reject) => {
                    file.on('error', reject)
                        .on('end', resolve);
                });
                logger.debug('File printed:', filePath);
                break;
            default:
                logger.warn('Argument function is not specified');
        }
    } catch (e) {
        // let [code, message] = getErrorReaction(e);
        logger.error(e.stack);
    }
})();