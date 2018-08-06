const fs = require('fs')

const logLevels = ['debug', 'warn', 'info', 'error']

function Logger (stream) {
    this._stream = stream
}

logLevels.forEach(function (level) {
    Logger.prototype[level] = function (...args) {
        const timestamp = new Date().toLocaleString()
        const message = args.join(' ')
        const str = `${timestamp} [${level.toUpperCase()}] ${message}\n`

        // process.stderr.write(str);
        this._stream.write(str)
    }

    exports[level] = (...args) => {
        logger[level](...args)
    }
})

const logger = new Logger(fs.createWriteStream('history.log', {flags: 'a'}))
