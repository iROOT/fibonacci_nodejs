const {Writable} = require('stream')
const logger = require('./logger')

const hookStdio = (name, cb) => {
    const hookWrite = (chunk) => {
        cb(chunk)
    }

    const originalWrite = process[name].write
    process[name].write = hookWrite

    const desc = Object.getOwnPropertyDescriptor(process, name)
    const originalGet = desc.get
    desc.get = () => {
        const stdout = new Writable()
        stdout.write = hookWrite
        return stdout
    }
    Object.defineProperty(process, name, desc)

    return () => {
        desc.get = originalGet
        Object.defineProperty(process, name, desc)
        process[name].write = originalWrite
    }
}

const hookLogger = ((name, cb) => {
    const originalLogFunc = logger[name]
    logger[name] = (chunk) => {
        cb(chunk)
    }
    return () => {
        logger[name] = originalLogFunc
    }
})

module.exports.hookStdio = hookStdio

module.exports.hookLogger = hookLogger
