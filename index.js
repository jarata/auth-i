const server = require('./server.js');

const port = 5000;

server.listen(port, () => console.log(`Server is running at http://localhost:${port}`));