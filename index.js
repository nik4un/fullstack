const app = require('./app');
const { serverPort } = require('./config/keys');

app.listen(serverPort, () => console.log(`Server running at http://localhost:${serverPort}/`));
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/new', (req, res) => res.send('Hello New World!'));
