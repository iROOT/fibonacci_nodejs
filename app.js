const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const {PassThrough} = require('stream');

const hostname = '127.0.0.1';
const port = 3000;


const logLevels = ['debug', 'warn', 'info', 'error'];

function Logger(stream) {
    this._stream = stream;
}

logLevels.forEach(function(level){
    Logger.prototype[level] = function(...args) {
        const timestamp = new Date().toLocaleString();
        const message = args.join(' ');
        const str = `${timestamp} [${level.toUpperCase()}] ${message}\n`;

        this._stream.write(str);
    }
});

const pass = new PassThrough();
pass.pipe(fs.createWriteStream('history.log', {flags: 'a'}));
// pass.pipe(process.stderr);

const logger = new Logger(pass);

function fibonacci(n) {
    let a = 0, b = 1;

    if (n === 0 || n === 1) {
        return n;
    }

    for (let i = 2; i <= n; ++i) {
        [a, b] = [b, a + b];
    }

    return b;
}

function factorial(n) {
    let mul = 1;

    if (n !== 0) {
        for (let i = 1; i <= n; ++i) {
            mul *= i
        }
    }

    return mul;
}

async function downloadFile(srvUrl, res) {
    let filePath;
    if (typeof srvUrl.query === 'object' && 'file' in srvUrl.query) {
        const rootDir = path.resolve(__dirname, 'public');
        filePath = path.join(rootDir, srvUrl.query['file']);
        if (filePath.indexOf(rootDir) !== 0) {
            throw URIError('Directory traversal');
        }
    } else {
        throw URIError("File path is not specified");
    }

    let file = fs.createReadStream(filePath);

    res.writeHead(200,
        {'Content-Type': 'application/octet-stream',
         'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`});

    file.pipe(res);

    await new Promise((resolve, reject) => {
        file.on('error', reject)
            .on('end', resolve);
        res.on('close', file.destroy);
    });
}

function getResult(funcName, n) {
    if (!Number.isInteger(n)) {
        throw TypeError("Input value is not integer");
    } else if (n < 0) {
        throw RangeError("Input value is negative");
    }

    switch (funcName) {
        case 'fibonacci':
            if (n > 1476) {
                return Infinity;
            } else {
                return fibonacci(n);
            }
        case 'factorial':
            if (n > 170) {
                return Infinity;
            } else {
                return factorial(n);
            }
        default:
            throw URIError("Function not found");
    }
}

function getErrorReaction(e) {
    let res = {
        "RangeError": {
            code: 400,
            message: "Input value is negative"
        },
        "URIError": {
            code: 404,
            message: "Function not found"
        },
        "TypeError": {
            code: 500,
            message: "Invalid function argument"
        },
        "ENOENT": {
            code: 404,
            message: "File not found"
        }
    };

    return res[e.name] || {
        code: 500,
        message: ''
    };
}

const server = http.createServer(async(req, res) => {
    try {
        const srvUrl = url.parse(req.url, true);

        logger.info(req.method, req.url);

        switch (srvUrl.pathname) {
            case '/fibonacci':
            case '/factorial':
                if (typeof srvUrl.query === 'object' && 'i' in srvUrl.query) {
                    const n = parseInt(srvUrl.query['i'], 10);

                    const result = await getResult(srvUrl.pathname.slice(1), n).toString();

                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(result);
                } else {
                    throw TypeError("Invalid function argument");
                }
                break;

            case '/download':
                await downloadFile(srvUrl, res);
                break;

            case '/favicon.ico':
                res.writeHead(200, {'Content-Type': 'image/x-icon'});
                res.end();
                break;

            default:
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('404 Page not found\n');
                logger.error(404, 'Page not found');
        }
    } catch (e) {
        let {code, message} = getErrorReaction(e);

        res.writeHead(code, {'Content-Type': 'text/plain'});
        res.end(e.stack);
        logger.error(`${e.stack}`);
    }
});

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
                const result = getResult(process.argv[2], parseInt(process.argv[3], 10))
                console.log(result);
                logger.debug('Printed result', result)
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

exports.listen = (...args) => {
    server.listen(...args);
};

exports.close = (callback) => {
    server.close(callback);
};
