'use strict';

const express = require(`express`);
const http = require(`http`);
const socketIO = require(`socket.io`);
const path = require(`path`);
const cookieParser = require(`cookie-parser`);
const {getLogger} = require(`../logger`);
const mainRouter = require(`./routes/main`);
const myRouter = require(`./routes/my`);
const articlesRouter = require(`./routes/articles`);

const PORT = 8080;
const PUBLIC_DIR = `../../public`;
const UPLOAD_DIR = `upload`;

const logger = getLogger();
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cookieParser());
app.use(`/`, mainRouter);
app.use(`/my`, myRouter);
app.use(`/articles`, articlesRouter);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);
app.set(`io`, io);

server.listen(PORT, () => {
  logger.info(`Server start on ${PORT}`);
})
.on(`err`, (err) => {
  logger.error(`Server can't start. Error: ${err}`);
});

io.on(`connection`, (socket) => {
  const {address: ip} = socket.handshake;
  logger.info(`Client on: ${ip}`);
  socket.on(`disconnect`, () => {
    logger.info(`Client off`);
  });
});

