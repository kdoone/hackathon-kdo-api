import http from 'http';

const port = 3000

export const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');    
}).listen(port, '127.0.0.1');

console.log(`Server running at ${port}` );
