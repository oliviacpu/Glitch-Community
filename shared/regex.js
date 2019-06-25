const defaultProjectDescriptionPattern = /A|The [a-z]{2,} project that does [a-z]{2,} things/g;
const emojiPattern = /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;

module.exports = {
  defaultProjectDescriptionPattern,
  emojiPattern,
};
