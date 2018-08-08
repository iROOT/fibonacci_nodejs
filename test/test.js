const server = require('../http-api'),
    core = require('../core'),
    consoleApi = require('../console-api.js'),
    {describe, before, after, it} = require('mocha'),
    assert = require('assert'),
    request = require('request'),
    fs = require('fs'),
    {Writable} = require('stream')

const PORT = 8000
const DOMAIN = `http://localhost:${PORT}`

function hookStdout(callback) {
    const oldStream = process.stdout

    process.stdout = new Writable();
    process.stdout.write = callback

    return () => {
        process.stdout = oldStream
    }
}

describe('/', () => {
    before(() => {
        server.listen(PORT)
    })

    after(() => {
        server.close()
    })

    const modes = [testCore, testCli, testHttp]

    function testCore (name, test, done) {
        assert.equal(core.getResult(name, test.in), test.out)
        done()
    }

    function testCli (name, test, done) {
        const unhook = hookStdout((res) => {
            assert.equal(res, test.out)
            done()
        })
        consoleApi(name, test.in)
        unhook()
    }

    function testHttp (name, test, done) {
        request.get(`${DOMAIN}/${name}?i=${test.in}`, (err, res, body) => {
            assert.equal(body, test.out)
            done()
        })
    }

    function testFunc (name, mode, test) {
        it(`${name} ${test.in} should return ${test.out}`, (done) => {
            mode(name, test, done)
        })
    }

    function testExceptions (name) {
        [
            {args: -100, expected: RangeError},
            {args: -10, expected: RangeError},
            {args: -1, expected: RangeError},
            {args: 'abc', expected: TypeError},
        ].forEach((test) => {
            it(`${name} ${test.args} should return ${test.expected.name}`, () => {
                assert.throws(() => {core.getResult(name, test.args)}, test.expected)
            })
        })
    }

    describe('fibonacci', () => {
        const name = 'fibonacci'

        modes.forEach(mode => {
            describe(mode.name, () => {
                [
                    {in: 0, out: 0},
                    {in: 1, out: 1},
                    {in: 2, out: 1},
                    {in: 3, out: 2},
                    {in: 10, out: 55},
                    {in: 500, out: 1.394232245616977e+104},
                    {in: 1476, out: 1.3069892237633987e+308},
                    {in: 1477, out: Infinity},
                ].forEach(test => {testFunc(name, mode, test)})
            })
        })

        describe('exception', () => {testExceptions(name)})
    })

    describe('factorial', () => {
        const name = 'factorial'

        modes.forEach(mode => {
            describe(mode.name, () => {
                [
                    {in: 0, out: 1},
                    {in: 1, out: 1},
                    {in: 2, out: 2},
                    {in: 3, out: 6},
                    {in: 5, out: 120},
                    {in: 10, out: 3628800},
                    {in: 50, out: 3.0414093201713376e+64},
                    {in: 170, out: 7.257415615307994e+306},
                    {in: 171, out: Infinity},
                ].forEach(test => {testFunc(name, mode, test)})
            })
        })

        describe('exception', () => {testExceptions(name)})
    })

    describe('download', () => {
        it('Check Download file', (done) => {
            request.get(`${DOMAIN}/download?file=test.txt`, (err, res, body) => {
                if (err) {
                    throw err
                } else {
                    assert.equal(body, fs.readFileSync(`${__dirname}/../public/test.txt`))
                    done()
                }
            })
        })

        it('Check Directory traversal', (done) => {
            request.get(`${DOMAIN}/download?file=../test.txt`, (err, res, body) => {
                if (err) {
                    throw err
                } else {
                    assert.equal(res.statusCode, 404)
                    assert.equal(body, 'Directory traversal')
                    done()
                }
            })
        })

        it('Check No such file or directory', (done) => {
            request.get(`${DOMAIN}/download?file=hello.txt`, (err, res, body) => {
                if (err) {
                    throw err
                } else {
                    assert.equal(res.statusCode, 404)
                    assert.equal(body, 'No such file or directory')
                    done()
                }
            })
        })

        it('Check File path is not specified', (done) => {
            request.get(`${DOMAIN}/download`, (err, res, body) => {
                if (err) {
                    throw err
                } else {
                    assert.equal(res.statusCode, 404)
                    assert.equal(body, 'File path is not specified')
                    done()
                }
            })
        })
    })

    describe('view', () => {
        it('view should return same file', (done) => {
            testCli('view', {in: 'test.txt', out: fs.readFileSync(`${__dirname}/../public/test.txt`).toString()}, done)
        })
    })
})
