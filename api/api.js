require('../server.babel'); // babel registration (runtime transpilation for node)

import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from './config';
import * as actions from './actions/index';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';
import * as moviesController from './actions/movie';

const pretty = new PrettyError(),
      app = express(),
      router = express.Router();  

const server = new http.Server(app);

const io = new SocketIo(server);
io.path('/ws');

app.use(session({
  secret: 'react and redux rule!!!!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
app.use(bodyParser.json());


const handleAction = (req, res) => {

  const matcher = req.url.split('?')[0].split('/').slice(1);

  let action = false;
  let params = null;
  let apiActions = actions;
  let sliceIndex = 0;

  for (const actionName of matcher) {

    if (apiActions[actionName]) {
      action = apiActions[actionName];
    }

    if (typeof action === 'function') {
      params = matcher.slice(++sliceIndex);
      break;
    }
    apiActions = action;
    ++sliceIndex;
  }

  if (action && typeof action === 'function') {
    action(req, params)
      .then((result) => {
        res.json(result);
      }, (reason) => {
        if (reason && reason.redirect) {
          res.redirect(reason.redirect);
        } else {
          console.error('API ERROR:', pretty.render(reason));
          res.status(reason.status || 500).json(reason);
        }
      });
  } else {
    res.status(404).end('NOT FOUND');
  }
};

// Actions from original example
router.get('/loadInfo', function(req, res) {
    handleAction(req, res);
});
router.get('/login', function(req, res) {
    handleAction(req, res);
});
router.get('/logout', function(req, res) {
    handleAction(req, res);
});
router.get('/loadAuth', function(req, res) {
    handleAction(req, res);
});
router.get('/widget/load/:param1/:param2', function(req, res) {
    handleAction(req, res);
});
router.get('/widget/update', function(req, res) {
    handleAction(req, res);
});

// actions added for movies
router.route('/movies')
  .get(moviesController.getAll)
  .post(moviesController.create)
router.route('/movies/:id')
  .get(moviesController.getById)
  .put(moviesController.update)
  .delete(moviesController.deleteById)

//
app.use('/', router);

const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://localhost:%s', config.apiPort);
  });

  io.on('connection', (socket) => {
    socket.emit('news', {msg: `'Hello World!' from server`});

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index++) {
        const msgNo = (messageIndex + index) % bufferSize;
        const msg = messageBuffer[msgNo];
        if (msg) {
          socket.emit('msg', msg);
        }
      }
    });

    socket.on('msg', (data) => {
      data.id = messageIndex;
      messageBuffer[messageIndex % bufferSize] = data;
      messageIndex++;
      io.emit('msg', data);
    });
  });
  io.listen(runnable);

} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
