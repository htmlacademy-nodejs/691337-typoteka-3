'use strict';

const CONTENT_LENGTH = 100;

const socket = io();
const discussedArticles = document.querySelector(`.hot__list`);
const lastCommentsList = document.querySelector(`.last__list`);

const addLastComments = (lastComments) => {
  const content = lastComments.map((it) => {
    const avatar = it.readerId.avatar === `` ? `/img/icons/smile.svg` : `/img/${it.readerId.avatar}`;
    const text = it.text.length > CONTENT_LENGTH ? `${it.text.slice(0, CONTENT_LENGTH)}...` : it.text;
    return `
    <li class="last__list-item">
    <img class="last__list-image" src=${avatar} width="20" height="20" alt="Аватар пользователя">
    <b class="last__list-name">${it.readerId.firstname} ${it.readerId.lastname}</b>
    <a class="last__list-link" href="/articles/${it.articleId}">${text}</a>
    </li>`;
  }).join(``);

  lastCommentsList.innerHTML = ``;
  lastCommentsList.insertAdjacentHTML(`afterbegin`, content);
};

const addDiscussedArticles = (articles) => {

  const content = articles.map((it) => {
    const announce = it.announce.length > CONTENT_LENGTH ? `${it.announce.slice(0, CONTENT_LENGTH)}...` : it.announce;
    return `
    <li class="hot__list-item">
      <a class="hot__list-link" href="/articles/${it.id}">${announce}
        <sup class="hot__link-sup">${it.commentsAmount}</sup>
      </a>
    </li>`;
  }).join(``);

  discussedArticles.innerHTML = ``;
  discussedArticles.insertAdjacentHTML(`afterbegin`, content);
};

socket.on(`discussed_articles`, (articles) => {
  addDiscussedArticles(articles);
});
socket.on(`last_comments`, (lastComments) => {
  addLastComments(lastComments);
});
