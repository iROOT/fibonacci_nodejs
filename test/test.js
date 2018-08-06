const server = require('../http-api'),
    {describe, before, after, it} = require('mocha'),
    assert = require('assert'),
    request = require('request');


const PORT = 8000;
const DOMAIN = `http://localhost:${PORT}`;

describe('/', () => {
    before(() => {
        server.listen(PORT);
    });

    after(() => {
        server.close();
    });

    it('should return code 200', (done) => {
        request.get(`${DOMAIN}/fibonacci?i=5`, (err, res, body) => {
            assert.equal(res.statusCode, 200);
            done();
        });
    });

    it('should return code 400', (done) => {
        request.get(`${DOMAIN}/fibonacci?i=-100`, (err, res, body) => {
            assert.equal(res.statusCode, 400);
        });

        request.get(`${DOMAIN}/factorial?i=-100`, (err, res, body) => {
            assert.equal(res.statusCode, 400);
            done();
        });
    });

    it('should return code 500', (done) => {
        request.get(`${DOMAIN}/fibonacci?i=abc`, (err, res, body) => {
            assert.equal(res.statusCode, 500);
        });

        request.get(`${DOMAIN}/factorial?i=abc`, (err, res, body) => {
            assert.equal(res.statusCode, 500);
            done();
        });
    });


    it('Fibonacci 0 should return 0', (done) => {
        request.get(`${DOMAIN}/fibonacci?i=0`, (err, res, body) => {
            assert.equal(res.statusCode, 200);
            assert.equal(body, '0');
            done();
        });
    });

    it('Fibonacci 1 should return 1', (done) => {
        request.get(`${DOMAIN}/fibonacci?i=1`, (err, res, body) => {
            assert.equal(res.statusCode, 200);
            assert.equal(body, '1');
            done();
        });
    });

    it('Fibonacci 2 should return 1', (done) => {
        request.get(`${DOMAIN}/fibonacci?i=2`, (err, res, body) => {
            assert.equal(res.statusCode, 200);
            assert.equal(body, '1');
            done();
        });
    });

    it('Fibonacci 3 should return 2', (done) => {
        request.get(`${DOMAIN}/fibonacci?i=3`, (err, res, body) => {
            assert.equal(res.statusCode, 200);
            assert.equal(body, '2');
            done();
        });
    });

    it('Fibonacci 10 should return 55', (done) => {
        request.get(`${DOMAIN}/fibonacci?i=10`, (err, res, body) => {
            assert.equal(res.statusCode, 200);
            assert.equal(body, '55');
            done();
        });
    });

    it('Fibonacci 1476 should return 1.3069892237633987e+308', (done) => {
        request.get(`${DOMAIN}/fibonacci?i=1476`, (err, res, body) => {
            assert.equal(res.statusCode, 200);
            assert.equal(body, '1.3069892237633987e+308');
            done();
        });
    });

    it('Fibonacci 1477 should return Infinity', (done) => {
        request.get(`${DOMAIN}/fibonacci?i=1477`, (err, res, body) => {
            assert.equal(res.statusCode, 200);
            assert.equal(body, 'Infinity');
            done();
        });
    });


    it('Factorial 5 should return 55', (done) => {
        request.get(`${DOMAIN}/factorial?i=5`, (err, res, body) => {
            assert.equal(res.statusCode, 200);
            assert.equal(body, '120');
            done();
        });
    });

    it('Factorial 20 should return 2432902008176640000', (done) => {
        request.get(`${DOMAIN}/factorial?i=20`, (err, res, body) => {
            assert.equal(res.statusCode, 200);
            assert.equal(body, '2432902008176640000');
            done();
        });
    });
});
