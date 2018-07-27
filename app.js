function fibonacci(n) {
    let a = 0, b = 1;

    if (0 <= n && n <= 1)
        return [a, b][n];

    for (let i = 2; i <= n; ++i)
        [a, b] = [b, a + b];

    return b;
}

function factorial(n) {
    let mul = 1;
    if (n === 0)
        return 1;

    for (let i = 1; i <= n; ++i)
        mul *= i

    return mul;
}

function getResult(funcName, n) {
    if (!Number.isInteger(n))
        throw TypeError;
    else if (n < 0)
        throw RangeError;

    if (funcName === 'fibonacci')
        if (n > 1476)
            return Infinity;
        else
            return fibonacci(n);

    else if (funcName === 'factorial')
        if (n > 170)
            return Infinity;
        else
            return factorial(n);
    else
        throw URIError;
}

function server() {
    const http = require('http');
    const url = require('url');

    const hostname = '127.0.0.1';
    const port = 3000;

    const server = http.createServer((req, res) => {
        if (req.url === '/favicon.ico') {
            res.writeHead(200, {'Content-Type': 'image/x-icon'});
            res.end();
            return;
        }

        try {
            const srvUrl = url.parse(req.url, true);

            if (typeof srvUrl.query === 'object' && 'i' in srvUrl.query) {
                let n = parseInt(srvUrl.query['i'], 10);

                let result = getResult(srvUrl.pathname.slice(1), n).toString();

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(result);
            } else {
                throw TypeError;
            }
        } catch (e) {
            if (e.name === "RangeError") {
                res.statusCode = 400;
                res.end();
            } else if (e.name === "URIError") {
                res.statusCode = 404;
                res.end();
            } else if (e.name === "TypeError") {
                res.statusCode = 500;
                res.end();
            }
        }
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

if (process.argv[2] === "server")
    server();
else {
    try {
        console.log(getResult(process.argv[2], parseInt(process.argv[3], 10)));
    } catch (e) {
        if (e.name === "RangeError")
            console.log("Input value is negative");
        else if (e.name === "URIError")
            console.log("Function not found");
        else if (e.name === "TypeError")
            console.log("Invalid function argument");
    }
}
