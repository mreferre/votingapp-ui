const http = require('http');

const INITIAL_VOTES = {
  outback: 10,
  bucadibeppo: 5,
  ihop: 8,
  chipotle: 12,
};

let votes = { ...INITIAL_VOTES };
let server = null;

function handleRequest(req, res) {
  // CORS headers on all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url;

  if (url === '/api/getvotes') {
    res.setHeader('Content-Type', 'application/json');
    const data = Object.keys(votes).map((name) => ({ name, value: votes[name] }));
    res.writeHead(200);
    res.end(JSON.stringify(data));
    return;
  }

  if (url === '/api/reset') {
    votes = { ...INITIAL_VOTES };
    res.writeHead(200);
    res.end('OK');
    return;
  }

  const restaurants = ['outback', 'bucadibeppo', 'ihop', 'chipotle'];
  const match = url.match(/^\/api\/(\w+)$/);
  if (match && restaurants.includes(match[1])) {
    const key = match[1];
    votes[key] += 1;
    res.setHeader('Content-Type', 'text/plain');
    res.writeHead(200);
    res.end(String(votes[key]));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
}

function start(port = 4000) {
  return new Promise((resolve, reject) => {
    server = http.createServer(handleRequest);
    server.listen(port, () => {
      console.log('Mock API server listening on port ' + port);
      resolve(server);
    });
    server.on('error', reject);
  });
}

function stop() {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => resolve());
    } else {
      resolve();
    }
  });
}

// If run directly as a script
if (require.main === module) {
  start().catch((err) => {
    console.error('Failed to start mock server:', err);
    process.exit(1);
  });
}

module.exports = { start, stop };
