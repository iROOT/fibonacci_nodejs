const {Writable} = require('stream')

const hookStdio = (name, cb) => {
    const hookWrite = (data) => {
        cb(data)
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

module.exports = hookStdio
