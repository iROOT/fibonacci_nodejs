const server = require('../app'),
    {describe, before, after, it} = require('mocha'),
    assert = require('assert'),
    http = require('http');

describe('server', function () {
    before(function () {
        server.listen(8000);
    });

    after(function () {
        server.close();
    });
});

describe('/', function () {
    before(function () {
        server.listen(8000);
    });

    after(function () {
        server.close();
    });

    it('should return code 200', function (done) {
        http.get('http://localhost:8000/fibonacci?i=5', function (res) {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('should return code 400', function (done) {
        http.get('http://localhost:8000/fibonacci?i=-100', function (res) {
            assert.equal(400, res.statusCode);
        });

        http.get('http://localhost:8000/factorial?i=-100', function (res) {
            assert.equal(400, res.statusCode);
            done();
        });
    });

    it('should return code 500', function (done) {
        http.get('http://localhost:8000/fibonacci?i=abc', function (res) {
            assert.equal(500, res.statusCode);
        });

        http.get('http://localhost:8000/factorial?i=abc', function (res) {
            assert.equal(500, res.statusCode);
            done();
        });
    });


    it('should return 0', function (done) {
        http.get('http://localhost:8000/fibonacci?i=0', function (res) {
            let data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                assert.equal('0', data);
                done();
            });
        });
    });

    it('should return 1', function (done) {
        http.get('http://localhost:8000/fibonacci?i=1', function (res) {
            let data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                assert.equal('1', data);
                done();
            });
        });
    });

    it('should return 1', function (done) {
        http.get('http://localhost:8000/fibonacci?i=2', function (res) {
            let data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                assert.equal('1', data);
                done();
            });
        });
    });

    it('should return 2', function (done) {
        http.get('http://localhost:8000/fibonacci?i=3', function (res) {
            let data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                assert.equal('2', data);
                done();
            });
        });
    });

    it('should return 55', function (done) {
        http.get('http://localhost:8000/fibonacci?i=10', function (res) {
            let data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                assert.equal('55', data);
                done();
            });
        });
    });

    it('should return 1.3069892237633987e+308', function (done) {
        http.get('http://localhost:8000/fibonacci?i=1476', function (res) {
            let data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                assert.equal('1.3069892237633987e+308', data);
                done();
            });
        });
    });

    it('should return Infinity', function (done) {
        http.get('http://localhost:8000/fibonacci?i=1477', function (res) {
            let data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                assert.equal('Infinity', data);
                done();
            });
        });
    });


    it('should return 55', function (done) {
        http.get('http://localhost:8000/factorial?i=5', function (res) {
            let data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                assert.equal('120', data);
                done();
            });
        });
    });
});
