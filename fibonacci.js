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

    const srvUrl = url.parse(req.url, true);

    if (srvUrl.pathname !== '/fibonacci') {
        res.statusCode = 404;
        res.end();
        return;
    }

    if (typeof srvUrl.query === 'object' && 'i' in srvUrl.query) {
        let q_i = parseInt(srvUrl.query['i']);
        let a, b; [a, b] = [0, 1];

        if (q_i < 0) {
            res.statusCode = 400;
            res.end();
            return;
        }

        res.writeHead(200, {'Content-Type': 'text/plain'});

        if (q_i >= 0 && q_i <= 1)
            res.end([a, b][q_i].toString());
        else {
            if (q_i > 1476)
                b = Infinity;
            else
                for (let i = 2; i <= q_i; ++i)
                    [a, b] = [b, a + b];
            res.end(b.toString());
        }
    } else {
        res.statusCode = 500;
        res.end();
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
