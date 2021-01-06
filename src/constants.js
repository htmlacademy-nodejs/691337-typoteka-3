'use strict';

module.exports.USER_ARGV_INDEX = 2;
module.exports.DEFAULT_COMMAND = `--help`;
module.exports.URL = `http://localhost:3000/api`;
module.exports.ExitCode = {
  success: 0,
  error: 1,
};
module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

module.exports.ArticleMessage = {
  REQUIRED_FIELD: `Поле обязательно для заполнения`,
  MIN_TITLE_LENGTH: `Заголовок должен быть не меньше 30 символов`,
  MAX_TITLE_LENGTH: `Заголовок должен быть не больше 250 символов`,
  MIN_ANNOUNCE_LENGTH: `Анонс должен быть не меньше 30 символов`,
  MAX_ANNOUNCE_LENGTH: `Анонс должен быть не больше 250 символов`,
  MAX_TEXT_LENGTH: `Текст публикации должен быть не больше 1000 символов`,
  CATEGORY_REQUIRED: `Необходимо выбрать минимум 1 категорию`
};

module.exports.RegisterMessage = {
  USER_ALREADY_REGISTER: `Пользователь с таким email уже зарегистрирован`,
  REQUIRED_FIELD: `Поле обязательно для заполнения`,
  WRONG_EMAIL: `Некорректный email`,
  WRONG_USERNAME: `Имя не должно содержать цифр и специальных символов`,
  MIN_PASSWORD_LENGTH: `Пароль должен быть не меньше 6 символов`,
  PASSWORDS_NOT_EQUAL: `Пароли не совпадают`,
  AVATAR_EMPTY_VALUE: `Отсутствует аватар`
};
