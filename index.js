const insta = require('./instagram');
const credentials = require('./loginInstagram');
const hashtags = require('./hashtags');

const user = credentials[0];
const pass = credentials[1];
const tags = hashtags;
const cantPosts = 5;

(async () => {
    await insta.initialize()
    await insta.login(user, pass)
    await insta.likesCerdisimos(tags, cantPosts)
    await insta.alv()
})()