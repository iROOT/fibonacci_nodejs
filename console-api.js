const logger = require('./logger')
const core = require('./core')

const main = async (...args) => {
    try {
        logger.info('Console arguments:', process.argv.join(' '))

        switch (args[0]) {
            case 'fibonacci':
            case 'factorial':
                const result = core.getResult(args[0], parseInt(args[1], 10))
                console.log(result)
                logger.debug('Printed result', result)
                break
            case 'view':
                let filePath, file
                [filePath, file] = core.getFile(args[1])

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
