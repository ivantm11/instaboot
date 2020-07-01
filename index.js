const credentials = require("./loginInstagram");
const hashtags = require("./hashtags");
const insta = require("./instagram");

const user = credentials[0];
const pass = credentials[1];
const tags = hashtags;
const cantPosts = 7;
const lang = "es";

(async () => {
  await insta.initialize(lang);
  await insta.login(user, pass);
  await insta.likearALV(tags, cantPosts);
  await insta.alv();
})();
