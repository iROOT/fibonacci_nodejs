const server = require('../http-api'),
    {describe, before, after, it} = require('mocha'),
    assert = require('assert'),
    request = require('request'),
    {spawn} = require('child_process');


const PORT = 8000;
const DOMAIN = `http://localhost:${PORT}`;

describe('/', () => {
    before(() => {
        server.listen(PORT);
    });

    after(() => {
        server.close();
    });

    it('should return code 400', (done) => {
        Promise.all([
            request.get(`${DOMAIN}/fibonacci?i=-100`, (err, res, body) => {
                assert.equal(res.statusCode, 400);
            }),
            request.get(`${DOMAIN}/factorial?i=-100`, (err, res, body) => {
                assert.equal(res.statusCode, 400);
            })
        ]).then(done());
    });

    it('should return code 500', (done) => {
        Promise.all([
            request.get(`${DOMAIN}/fibonacci?i=abc`, (err, res, body) => {
                assert.equal(res.statusCode, 500);
            }),
            request.get(`${DOMAIN}/factorial?i=abc`, (err, res, body) => {
                assert.equal(res.statusCode, 500);
            })
        ]).then(done());
    });


    it('Fibonacci 0 should return 0', (done) => {
        Promise.all([
            request.get(`${DOMAIN}/fibonacci?i=0`, (err, res, body) => {
                assert.equal(res.statusCode, 200);
                assert.equal(body, '0');
            }),
            spawn('node', ['console-api.js', 'factorial', '0'])
                .stdout.on('data', (res) => {
                assert.equal(res, '0');
            })
        ]).then(done());
    });

    it('Fibonacci 1 should return 1', (done) => {
        Promise.all([
            request.get(`${DOMAIN}/fibonacci?i=1`, (err, res, body) => {
                assert.equal(res.statusCode, 200);
                assert.equal(body, '1');
            }),
            spawn('node', ['console-api.js', 'factorial', '1'])
                .stdout.on('data', (res) => {
                assert.equal(res, '1');
            })
        ]).then(done());
    });

    it('Fibonacci 2 should return 1', (done) => {
        Promise.all([
            request.get(`${DOMAIN}/fibonacci?i=2`, (err, res, body) => {
                assert.equal(res.statusCode, 200);
                assert.equal(body, '1');
            }),
            spawn('node', ['console-api.js', 'factorial', '2'])
                .stdout.on('data', (res) => {
                assert.equal(res, '1');
            })
        ]).then(done());
    });

    it('Fibonacci 3 should return 2', (done) => {
        Promise.all([
            request.get(`${DOMAIN}/fibonacci?i=3`, (err, res, body) => {
                assert.equal(res.statusCode, 200);
                assert.equal(body, '2');
            }),
            spawn('node', ['console-api.js', 'factorial', '3'])
                .stdout.on('data', (res) => {
                assert.equal(res, '2');
            })
        ]).then(done());
    });

    it('Fibonacci 10 should return 55', (done) => {
        Promise.all([
            request.get(`${DOMAIN}/fibonacci?i=10`, (err, res, body) => {
                assert.equal(res.statusCode, 200);
                assert.equal(body, '55');
            }),
            spawn('node', ['console-api.js', 'factorial', '10'])
                .stdout.on('data', (res) => {
                assert.equal(res, '55');
            })
        ]).then(done());
    });

    it('Fibonacci 1476 should return 1.3069892237633987e+308', (done) => {
        Promise.all([
            request.get(`${DOMAIN}/fibonacci?i=1476`, (err, res, body) => {
                assert.equal(res.statusCode, 200);
                assert.equal(body, '1.3069892237633987e+308');
            }),
            spawn('node', ['console-api.js', 'factorial', '1476'])
                .stdout.on('data', (res) => {
                assert.equal(res, '1');
            })
        ]).then(done());
    });

    it('Fibonacci 1477 should return Infinity', (done) => {
        Promise.all([
            request.get(`${DOMAIN}/fibonacci?i=1477`, (err, res, body) => {
                assert.equal(res.statusCode, 200);
                assert.equal(body, 'Infinity');
            }),
            spawn('node', ['console-api.js', 'factorial', '1477'])
                .stdout.on('data', (res) => {
                assert.equal(res, 'Infinity');
            })
        ]).then(done());
    });


    it('Factorial 5 should return 55', (done) => {
        Promise.all([
            request.get(`${DOMAIN}/factorial?i=5`, (err, res, body) => {
                assert.equal(res.statusCode, 200);
                assert.equal(body, '120');
            }),
            spawn('node', ['console-api.js', 'factorial', '5'])
                .stdout.on('data', (res) => {
                assert.equal(res, '120');
            })
        ]).then(done());
    });

    it('Factorial 20 should return 2432902008176640000', (done) => {
        Promise.all([
            request.get(`${DOMAIN}/factorial?i=20`, (err, res, body) => {
                assert.equal(res.statusCode, 200);
                assert.equal(body, '2432902008176640000');
            }),
            spawn('node', ['console-api.js', 'factorial', '20'])
                .stdout.on('data', (res) => {
                assert.equal(res, '2432902008176640000');
            })
        ]).then(done());
    });
});
