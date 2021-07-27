'use strict';
const axios = require(`axios`);
const moment = require(`moment`);
const path = require(`path`);
const multer = require(`multer`);
const nanoid = require(`nanoid`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const {getLogger} = require(`./logger`);
const {HttpCode} = require(`./constants`);
const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} = require(`./db-service/config`);

const saltRounds = 10;
const logger = getLogger();

const UPLOAD_DIR = `./express/upload/img`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const FileType = [`image/png`, `image/jpg`, `image/jpeg`];

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  return cb(null, FileType.includes(file.mimetype));
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getData = async (routePath) => {
  try {
    const content = await axios.get(routePath);
    return content.data;
  } catch (err) {
    logger.error(`Error: ${err.message}`);
    throw err;
  }
};

const normalizeDateFormat = (date) => {
  const dateString = date.split(`T`);
  return moment(dateString[0]).format();
};

const changeDateView = (date) => {
  return moment(date).format(`DD.MM.YYYY, HH:mm`);
};

const changeDateViewOnlyDate = (date) => {
  return moment(date).format(`DD.MM.YYYY`);
};

const changeDateViewForCalendar = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

const renderError = (errStatus, res) => {
  if (errStatus >= HttpCode.INTERNAL_SERVER_ERROR) {
    res.status(errStatus).render(`errors/500`);
  } else {
    res.status(errStatus).render(`errors/400`);
  }
};

const getPassHashSum = async (pass) => {
  const hash = await bcrypt.hash(pass, saltRounds);
  return hash;
};

const createTokens = (tokenData) => {
  const accessToken = jwt.sign(tokenData, JWT_ACCESS_SECRET, {expiresIn: `20m`});
  const refreshToken = jwt.sign(tokenData, JWT_REFRESH_SECRET);
  return {accessToken, refreshToken};
};

const comparePassHashSum = async (user, pass) => {
  const match = await bcrypt.compare(pass, user.password);
  return match;
};

const upload = multer({
  storage,
  fileFilter
});

const getUserData = (data) => {

  if (!data) {
    return {
      id: ``,
      avatar: ``,
      userName: ``,
      role: ``
    };
  }

  const {id, avatar, firstname, lastname, role} = data;
  return {
    id,
    avatar,
    userName: `${firstname} ${lastname}`,
    role
  };
};

module.exports = {
  getRandomInt,
  shuffle,
  getData,
  normalizeDateFormat,
  changeDateView,
  changeDateViewOnlyDate,
  changeDateViewForCalendar,
  renderError,
  getPassHashSum,
  createTokens,
  comparePassHashSum,
  upload,
  getUserData
};
