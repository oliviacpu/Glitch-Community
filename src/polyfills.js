// Polyfills that aren't done using babel go here
// In general we want to manage them with babel

/* eslint-disable no-extend-native */
import 'details-element-polyfill';
import 'url-search-params-polyfill';
import 'intersection-observer';
if (!String.prototype.trimStart) {
  String.prototype.trimStart = String.prototype.trimLeft;
}
if (!String.prototype.trimEnd) {
  String.prototype.trimEnd = String.prototype.trimRight;
}
/* eslint-enable no-extend-native */
