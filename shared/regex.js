const defaultProjectDescriptionPattern = /A|The [a-z]{2,} project that does [a-z]{2,} things/g;
const emojiPattern = /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g;

module.exports = {
  defaultProjectDescriptionPattern,
  emojiPattern,
};
