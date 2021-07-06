'use strict';

const socket = io();
const status = document.querySelector(`.hot__name`);
const discussedArticles = document.querySelector(`.hot__list`);
const lastCommentsList = document.querySelector(`.last__list`);

const setStatus = (value) => {
  status.textContent = value;
};

//между li вставляются запятые. Разобраться, как их убрать.
const addLastComments = (lastComments) => {
  const content = lastComments.map((it) => {
    const avatar = it.readerId.avatar === `` ? `/img/icons/smile.svg` : `/img/${it.readerId.avatar}`;
    return `
    <li class="last__list-item">
    <img class="last__list-image" src=${avatar} width="20" height="20" alt="Аватар пользователя">
    <b class="last__list-name">${it.readerId.firstname} ${it.readerId.lastname}</b>
    <a class="last__list-link" href="/articles/${it.articleId}">${it.text}</a>
    </li>`;
  });

  lastCommentsList.innerHTML = ``;
  lastCommentsList.insertAdjacentHTML(`afterbegin`, content);
};

socket.on(`connect`, () => setStatus(`ONLINE`));
socket.on(`disconnect`, () => setStatus(`DISCONNECTED`));
/*socket.on(`discussed_articles`, (message) => {
  addDiscussedArticles(message);
});*/
socket.on(`last_comments`, (lastComments) => {
  addLastComments(lastComments);
});
