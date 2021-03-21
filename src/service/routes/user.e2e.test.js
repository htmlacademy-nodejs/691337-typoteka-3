'use strict';
process.argv.push(`--server`);

const request = require(`supertest`);
const nanoid = require(`nanoid`);
const app = require(`../cli/app`);
const {HttpCode, RegisterMessage, LoginMessage} = require(`../../constants`);

const newEmail = nanoid(6);

const newReader = {
  valid: {
    firstname: `Viktor`,
    lastname: `Kotov`,
    email: `${newEmail}@gn.com.ua`,
    pass: `123456`,
    repeatPass: `123456`,
    avatar: `avatar-1.jpg`
  },
  notValid: {
    firstname: `Viktor&<>`,
    lastname: `Kotov@`,
    email: `vik@gn`,
    pass: `12345`,
    repeatPass: `1234567`,
    avatar: ``
  }
};

const errorsList = [
  RegisterMessage.WRONG_READER_FIRSTNAME,
  RegisterMessage.WRONG_READER_LASTNAME,
  RegisterMessage.WRONG_EMAIL,
  RegisterMessage.MIN_PASSWORD_LENGTH,
  RegisterMessage.PASSWORDS_NOT_EQUAL,
  RegisterMessage.AVATAR_EMPTY_VALUE
];

test(`When create user status code should be 201`, async () => {
  const res = await request(app).post(`/api/user`).send(newReader.valid);
  expect(res.statusCode).toBe(HttpCode.CREATED);
});
test(`When create user with an existing email status code should be 400`, async () => {
  const res = await request(app).post(`/api/user`).send(newReader.valid);
  expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  expect(res.body).toEqual([RegisterMessage.READER_ALREADY_REGISTER]);
});
test(`When not valid data sent`, async () => {
  const res = await request(app).post(`/api/user`)
  .send(newReader.notValid);
  expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  expect(res.body).toEqual(errorsList);
});
test(`When not correct login data sent`, async () => {
  const res = await request(app).post(`/api/user/login`).send({
    email: newReader.notValid.email,
    pass: newReader.notValid.pass
  });
  expect(res.body).toEqual([{loginError: LoginMessage.READER_NOT_EXISTS}]);
});
test(`When not correct password sent`, async () => {
  const res = await request(app).post(`/api/user/login`).send({
    email: newReader.valid.email,
    pass: newReader.notValid.pass
  });
  expect(res.body).toEqual([{passError: LoginMessage.WRONG_PASSWORD}]);
});
