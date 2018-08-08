const fs = require('fs')
const path = require('path')

const server = require('./http-api')
const logger = require('./logger')
const core = require('./core')

const HOSTNAME = '127.0.0.1'
const PORT = 3000

const main = async (...args) => {
    try {
        logger.info('Console arguments:', process.argv.join(' '))

        switch (args[0]) {
            case 'server':
                server.listen(PORT, HOSTNAME, () => {
                    logger.info(`Server running at http://${HOSTNAME}:${PORT}/`)
                })
                break
            case 'fibonacci':
            case 'factorial':
                const result = core.getResult(args[0], parseInt(args[1], 10))
                console.log(result)
                logger.debug('Printed result', result)
                break
            case 'view':
                const rootDir = path.resolve(__dirname, 'public')
                let filePath = path.join(rootDir, args[1])
                if (filePath.indexOf(rootDir) !== 0) {
                    throw URIError('Directory traversal')
                }
                let file = fs.createReadStream(filePath)

                file.pipe(process.stdout)

                await new Promise((resolve, reject) => {
                    file.on('error', reject)
                        .on('end', resolve)
                })
                logger.debug('File printed:', filePath)
                break
            default:
                logger.warn('Argument function is not specified')
        }
    } catch (e) {
        logger.error(e.stack)
    }
}

module.exports = main

if (require.main === module) {
    main(...process.argv.slice(2))
}
