const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { sessionSecret } = require('../config.js');

// SERVER CONFIG
const app = express();
const PORT = 3000;

// SESSION
app.use(session({
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  secret: sessionSecret,
  cookie: {
    maxAge: 1000*60*60*2, // two hours
    sameSite: true,   
  }
}))

// BODY PARSING (EXPRESS' BUILT IN PARSER)
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// SERVING THE BUILD FILE
app.use('/build', express.static(path.join(__dirname, '../build')));

// SERVING THE MAIN PAGE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// ROUTERS
const gcloudRouter = require('./routers/gcloudRouter');
const awsRouter = require('./routers/awsRouter');
const azureRouter = require('./routers/azureRouter');
const dbRouter = require('./routers/dbRouter');
const dockerRouter = require('./routers/dockerRouter');
// GCLOUD
app.use('/gcloud', gcloudRouter);

// AWS
app.use('/aws', awsRouter);

// DOCKER
app.use('/docker', dockerRouter);

// AZURE
app.use('/azure', azureRouter);

// DATABASE
app.use('/db', dbRouter);

// 404 NOT FOUND HANDLER
app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

// INITIALIZE SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;