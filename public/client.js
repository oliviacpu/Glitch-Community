/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"client": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({"c3-bundle":"c3-bundle"}[chunkId]||chunkId) + ".js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							var error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/client.jsx","react","curated","dependencies"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./shared/dayjs-convert.js":
/*!*********************************!*\
  !*** ./shared/dayjs-convert.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function convertPlugin(option, dayjsClass, dayjsFactory) {
  dayjsFactory.convert = (amount, from, to) => {
    const now = dayjsFactory();
    return now.add(amount, from).diff(now, to);
  };
};

/***/ }),

/***/ "./src/app.jsx":
/*!*********************!*\
  !*** ./src/app.jsx ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _errorBoundary = _interopRequireDefault(__webpack_require__(/*! ./presenters/includes/error-boundary.jsx */ "./src/presenters/includes/error-boundary.jsx"));

var _analytics = __webpack_require__(/*! ./presenters/analytics */ "./src/presenters/analytics.jsx");

var _currentUser = __webpack_require__(/*! ./presenters/current-user.jsx */ "./src/presenters/current-user.jsx");

var _userPrefs = __webpack_require__(/*! ./presenters/includes/user-prefs.jsx */ "./src/presenters/includes/user-prefs.jsx");

var _devToggles = __webpack_require__(/*! ./presenters/includes/dev-toggles.jsx */ "./src/presenters/includes/dev-toggles.jsx");

var _notifications = __webpack_require__(/*! ./presenters/notifications.jsx */ "./src/presenters/notifications.jsx");

var _router = _interopRequireDefault(__webpack_require__(/*! ./presenters/pages/router */ "./src/presenters/pages/router.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const App = function App() {
  return _react.default.createElement(_errorBoundary.default, {
    fallback: "Something went very wrong, try refreshing?"
  }, _react.default.createElement(_reactRouterDom.BrowserRouter, null, _react.default.createElement(_notifications.Notifications, null, _react.default.createElement(_userPrefs.UserPrefsProvider, null, _react.default.createElement(_devToggles.DevTogglesProvider, null, _react.default.createElement(_analytics.AnalyticsContext, {
    context: {
      groupId: '0'
    }
  }, _react.default.createElement(_currentUser.CurrentUserProvider, null, function (api) {
    return _react.default.createElement(_router.default, {
      api: api
    });
  })))))));
};

var _default = App;
exports.default = _default;

/***/ }),

/***/ "./src/client.jsx":
/*!************************!*\
  !*** ./src/client.jsx ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _sentry = __webpack_require__(/*! ./utils/sentry */ "./src/utils/sentry.js");

__webpack_require__(/*! ./polyfills.js */ "./src/polyfills.js");

var _dayjs = _interopRequireDefault(__webpack_require__(/*! dayjs */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/dayjs/1.8.0/node_modules/dayjs/dayjs.min.js"));

var _relativeTime = _interopRequireDefault(__webpack_require__(/*! dayjs/plugin/relativeTime */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/dayjs/1.8.0/node_modules/dayjs/plugin/relativeTime.js"));

var _dayjsConvert = _interopRequireDefault(__webpack_require__(/*! ../shared/dayjs-convert */ "./shared/dayjs-convert.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _reactDom = __webpack_require__(/*! react-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-dom/16.6.3/node_modules/react-dom/index.js");

var _app = _interopRequireDefault(__webpack_require__(/*! ./app.jsx */ "./src/app.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

_dayjs.default.extend(_relativeTime.default);

_dayjs.default.extend(_dayjsConvert.default);

// Here's a bunch of browser support tests
// If any of them don't work we can't run in this browser

/* eslint-disable no-unused-vars */
let x = {
  a: 1,
  b: 2
}; // Can we use let?

const y = [1, 2, 3]; // Can we use const?

const aRest = _objectWithoutPropertiesLoose(x, ["a"]); // Can we use object destructuring?


const [b, ...bRest] = y; // Can we use array destructuring?

const str = `${b}23`; // Can we use formatted strings?

const func = function func(f, ...args) {
  return f(...args);
}; // Can we define arrow functions?


func(async function (arg) {
  return await arg;
}, Promise.resolve()); // Can we do async/await?

new URLSearchParams(); // Do we have URLSearchParams? 

/* eslint-enable no-unused-vars */
// Assuming none of them threw, set the global bootstrap function.
// This will get used to check for compatibility in index.ejs
// If it isn't there, the browser is unsupported.

window.bootstrap = function () {
  if (location.hash.startsWith("#!/")) {
    window.location.replace(EDITOR_URL + window.location.hash);
    return;
  } // Mark that bootstrapping has occurred,
  // ..and more importantly, use this as an excuse
  // to call into Sentry so that its initialization
  // happens early in our JS bundle.


  (0, _sentry.configureScope)(function (scope) {
    scope.setTag("bootstrap", "true");
  });
  const dom = document.createElement('div');
  document.body.appendChild(dom);
  (0, _reactDom.render)(_react.default.createElement(_app.default, null), dom);
};

/***/ }),

/***/ "./src/models/collection.js":
/*!**********************************!*\
  !*** ./src/models/collection.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getAvatarUrl = getAvatarUrl;
exports.getOwnerLink = getOwnerLink;
exports.getLink = getLink;
exports.defaultAvatarSVG = exports.hexToRgbA = exports.getContrastTextColor = exports.defaultAvatar = exports.FALLBACK_AVATAR_URL = void 0;

var _team = __webpack_require__(/*! ./team */ "./src/models/team.js");

var _user = __webpack_require__(/*! ./user */ "./src/models/user.js");

/* global CDN_URL */
const FALLBACK_AVATAR_URL = "https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1541449590339";
exports.FALLBACK_AVATAR_URL = FALLBACK_AVATAR_URL;
const defaultAvatar = "https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1540389405633"; // from http://dannyruchtie.com/color-contrast-calculator-with-yiq/

exports.defaultAvatar = defaultAvatar;

const getContrastTextColor = function getContrastTextColor(hex) {
  if (hex) {
    hex = hex.substring(1);
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }

  return 'black';
}; // from https://stackoverflow.com/a/21648508/1720985


exports.getContrastTextColor = getContrastTextColor;

const hexToRgbA = function hexToRgbA(hex) {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let c = hex.substring(1).split('');

    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }

    c = '0x' + c.join('');
    return 'rgba(' + [c >> 16 & 255, c >> 8 & 255, c & 255].join(',') + ',0.5)';
  }

  return false;
};

exports.hexToRgbA = hexToRgbA;

function getAvatarUrl(id) {
  return `${CDN_URL}/collection-avatar/${id}.png`;
}

function getOwnerLink(collection) {
  if (collection.team) {
    return (0, _team.getLink)(collection.team);
  }

  if (collection.user) {
    return (0, _user.getLink)(collection.user);
  }

  throw new Error('This collection has no team or user field!');
}

function getLink(collection) {
  return `${getOwnerLink(collection)}/${collection.url}`;
} // Circular dependencies must go below module.exports
// eventually want to handle whether the collection belongs to a team or a user


const defaultAvatarSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="159px" height="147px" viewBox="0 0 159 147" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><!-- Generator: Sketch 52.3 (67297) - http://www.bohemiancoding.com/sketch --><title>collection-avatar</title><desc>Created with Sketch.</desc><defs><polygon id="path-1" points="0 0 159 0 159 132 0 132"></polygon><polygon id="path-3" points="0 0 124 0 124 102 0 102"></polygon></defs><g id="collection-avatar" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><polygon id="frame" fill="#FFFB98" points="0 147 159 147 159 15 0 15"></polygon><rect id="Rectangle" stroke="#979797" fill="#FFFFFF" fill-rule="nonzero" x="19.5" y="34.5" width="119" height="93"></rect><polygon class="background" fill="#45C1F7" points="17 132 141 132 141 30 17 30"></polygon><g id="picture-frame-copy"><g id="Group-4" transform="translate(0.000000, 15.000000)"><mask id="mask-2" fill="white"><use xlink:href="#path-1"></use></mask><g id="Clip-3"></g><path d="M4.41666667,127.550562 L154.583333,127.550562 L154.583333,4.4494382 L4.41666667,4.4494382 L4.41666667,127.550562 Z M159,136.449438 L-3.55271368e-15,136.449438 C-2.43947222,136.449438 -4.41666667,134.457573 -4.41666667,132 L-4.41666667,4.4408921e-15 C-4.41666667,-2.45757303 -2.43947222,-4.4494382 -3.55271368e-15,-4.4494382 L159,-4.4494382 C161.439472,-4.4494382 163.416667,-2.45757303 163.416667,4.4408921e-15 L163.416667,132 C163.416667,134.457573 161.439472,136.449438 159,136.449438 Z" id="Fill-2" fill="#222222" mask="url(#mask-2)"></path></g><g id="Group-9" transform="translate(63.000000, 0.000000)" fill="#222222"><path d="M5.39511061,14.06 L29.8773227,14.06 C28.7177318,8.99988 23.6693227,5.18 17.6362167,5.18 C11.6031106,5.18 6.55617121,8.99988 5.39511061,14.06 M32.3331864,18.5 L2.93924697,18.5 C1.72086818,18.5 0.734701515,17.50692 0.734701515,16.28 C0.734701515,7.7108 8.31686818,0.74 17.6362167,0.74 C26.9555652,0.74 34.5377318,7.7108 34.5377318,16.28 C34.5377318,17.50692 33.5515652,18.5 32.3331864,18.5" id="Fill-5"></path><polygon id="Fill-7" points="92.9008682 146.683984 73.3215652 130.551984 76.1139894 127.115424 95.6932924 143.247424"></polygon></g><g id="Group-13" transform="translate(17.000000, 30.000000)"><mask id="mask-4" fill="white"><use xlink:href="#path-3"></use></mask><g id="Clip-12"></g><path d="M4.42857143,97.5652174 L119.571429,97.5652174 L119.571429,4.43478261 L4.42857143,4.43478261 L4.42857143,97.5652174 Z M124,106.434783 L-8.8817842e-14,106.434783 C-2.44604762,106.434783 -4.42857143,104.449478 -4.42857143,102 L-4.42857143,-2.48689958e-14 C-4.42857143,-2.44947826 -2.44604762,-4.43478261 -8.8817842e-14,-4.43478261 L124,-4.43478261 C126.446048,-4.43478261 128.428571,-2.44947826 128.428571,-2.48689958e-14 L128.428571,102 C128.428571,104.449478 126.446048,106.434783 124,106.434783 Z" id="Combined-Shape" fill="#222222" mask="url(#mask-4)"></path><path d="" id="Path-2" stroke="#979797" fill-rule="nonzero" mask="url(#mask-4)"></path></g><g id="corners" transform="translate(0.000000, 16.000000)" fill="#222222"><polygon id="Fill-14" points="140.496387 18 138 14.8389049 155.503613 0 158 3.16109514"></polygon><polygon id="Fill-15" points="17.5036132 18 0 3.16109514 2.49638681 0 20 14.8389049"></polygon><polygon id="Fill-16" points="2.74602549 131 0 127.487672 19.2539745 111 22 114.512328"></polygon></g><path d="M19.4882812,94.8593842 C44.7643229,101.507816 67.0872396,101.059896 86.4570312,93.515625 C115.511719,82.1992188 108.802734,83.5839844 116.876953,81.3066406 C124.951172,79.0292969 136.530273,77.3828125 138.008789,78.2841797 C138.068685,83.0810547 138.235352,100.222656 138.508789,129.708984 C70.5751953,130.298828 31.0029297,130.347656 19.7919922,129.855469 C19.9182943,114.765309 19.8170573,103.099947 19.4882812,94.8593842 Z" id="Path-3" stroke="#222222" stroke-width="4" fill="#05D458" fill-rule="nonzero"></path></g><circle id="Oval" stroke="#000000" stroke-width="4" fill="#E8DE1B" fill-rule="nonzero" cx="40.8486328" cy="59.6357422" r="16"></circle><path d="M60.3348254,77.5704551 C58.9993547,80.6825277 55.8689424,82.8666205 52.2201169,82.8666205 C51.0942738,82.8666205 50.017785,82.6586888 49.0281483,82.2797234 C47.8967722,83.2670781 46.4079181,83.8666205 44.7767575,83.8666205 C41.2366977,83.8666205 38.3669121,81.042731 38.3669121,77.5592868 C38.3669121,74.362029 40.7845266,71.7204047 43.9190364,71.3079336 C44.4206293,69.9153121 45.2738944,68.6864115 46.3737706,67.7246127 C46.0662734,66.8112197 45.8994141,65.8316421 45.8994141,64.8125 C45.8994141,59.8419373 49.8685147,55.8125 54.7646484,55.8125 C58.4425588,55.8125 61.5973616,58.0862365 62.9395833,61.3246338 C63.8172067,61.0552858 64.7505289,60.9101562 65.7182989,60.9101562 C70.8661431,60.9101562 75.0392954,65.0165679 75.0392954,70.0820833 C75.0392954,75.1475988 70.8661431,79.2540104 65.7182989,79.2540104 C63.7128485,79.2540104 61.8553227,78.6307987 60.3348254,77.5704551 Z" id="Combined-Shape" stroke="#000000" stroke-width="4" fill="#FFFFFF" fill-rule="nonzero"></path><path d="M121.554267,48.9330178 C121.561107,48.9330067 121.567948,48.9330011 121.57479,48.9330011 C128.315872,48.9330011 133.780598,54.3103309 133.780598,60.9436034 C133.780598,67.5768759 128.315872,72.9542057 121.57479,72.9542057 C118.736067,72.9542057 116.123683,72.0006337 114.050407,70.4012578 C112.497386,71.7531025 110.455645,72.5736517 108.21914,72.5736517 C103.3565,72.5736517 99.4145508,68.6947458 99.4145508,63.9098727 C99.4145508,62.7888762 99.6309116,61.7176053 100.024784,60.7342885 C98.6643533,59.5776974 97.8034355,57.8676186 97.8034355,55.9596774 C97.8034355,52.4762332 100.673221,49.6523438 104.213281,49.6523438 C104.670308,49.6523438 105.116163,49.69941 105.546114,49.7888854 C106.871499,46.5129316 110.045383,44.2060547 113.75,44.2060547 C117.122846,44.2060547 120.055763,46.1182434 121.554267,48.9330178 Z" id="Combined-Shape-Copy" stroke="#000000" stroke-width="4" fill="#FFFFFF" fill-rule="nonzero"></path><path d="M82.3606089,42.5137208 C86.0065614,42.5895456 88.9384448,45.5215419 88.9384448,49.1273647 C88.9384448,52.7808104 85.928606,55.7425133 82.2157816,55.7425133 C79.6428183,55.7425133 77.4074568,54.3201849 76.2774254,52.2309783 C75.8404163,52.3576604 75.3778461,52.425639 74.8991407,52.425639 C72.2100723,52.425639 70.0301517,50.2805815 70.0301517,47.634519 C70.0301517,44.9884565 72.2100723,42.843399 74.8991407,42.843399 C75.2392876,42.843399 75.5712879,42.8777207 75.8917602,42.9430366 C76.3155392,41.4927371 77.63826,40.4348278 79.2043688,40.4348278 C80.6113173,40.4348278 81.8218341,41.2886374 82.3606089,42.5137208 Z" id="Combined-Shape-Copy-2" stroke="#000000" stroke-width="4" fill="#FFFFFF" fill-rule="nonzero" transform="translate(79.484298, 48.088671) rotate(-27.000000) translate(-79.484298, -48.088671) "></path></g>
</svg>`;
exports.defaultAvatarSVG = defaultAvatarSVG;

/***/ }),

/***/ "./src/models/project.js":
/*!*******************************!*\
  !*** ./src/models/project.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getAvatarUrl = getAvatarUrl;
exports.getLink = getLink;
exports.getShowUrl = getShowUrl;
exports.getEditorUrl = getEditorUrl;
exports.getRemixUrl = getRemixUrl;
exports.FALLBACK_AVATAR_URL = void 0;

/* global CDN_URL EDITOR_URL PROJECTS_DOMAIN */
const FALLBACK_AVATAR_URL = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffallback-project-avatar.svg?1528812220123";
exports.FALLBACK_AVATAR_URL = FALLBACK_AVATAR_URL;

function getAvatarUrl(id, cdnUrl = CDN_URL) {
  return `${cdnUrl}/project-avatar/${id}.png`;
}

function getLink({
  domain
}) {
  return `/~${domain}`;
}

function getShowUrl(domain, projectsDomain = PROJECTS_DOMAIN) {
  return `//${domain}.${projectsDomain}`;
}

function getEditorUrl(domain, path, line, character, editorUrl = EDITOR_URL) {
  if (path && !isNaN(line) && !isNaN(character)) {
    return `${editorUrl}#!/${domain}?path=${path}:${line}:${character}`;
  }

  return `${editorUrl}#!/${domain}`;
}

function getRemixUrl(domain, editorUrl = EDITOR_URL) {
  return `${editorUrl}#!/remix/${domain}`;
}

/***/ }),

/***/ "./src/models/team.js":
/*!****************************!*\
  !*** ./src/models/team.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getProfileStyle = exports.getCoverUrl = exports.getAvatarStyle = exports.getAvatarUrl = exports.getLink = exports.DEFAULT_TEAM_AVATAR = void 0;

/* globals CDN_URL */
const cacheBuster = Math.floor(Math.random() * 1000);
const DEFAULT_TEAM_AVATAR = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-team-avatar.svg?1503510366819";
exports.DEFAULT_TEAM_AVATAR = DEFAULT_TEAM_AVATAR;

const getLink = function getLink({
  url
}) {
  return `/@${url}`;
};

exports.getLink = getLink;

const getAvatarUrl = function getAvatarUrl({
  id,
  hasAvatarImage,
  cache = cacheBuster,
  size = 'large'
}) {
  const customImage = `${CDN_URL}/team-avatar/${id}/${size}?${cache}`;
  return hasAvatarImage ? customImage : DEFAULT_TEAM_AVATAR;
};

exports.getAvatarUrl = getAvatarUrl;

const getAvatarStyle = function getAvatarStyle({
  id,
  hasAvatarImage,
  backgroundColor,
  cache,
  size
}) {
  const image = getAvatarUrl({
    id,
    hasAvatarImage,
    cache,
    size
  });

  if (hasAvatarImage) {
    return {
      backgroundImage: `url('${image}')`
    };
  }

  return {
    backgroundColor,
    backgroundImage: `url('${image}')`
  };
};

exports.getAvatarStyle = getAvatarStyle;

const getCoverUrl = function getCoverUrl({
  id,
  hasCoverImage,
  cache = cacheBuster,
  size = 'large'
}) {
  const customImage = `${CDN_URL}/team-cover/${id}/${size}?${cache}`;
  const defaultImage = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625";
  return hasCoverImage ? customImage : defaultImage;
};

exports.getCoverUrl = getCoverUrl;

const getProfileStyle = function getProfileStyle({
  id,
  hasCoverImage,
  coverColor,
  cache,
  size
}) {
  const image = getCoverUrl({
    id,
    hasCoverImage,
    cache,
    size
  });
  return {
    backgroundColor: coverColor,
    backgroundImage: `url('${image}')`
  };
};

exports.getProfileStyle = getProfileStyle;

/***/ }),

/***/ "./src/models/user.js":
/*!****************************!*\
  !*** ./src/models/user.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getDisplayName = getDisplayName;
exports.getLink = getLink;
exports.getAvatarUrl = getAvatarUrl;
exports.getAvatarThumbnailUrl = getAvatarThumbnailUrl;
exports.getAvatarStyle = getAvatarStyle;
exports.getProfileStyle = getProfileStyle;
exports.ANON_AVATAR_URL = void 0;

/* globals CDN_URL */
const cacheBuster = Math.floor(Math.random() * 1000);
const ANON_AVATAR_URL = "https://cdn.glitch.com/f6949da2-781d-4fd5-81e6-1fdd56350165%2Fanon-user-on-project-avatar.svg?1488556279399";
exports.ANON_AVATAR_URL = ANON_AVATAR_URL;

function getDisplayName({
  login,
  name
}) {
  if (name) {
    return name;
  } else if (login) {
    return `@${login}`;
  }

  return 'Anonymous User';
}

function getLink({
  id,
  login
}) {
  if (login) {
    return `/@${login}`;
  }

  return `/user/${id}`;
}

function getAvatarUrl({
  login,
  avatarUrl
}) {
  if (login && avatarUrl) {
    return avatarUrl;
  }

  return ANON_AVATAR_URL;
}

function getAvatarThumbnailUrl({
  login,
  avatarThumbnailUrl
}) {
  if (login && avatarThumbnailUrl) {
    return avatarThumbnailUrl;
  }

  return ANON_AVATAR_URL;
}

function getAvatarStyle({
  avatarUrl,
  color
}) {
  return {
    backgroundColor: color,
    backgroundImage: `url('${avatarUrl || ANON_AVATAR_URL}')`
  };
}

function getProfileStyle({
  id,
  hasCoverImage,
  coverColor,
  cache = cacheBuster,
  size = 'large'
}) {
  const customImage = `${CDN_URL}/user-cover/${id}/${size}?${cache}`;
  const defaultImage = "https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625";
  return {
    backgroundColor: coverColor,
    backgroundImage: `url('${hasCoverImage ? customImage : defaultImage}')`
  };
}

/***/ }),

/***/ "./src/models/words.js":
/*!*****************************!*\
  !*** ./src/models/words.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getCollection = exports.getCollectionPair = exports.getTeamPair = exports.getWordPair = exports.getPredicate = exports.getCollectionPairs = exports.getCollections = exports.getObjects = exports.getPredicates = void 0;

var _axios = _interopRequireDefault(__webpack_require__(/*! axios */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/axios/0.18.0/node_modules/axios/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const api = _axios.default.create({
  baseURL: 'https://friendly-words.glitch.me/'
});

const getData = async function getData(name) {
  const {
    data
  } = await api.get(name);
  return data;
};

const getPredicates = function getPredicates() {
  return getData('predicates');
};

exports.getPredicates = getPredicates;

const getObjects = function getObjects() {
  return getData('objects');
};

exports.getObjects = getObjects;

const getCollections = function getCollections() {
  return getData('collections');
};

exports.getCollections = getCollections;

const getCollectionPairs = function getCollectionPairs() {
  return getData('collection-pairs');
};

exports.getCollectionPairs = getCollectionPairs;

const getFirst = async function getFirst(name) {
  const data = await getData(name);
  return data[0];
};

const getPredicate = function getPredicate() {
  return getFirst('predicates');
};

exports.getPredicate = getPredicate;

const getWordPair = function getWordPair() {
  return getFirst('word-pairs');
};

exports.getWordPair = getWordPair;

const getTeamPair = function getTeamPair() {
  return getFirst('team-pairs');
};

exports.getTeamPair = getTeamPair;

const getCollectionPair = function getCollectionPair() {
  return getFirst('collection-pairs');
};

exports.getCollectionPair = getCollectionPair;

const getCollection = function getCollection() {
  return getFirst('collections');
};

exports.getCollection = getCollection;

/***/ }),

/***/ "./src/polyfills.js":
/*!**************************!*\
  !*** ./src/polyfills.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! details-element-polyfill */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/details-element-polyfill/2.2.0/node_modules/details-element-polyfill/dist/details-element-polyfill.js");

/// Polyfills that aren't done using babel go here
// In general we want to manage them with babel
if (!String.prototype.trimStart) {
  String.prototype.trimStart = String.prototype.trimLeft;
}

if (!String.prototype.trimEnd) {
  String.prototype.trimEnd = String.prototype.trimRight;
}

/***/ }),

/***/ "./src/presenters/analytics.jsx":
/*!**************************************!*\
  !*** ./src/presenters/analytics.jsx ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.TrackedExternalLink = exports.TrackClick = exports.AnalyticsTracker = exports.AnalyticsContext = void 0;

var _omit2 = _interopRequireDefault(__webpack_require__(/*! lodash/omit */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/omit.js"));

var _isFunction2 = _interopRequireDefault(__webpack_require__(/*! lodash/isFunction */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/isFunction.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _sentry = __webpack_require__(/*! ../utils/sentry */ "./src/utils/sentry.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const Context = _react.default.createContext({
  properties: {},
  context: {}
});

const resolveProperties = function resolveProperties(properties = {}, inheritedProperties) {
  if ((0, _isFunction2.default)(properties)) {
    return properties(inheritedProperties);
  }

  return Object.assign({}, inheritedProperties, properties);
}; // stick this in the tree to add a property value to any tracking calls within it


const AnalyticsContext = function AnalyticsContext({
  children,
  properties,
  context
}) {
  return _react.default.createElement(Context.Consumer, null, function (inherited) {
    return _react.default.createElement(Context.Provider, {
      value: {
        properties: resolveProperties(properties, inherited.properties),
        context: resolveProperties(context, inherited.context)
      }
    }, children);
  });
};

exports.AnalyticsContext = AnalyticsContext;
AnalyticsContext.propTypes = {
  children: _propTypes.default.node.isRequired,
  properties: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]),
  context: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func])
}; // this gives you a generic track function that pulls in inherited properties

const AnalyticsTracker = function AnalyticsTracker({
  children
}) {
  return _react.default.createElement(Context.Consumer, null, function (inherited) {
    return children(function (name, properties, context) {
      try {
        analytics.track(name, resolveProperties(properties, inherited.properties), resolveProperties(context, inherited.context));
      } catch (error) {
        (0, _sentry.captureException)(error);
      }
    });
  });
};

exports.AnalyticsTracker = AnalyticsTracker;
AnalyticsTracker.propTypes = {
  children: _propTypes.default.func.isRequired
}; // this is the equivalent of doing <AnalyticsTracker>{track => <asdf onClick={() => track('asdf')}/></AnalyticsTracker>
// this won't work for links that do a full page load, because the request will get cancelled by the nav
// use the TrackedExternalLink for that, because it will stall the page for a moment and let the request finish

const TrackClick = function TrackClick({
  children,
  name,
  properties,
  context
}) {
  return _react.default.createElement(AnalyticsTracker, null, function (track) {
    return _react.default.Children.map(children, function (child) {
      function onClick(...args) {
        track(name, properties, context);

        if (child.props.onClick) {
          return child.props.onClick(...args);
        }
      }

      return _react.default.cloneElement(child, {
        onClick
      });
    });
  });
};

exports.TrackClick = TrackClick;
TrackClick.propTypes = {
  children: _propTypes.default.node.isRequired,
  name: _propTypes.default.string.isRequired,
  properties: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]),
  context: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func])
}; // this pulls in segment's trackLink, which stalls the page load until the analytics request is done
// it forces a full page load at the end, so don't use it for links within the community site

class TrackedExternalLinkWithoutContext extends _react.default.Component {
  constructor(props) {
    super(props);
    this.ref = _react.default.createRef();
  }

  componentDidMount() {
    var _this = this;

    try {
      analytics.trackLink(this.ref.current, function () {
        return _this.props.name;
      }, function () {
        return _this.props.properties;
      });
    } catch (error) {
      (0, _sentry.captureException)(error);
    }
  }

  render() {
    const _this$props = this.props,
          {
      children,
      to
    } = _this$props,
          props = _objectWithoutPropertiesLoose(_this$props, ["children", "to"]);

    return _react.default.createElement("a", _extends({
      href: to
    }, (0, _omit2.default)(props, ['name', 'properties']), {
      ref: this.ref
    }), children);
  }

}

const TrackedExternalLink = function TrackedExternalLink(_ref) {
  let {
    children,
    name,
    properties,
    to
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["children", "name", "properties", "to"]);

  return _react.default.createElement(Context.Consumer, null, function (inherited) {
    return _react.default.createElement(TrackedExternalLinkWithoutContext, _extends({
      to: to,
      name: name,
      properties: resolveProperties(properties, inherited.properties)
    }, props), children);
  });
};

exports.TrackedExternalLink = TrackedExternalLink;
TrackedExternalLink.propTypes = {
  children: _propTypes.default.node.isRequired,
  name: _propTypes.default.string.isRequired,
  properties: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.func]),
  to: _propTypes.default.string.isRequired
};

/***/ }),

/***/ "./src/presenters/categories.jsx":
/*!***************************************!*\
  !*** ./src/presenters/categories.jsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _categories = _interopRequireDefault(__webpack_require__(/*! ../curated/categories */ "./src/curated/categories.js"));

var _link = _interopRequireDefault(__webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Categories = function Categories() {
  return _react.default.createElement("section", {
    className: "categories",
    role: "navigation"
  }, _react.default.createElement("h2", null, "More Ideas"), _react.default.createElement("ul", null, _categories.default.map(function ({
    avatarUrl,
    color,
    id,
    name,
    url
  }) {
    return _react.default.createElement("li", {
      key: id
    }, _react.default.createElement(_link.default, {
      className: "category-box-link",
      to: `/${url}`
    }, _react.default.createElement("div", {
      className: "category-box centered",
      style: {
        backgroundColor: color
      }
    }, _react.default.createElement("img", {
      src: avatarUrl,
      alt: name
    })), _react.default.createElement("div", {
      className: "category-box-label centered",
      style: {
        backgroundColor: color
      }
    }, name)));
  })));
};

var _default = Categories;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/collection-editor.jsx":
/*!**********************************************!*\
  !*** ./src/presenters/collection-editor.jsx ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _currentUser = __webpack_require__(/*! ./current-user.jsx */ "./src/presenters/current-user.jsx");

var _errorHandlers = _interopRequireDefault(__webpack_require__(/*! ./error-handlers.jsx */ "./src/presenters/error-handlers.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class CollectionEditor extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.initialCollection);
  }

  userIsAuthor() {
    if (!this.props.currentUser) return false;
    const currentUserId = this.props.currentUser.id;

    if (this.state.user) {
      return this.state.user.id === currentUserId;
    }

    if (this.state.team) {
      return this.state.team.users.some(function (user) {
        return user.id === currentUserId;
      });
    }

    return false;
  }

  async updateFields(changes) {
    const {
      data
    } = await this.props.api.patch(`collections/${this.state.id}`, changes);
    this.setState(data);
  }

  async addProjectToCollection(project, collection) {
    if (collection.id == this.state.id) {
      // add project to collection page
      this.setState(function ({
        projects
      }) {
        return {
          projects: [...projects, project]
        };
      });
    }

    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  async removeProjectFromCollection(project) {
    await this.props.api.patch(`collections/${this.state.id}/remove/${project.id}`);
    this.setState(function ({
      projects
    }) {
      return {
        projects: projects.filter(function (p) {
          return p.id !== project.id;
        })
      };
    });
  }

  async deleteCollection() {
    await this.props.api.delete(`/collections/${this.state.id}`);
  }

  render() {
    var _this = this;

    const {
      handleError,
      handleErrorForInput
    } = this.props;
    const funcs = {
      addProjectToCollection: function addProjectToCollection(project, collection) {
        return _this.addProjectToCollection(project, collection).catch(handleError);
      },
      removeProjectFromCollection: function removeProjectFromCollection(project) {
        return _this.removeProjectFromCollection(project).catch(handleError);
      },
      deleteCollection: function deleteCollection() {
        return _this.deleteCollection().catch(handleError);
      },
      updateNameAndUrl: function updateNameAndUrl({
        name,
        url
      }) {
        return _this.updateFields({
          name,
          url
        }).catch(handleErrorForInput);
      },
      updateDescription: function updateDescription(description) {
        return _this.updateFields({
          description
        }).catch(handleError);
      },
      updateColor: function updateColor(color) {
        return _this.updateFields({
          coverColor: color
        });
      }
    };
    return this.props.children(this.state, funcs, this.userIsAuthor());
  }

}

CollectionEditor.propTypes = {
  api: _propTypes.default.any.isRequired,
  children: _propTypes.default.func.isRequired,
  currentUser: _propTypes.default.object,
  handleError: _propTypes.default.func.isRequired,
  handleErrorForInput: _propTypes.default.func.isRequired,
  initialCollection: _propTypes.default.object.isRequired
};

const CollectionEditorContainer = function CollectionEditorContainer({
  api,
  children,
  initialCollection
}) {
  return _react.default.createElement(_errorHandlers.default, null, function (errorFuncs) {
    return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
      return _react.default.createElement(CollectionEditor, _extends({
        api,
        currentUser,
        initialCollection
      }, errorFuncs), children);
    });
  });
};

CollectionEditorContainer.propTypes = {
  api: _propTypes.default.any.isRequired,
  children: _propTypes.default.func.isRequired,
  initialCollection: _propTypes.default.object.isRequired
};
var _default = CollectionEditorContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/collection-item.jsx":
/*!********************************************!*\
  !*** ./src/presenters/collection-item.jsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactPluralize = _interopRequireDefault(__webpack_require__(/*! react-pluralize */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-pluralize/1.5.0/node_modules/react-pluralize/build/index.js"));

var _markdown = __webpack_require__(/*! ./includes/markdown.jsx */ "./src/presenters/includes/markdown.jsx");

var _collectionOptionsPop = _interopRequireDefault(__webpack_require__(/*! ./pop-overs/collection-options-pop.jsx */ "./src/presenters/pop-overs/collection-options-pop.jsx"));

var _link = __webpack_require__(/*! ./includes/link */ "./src/presenters/includes/link.jsx");

var _loader = _interopRequireDefault(__webpack_require__(/*! ./includes/loader */ "./src/presenters/includes/loader.jsx"));

var _collectionAvatar = _interopRequireDefault(__webpack_require__(/*! ./includes/collection-avatar.jsx */ "./src/presenters/includes/collection-avatar.jsx"));

var _project = __webpack_require__(/*! ../models/project.js */ "./src/models/project.js");

var _collection = __webpack_require__(/*! ../models/collection */ "./src/models/collection.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ProjectsPreview = function ProjectsPreview({
  projects
}) {
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("ul", {
    className: "projects-preview"
  }, projects.slice(0, 3).map(function (project) {
    return _react.default.createElement("li", {
      key: project.id,
      className: "project-container " + (project.private ? "private" : '')
    }, _react.default.createElement("img", {
      className: "avatar",
      src: (0, _project.getAvatarUrl)(project.id),
      alt: `Project avatar for ${project.domain}`
    }), _react.default.createElement("div", {
      className: "project-name"
    }, project.domain), _react.default.createElement("div", {
      className: "project-badge private-project-badge",
      "aria-label": "private"
    }));
  })), _react.default.createElement("div", {
    className: "collection-link"
  }, "View ", _react.default.createElement(_reactPluralize.default, {
    count: projects.length,
    singular: "project"
  }), " \u2192"));
};

ProjectsPreview.propTypes = {
  projects: _propTypes.default.any.isRequired
};

class CollectionItem extends _react.default.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      collection,
      deleteCollection,
      isAuthorized
    } = this.props;
    return _react.default.createElement("li", null, isAuthorized && _react.default.createElement(_collectionOptionsPop.default, {
      collection: collection,
      deleteCollection: deleteCollection
    }), collection && _react.default.createElement(_link.CollectionLink, {
      collection: collection,
      className: "button-area"
    }, _react.default.createElement("div", {
      className: "collection",
      id: "collection-" + collection.id
    }, _react.default.createElement("div", {
      className: "collection-container"
    }, _react.default.createElement("div", {
      className: "collection-info",
      style: {
        backgroundColor: collection.coverColor
      }
    }, _react.default.createElement("div", {
      className: "avatar-container"
    }, _react.default.createElement("div", {
      className: "avatar"
    }, _react.default.createElement(_collectionAvatar.default, {
      backgroundColor: (0, _collection.hexToRgbA)(collection.coverColor),
      collectionId: collection.id
    }))), _react.default.createElement("div", {
      className: "collection-name-description"
    }, _react.default.createElement("div", {
      className: "button"
    }, _react.default.createElement("span", {
      className: "project-badge private-project-badge",
      "aria-label": "private"
    }), _react.default.createElement("div", {
      className: "project-name"
    }, collection.name)), _react.default.createElement("div", {
      className: "description",
      style: {
        color: (0, _collection.getContrastTextColor)(collection.coverColor)
      }
    }, _react.default.createElement(_markdown.TruncatedMarkdown, {
      length: 96
    }, collection.description))), _react.default.createElement("div", {
      className: "overflow-mask"
    })), collection.projects ? collection.projects.length > 0 ? _react.default.createElement(ProjectsPreview, {
      projects: collection.projects,
      color: collection.coverColor,
      collection: collection
    }) : _react.default.createElement("div", {
      className: "projects-preview empty"
    }, isAuthorized ? _react.default.createElement("p", null, "This collection is empty \u2013 add some projects ", _react.default.createElement("span", {
      role: "img",
      "aria-label": ""
    }, "\u261D\uFE0F")) : _react.default.createElement("p", null, "No projects to see in this collection just yet.")) : _react.default.createElement("div", {
      className: "collection-link"
    }, _react.default.createElement(_loader.default, null))))));
  }

}

CollectionItem.propTypes = {
  collection: _propTypes.default.object.isRequired,
  isAuthorized: _propTypes.default.bool.isRequired,
  deleteCollection: _propTypes.default.func
};
var _default = CollectionItem;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/collections-list.jsx":
/*!*********************************************!*\
  !*** ./src/presenters/collections-list.jsx ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.CollectionsUL = exports.CreateCollectionButton = void 0;

var _orderBy2 = _interopRequireDefault(__webpack_require__(/*! lodash/orderBy */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/orderBy.js"));

var _kebabCase2 = _interopRequireDefault(__webpack_require__(/*! lodash/kebabCase */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/kebabCase.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _analytics = __webpack_require__(/*! ./analytics */ "./src/presenters/analytics.jsx");

var _collectionItem = _interopRequireDefault(__webpack_require__(/*! ./collection-item.jsx */ "./src/presenters/collection-item.jsx"));

var _collection = __webpack_require__(/*! ../models/collection */ "./src/models/collection.js");

var _words = __webpack_require__(/*! ../models/words */ "./src/models/words.js");

var _loader = _interopRequireDefault(__webpack_require__(/*! ./includes/loader.jsx */ "./src/presenters/includes/loader.jsx"));

var _randomcolor = _interopRequireDefault(__webpack_require__(/*! randomcolor */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/randomcolor/0.5.3/node_modules/randomcolor/randomColor.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class CollectionsList extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      deletedCollectionIds: []
    };
    this.deleteCollection = this.deleteCollection.bind(this);
  }

  async deleteCollection(id) {
    this.setState(function ({
      deletedCollectionIds
    }) {
      return {
        deletedCollectionIds: [...deletedCollectionIds, id]
      };
    });
    await this.props.api.delete(`/collections/${id}`);
  }

  render() {
    var _this = this;

    const {
      title,
      api,
      isAuthorized,
      maybeCurrentUser,
      maybeTeam
    } = this.props;
    const deleteCollection = this.deleteCollection;
    const collections = this.props.collections.filter(function ({
      id
    }) {
      return !_this.state.deletedCollectionIds.includes(id);
    });
    const hasCollections = !!collections.length;
    const canMakeCollections = isAuthorized && !!maybeCurrentUser;

    if (!hasCollections && !canMakeCollections) {
      return null;
    }

    return _react.default.createElement("article", {
      className: "collections"
    }, _react.default.createElement("h2", null, title), canMakeCollections && _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(CreateCollectionButton, {
      api,
      currentUser: maybeCurrentUser,
      maybeTeam
    }), !hasCollections && _react.default.createElement(CreateFirstCollection, {
      api,
      currentUser: maybeCurrentUser
    })), _react.default.createElement(CollectionsUL, {
      collections,
      api,
      isAuthorized,
      deleteCollection
    }));
  }

}

CollectionsList.propTypes = {
  collections: _propTypes.default.array.isRequired,
  maybeCurrentUser: _propTypes.default.object,
  maybeTeam: _propTypes.default.object,
  title: _propTypes.default.node.isRequired,
  api: _propTypes.default.func.isRequired,
  isAuthorized: _propTypes.default.bool.isRequired
};

const CreateFirstCollection = function CreateFirstCollection() {
  return _react.default.createElement("div", {
    className: "create-first-collection"
  }, _react.default.createElement("img", {
    src: "https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934",
    alt: ""
  }), _react.default.createElement("p", {
    className: "placeholder"
  }, "Create collections to organize your favorite projects."), _react.default.createElement("br", null));
};

class CreateCollectionButton extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRedirect: false,
      error: false,
      loading: false,
      newCollectionUrl: ""
    };
    this.createCollection = this.createCollection.bind(this);
  }

  async postCollection(collectionSynonym, predicate) {
    const name = [predicate, collectionSynonym].join('-');
    const description = `A ${collectionSynonym} of projects that does ${predicate} things`;
    const url = (0, _kebabCase2.default)(name); // defaults

    const avatarUrl = _collection.defaultAvatar; // get a random color

    const coverColor = (0, _randomcolor.default)({
      luminosity: 'light'
    }); // set the team id if there is one

    const teamId = this.props.maybeTeam ? this.props.maybeTeam.id : undefined;
    const {
      data
    } = await this.props.api.post('collections', {
      name,
      description,
      url,
      avatarUrl,
      coverColor,
      teamId
    });

    if (data && data.url) {
      if (this.props.maybeTeam) {
        data.team = this.props.maybeTeam;
      } else {
        data.user = this.props.currentUser;
      }

      const newCollectionUrl = (0, _collection.getLink)(data);
      this.setState({
        newCollectionUrl,
        shouldRedirect: true
      });
      return true;
    }

    return false;
  }

  async generateNames() {
    let collectionSynonyms = ["mix", "bricolage", "playlist", "assortment", "potpourri", "melange", "album", "collection", "variety", "compilation"];
    let predicate = "radical";

    try {
      // get collection names
      collectionSynonyms = await (0, _words.getCollections)();
      predicate = await (0, _words.getPredicate)();
    } catch (error) {// If there's a failure, we'll stick with our defaults.
    }

    return [collectionSynonyms, predicate];
  }

  async createCollection() {
    this.setState({
      loading: true
    });
    const [collectionSynonymns, predicate] = await this.generateNames();
    let creationSuccess = false;

    for (let synonym of collectionSynonymns) {
      try {
        creationSuccess = await this.postCollection(synonym, predicate);

        if (creationSuccess) {
          break;
        }
      } catch (error) {// Try again.
      }
    }

    if (!creationSuccess) {
      this.setState({
        error: "Unable to create collection :-("
      });
    }
  }

  render() {
    var _this2 = this;

    if (this.state.shouldRedirect) {
      return _react.default.createElement(_reactRouterDom.Redirect, {
        to: this.state.newCollectionUrl,
        push: true
      });
    }

    if (this.state.loading) {
      return _react.default.createElement("div", {
        id: "create-collection-container"
      }, _react.default.createElement(_loader.default, null));
    }

    return _react.default.createElement("div", {
      id: "create-collection-container"
    }, _react.default.createElement(_analytics.TrackClick, {
      name: "Create Collection clicked"
    }, _react.default.createElement("button", {
      className: "button",
      id: "create-collection",
      onClick: function onClick() {
        return _this2.createCollection();
      }
    }, "Create Collection")));
  }

}

exports.CreateCollectionButton = CreateCollectionButton;
CreateCollectionButton.propTypes = {
  api: _propTypes.default.any.isRequired,
  currentUser: _propTypes.default.object.isRequired,
  maybeTeam: _propTypes.default.object
};

const CollectionsUL = function CollectionsUL({
  collections,
  deleteCollection,
  api,
  isAuthorized
}) {
  // order by updatedAt date
  const orderedCollections = (0, _orderBy2.default)(collections, function (collection) {
    return collection.updatedAt;
  }).reverse();
  return _react.default.createElement("ul", {
    className: "collections-container"
  }, orderedCollections.map(function (collection) {
    return _react.default.createElement(_collectionItem.default, _extends({
      key: collection.id
    }, {
      collection,
      api,
      isAuthorized,
      deleteCollection
    }));
  }));
};

exports.CollectionsUL = CollectionsUL;
CollectionsUL.propTypes = {
  api: _propTypes.default.func.isRequired,
  collections: _propTypes.default.array.isRequired,
  isAuthorized: _propTypes.default.bool.isRequired,
  deleteCollection: _propTypes.default.func
};
var _default = CollectionsList;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/current-user.jsx":
/*!*****************************************!*\
  !*** ./src/presenters/current-user.jsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.normalizeUser = normalizeUser;
exports.normalizeUsers = normalizeUsers;
exports.normalizeProject = normalizeProject;
exports.normalizeProjects = normalizeProjects;
exports.CurrentUserConsumer = exports.CurrentUserProvider = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _axios = _interopRequireDefault(__webpack_require__(/*! axios */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/axios/0.18.0/node_modules/axios/index.js"));

var _sentry = __webpack_require__(/*! ../utils/sentry */ "./src/utils/sentry.js");

var _localStorage = _interopRequireDefault(__webpack_require__(/*! ./includes/local-storage.jsx */ "./src/presenters/includes/local-storage.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const {
  Provider,
  Consumer
} = _react.default.createContext(); // Default values for all of the user fields we need you to have
// We always generate a 'real' anon user, but use this until we do


const defaultUser = {
  id: 0,
  login: null,
  name: null,
  description: '',
  color: '#aaa',
  avatarUrl: null,
  avatarThumbnailUrl: null,
  hasCoverImage: false,
  coverColor: null,
  emails: [],
  features: [],
  projects: [],
  teams: [],
  collections: []
};

function identifyUser(user) {
  if (user) {
    console.log("👀 current user is", user);
    console.log("🌈 login", user.login, user.id);
  } else {
    console.log("👻 logged out");
  }

  try {
    const analytics = window.analytics;

    if (analytics && user && user.login) {
      const emailObj = Array.isArray(user.emails) && user.emails.find(function (email) {
        return email.primary;
      });
      const email = emailObj && emailObj.email;
      analytics.identify(user.id, {
        name: user.name,
        login: user.login,
        email,
        created_at: user.createdAt
      }, {
        groupId: '0'
      });
    }

    if (user) {
      (0, _sentry.configureScope)(function (scope) {
        scope.setUser({
          id: user.id,
          login: user.login
        });
      });
    } else {
      (0, _sentry.configureScope)(function (scope) {
        scope.setUser({
          id: null,
          login: null
        });
      });
    }
  } catch (error) {
    console.error(error);
    (0, _sentry.captureException)(error);
  }
} // Test if two user objects reference the same person


function usersMatch(a, b) {
  if (a && b && a.id === b.id && a.persistentToken === b.persistentToken) {
    return true;
  } else if (!a && !b) {
    return true;
  }

  return false;
} // This takes sharedUser and cachedUser
// sharedUser is stored in localStorage['cachedUser']
// cachedUser is stored in localStorage['community-cachedUser']
// sharedUser syncs with the editor and is authoritative on id and persistentToken
// cachedUser mirrors GET /users/{id} and is what we actually display


class CurrentUserManager extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      // Set true on first complete load
      working: false // Used to prevent simultaneous loading

    };
  }

  api() {
    if (this.props.sharedUser) {
      return _axios.default.create({
        baseURL: API_URL,
        headers: {
          Authorization: this.props.sharedUser.persistentToken
        }
      });
    }

    return _axios.default.create({
      baseURL: API_URL
    });
  }

  async getSharedUser() {
    try {
      const {
        data: {
          user
        }
      } = await this.api().get(`boot?latestProjectOnly=true`);
      return user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return undefined;
      }

      throw error;
    }
  }

  async getCachedUser() {
    const {
      sharedUser
    } = this.props;
    if (!sharedUser) return undefined;
    if (!sharedUser.id || !sharedUser.persistentToken) return 'error';

    try {
      const {
        data
      } = await this.api().get(`users/${sharedUser.id}`);

      if (!usersMatch(sharedUser, data)) {
        return 'error';
      }

      return data;
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 404)) {
        // 401 means our token is bad, 404 means the user doesn't exist
        return 'error';
      }

      throw error;
    }
  }

  async load() {
    if (this.state.working) return;
    this.setState({
      working: true
    });
    const {
      sharedUser,
      cachedUser
    } = this.props;

    if (!usersMatch(sharedUser, cachedUser)) {
      this.props.setCachedUser(undefined);
    }

    if (sharedUser) {
      const newCachedUser = await this.getCachedUser();

      if (newCachedUser === 'error') {
        // Sounds like our shared user is bad
        // Fix it and componentDidUpdate will reload
        this.setState({
          fetched: false
        });
        const newSharedUser = await this.getSharedUser();
        this.props.setSharedUser(newSharedUser);
        console.warn('Fixed shared cachedUser from', sharedUser, 'to', newSharedUser);
        (0, _sentry.captureMessage)('Invalid cachedUser', {
          extra: {
            from: sharedUser || null,
            to: newSharedUser || null
          }
        });
      } else {
        this.props.setCachedUser(newCachedUser);
        this.setState({
          fetched: true
        });
      }
    } else {
      const {
        data
      } = await this.api().post('users/anon');
      this.props.setSharedUser(data);
    }

    this.setState({
      working: false
    });
  }

  componentDidMount() {
    identifyUser(this.props.cachedUser);
    this.load();
  }

  componentDidUpdate(prev) {
    const {
      cachedUser,
      sharedUser
    } = this.props;

    if (!usersMatch(cachedUser, prev.cachedUser)) {
      identifyUser(cachedUser);
    }

    if (!usersMatch(cachedUser, sharedUser) || !usersMatch(sharedUser, prev.sharedUser)) {
      this.load();
    } // hooks for easier debugging


    window.currentUser = cachedUser;
    window.api = this.api();
  }

  render() {
    var _this = this;

    const {
      children,
      sharedUser,
      cachedUser,
      setSharedUser,
      setCachedUser
    } = this.props;
    return children({
      api: this.api(),
      currentUser: Object.assign({}, defaultUser, sharedUser, cachedUser),
      fetched: !!cachedUser && this.state.fetched,
      reload: function reload() {
        return _this.load();
      },
      login: function login(user) {
        return setSharedUser(user);
      },
      update: function update(changes) {
        return setCachedUser(Object.assign({}, cachedUser, changes));
      },
      clear: function clear() {
        return setSharedUser(undefined);
      }
    });
  }

}

CurrentUserManager.propTypes = {
  sharedUser: _propTypes.default.shape({
    id: _propTypes.default.number,
    persistentToken: _propTypes.default.string
  }),
  cachedUser: _propTypes.default.object,
  setSharedUser: _propTypes.default.func.isRequired,
  setCachedUser: _propTypes.default.func.isRequired
};

const CurrentUserProvider = function CurrentUserProvider({
  children
}) {
  return _react.default.createElement(_localStorage.default, {
    name: "community-cachedUser",
    default: null
  }, function (cachedUser, setCachedUser, loadedCachedUser) {
    return _react.default.createElement(_localStorage.default, {
      name: "cachedUser",
      default: null
    }, function (sharedUser, setSharedUser, loadedSharedUser) {
      return loadedSharedUser && loadedCachedUser && _react.default.createElement(CurrentUserManager, {
        sharedUser: sharedUser,
        setSharedUser: setSharedUser,
        cachedUser: cachedUser,
        setCachedUser: setCachedUser
      }, function (_ref) {
        let {
          api
        } = _ref,
            props = _objectWithoutPropertiesLoose(_ref, ["api"]);

        return _react.default.createElement(Provider, {
          value: props
        }, children(api));
      });
    });
  });
};

exports.CurrentUserProvider = CurrentUserProvider;
CurrentUserProvider.propTypes = {
  children: _propTypes.default.func.isRequired
};

const CurrentUserConsumer = function CurrentUserConsumer(props) {
  return _react.default.createElement(Consumer, null, function (_ref2) {
    let {
      currentUser,
      fetched
    } = _ref2,
        funcs = _objectWithoutPropertiesLoose(_ref2, ["currentUser", "fetched"]);

    return props.children(currentUser, fetched, funcs, props);
  });
};

exports.CurrentUserConsumer = CurrentUserConsumer;
CurrentUserConsumer.propTypes = {
  children: _propTypes.default.func.isRequired
};

function normalizeUser(user, currentUser) {
  return user.id === (currentUser && currentUser.id) ? currentUser : user;
}

function normalizeUsers(users, currentUser) {
  return users.map(function (user) {
    return normalizeUser(user, currentUser);
  });
}

function normalizeProject(_ref3, currentUser) {
  let {
    users
  } = _ref3,
      project = _objectWithoutPropertiesLoose(_ref3, ["users"]);

  return Object.assign({
    users: users ? normalizeUsers(users, currentUser) : []
  }, project);
}

function normalizeProjects(projects, currentUser) {
  return projects.map(function (project) {
    return normalizeProject(project, currentUser);
  });
}

/***/ }),

/***/ "./src/presenters/deleted-projects.jsx":
/*!*********************************************!*\
  !*** ./src/presenters/deleted-projects.jsx ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _project = __webpack_require__(/*! ../models/project */ "./src/models/project.js");

var _analytics = __webpack_require__(/*! ./analytics */ "./src/presenters/analytics.jsx");

var _loader = _interopRequireDefault(__webpack_require__(/*! ./includes/loader */ "./src/presenters/includes/loader.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// deleted projects is a little strange
// it loads the projects from the api, but expects them to be stored elsewhere
// so it takes an initially empty list of projects and a function to fill it once they load

/* globals Set */
function clickUndelete(event, callback) {
  const node = event.target.closest('li');
  node.addEventListener('animationend', callback, {
    once: true
  });
  node.classList.add('slide-up');
}

const DeletedProject = function DeletedProject({
  id,
  domain,
  onClick: _onClick
}) {
  return _react.default.createElement(_analytics.TrackClick, {
    name: "Undelete clicked"
  }, _react.default.createElement("button", {
    className: "button-unstyled",
    onClick: function onClick(evt) {
      return clickUndelete(evt, _onClick);
    }
  }, _react.default.createElement("div", {
    className: "deleted-project"
  }, _react.default.createElement("img", {
    className: "avatar",
    src: (0, _project.getAvatarUrl)(id),
    alt: ""
  }), _react.default.createElement("div", {
    className: "deleted-project-name"
  }, domain), _react.default.createElement("div", {
    className: "button button-small"
  }, "Undelete"))));
};

DeletedProject.propTypes = {
  id: _propTypes.default.string.isRequired,
  domain: _propTypes.default.string.isRequired,
  onClick: _propTypes.default.func.isRequired
};

const DeletedProjectsList = function DeletedProjectsList({
  deletedProjects,
  undelete
}) {
  return _react.default.createElement("ul", {
    className: "deleted-projects-container"
  }, deletedProjects.map(function ({
    id,
    domain
  }) {
    return _react.default.createElement("li", {
      key: id,
      className: "deleted-project-container"
    }, _react.default.createElement(DeletedProject, {
      id: id,
      domain: domain,
      onClick: function onClick() {
        return undelete(id);
      }
    }));
  }));
};

DeletedProjectsList.propTypes = {
  deletedProjects: _propTypes.default.array.isRequired,
  undelete: _propTypes.default.func.isRequired
};

class DeletedProjects extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: false,
      loaded: false
    };
    this.clickShow = this.clickShow.bind(this);
    this.clickHide = this.clickHide.bind(this);
  }

  clickHide() {
    this.setState({
      shown: false,
      loaded: false
    });
  }

  async clickShow() {
    this.setState({
      shown: true
    });

    try {
      const {
        data
      } = await this.props.api.get('user/deleted-projects');
      this.props.setDeletedProjects(data);
      this.setState({
        loaded: true
      });
    } catch (e) {
      this.setState({
        shown: false
      });
    }
  }

  renderContents() {
    if (!this.state.shown) {
      return _react.default.createElement("button", {
        className: "button button-tertiary",
        onClick: this.clickShow
      }, "Show");
    } else if (!this.state.loaded) {
      return _react.default.createElement(_loader.default, null);
    } else if (!this.props.deletedProjects.length) {
      return 'nothing found';
    }

    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(DeletedProjectsList, this.props), _react.default.createElement("button", {
      className: "button button-tertiary",
      onClick: this.clickHide
    }, "Hide Deleted Projects"));
  }

  render() {
    return _react.default.createElement("article", {
      className: "deleted-projects"
    }, _react.default.createElement("h2", null, "Deleted Projects ", _react.default.createElement("span", {
      className: "emoji bomb emoji-in-title"
    })), this.renderContents());
  }

}

exports.default = DeletedProjects;
DeletedProjects.propTypes = {
  api: _propTypes.default.any.isRequired,
  deletedProjects: _propTypes.default.array.isRequired,
  setDeletedProjects: _propTypes.default.func.isRequired
};

/***/ }),

/***/ "./src/presenters/entity-page-pinned-projects.jsx":
/*!********************************************************!*\
  !*** ./src/presenters/entity-page-pinned-projects.jsx ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _projectsList = _interopRequireDefault(__webpack_require__(/*! ./projects-list.jsx */ "./src/presenters/projects-list.jsx"));

var _currentUser = __webpack_require__(/*! ./current-user.jsx */ "./src/presenters/current-user.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/* globals Set */
const EntityPagePinnedProjects = function EntityPagePinnedProjects({
  api,
  projects,
  pins,
  currentUser,
  isAuthorized,
  removePin,
  projectOptions
}) {
  const pinnedSet = new Set(pins.map(function ({
    projectId
  }) {
    return projectId;
  }));
  const pinnedProjects = projects.filter(function ({
    id
  }) {
    return pinnedSet.has(id);
  });
  const pinnedVisible = (isAuthorized || pinnedProjects.length) && projects.length;

  const pinnedTitle = _react.default.createElement(_react.default.Fragment, null, "Pinned Projects", _react.default.createElement("span", {
    className: "emoji pushpin emoji-in-title"
  }));

  return _react.default.createElement(_react.default.Fragment, null, !!pinnedVisible && !!pinnedProjects.length && _react.default.createElement(_projectsList.default, {
    title: pinnedTitle,
    projects: pinnedProjects,
    api: api,
    projectOptions: isAuthorized ? Object.assign({
      removePin
    }, projectOptions) : currentUser && currentUser.login ? Object.assign({}, projectOptions) : {}
  }));
};

EntityPagePinnedProjects.propTypes = {
  api: _propTypes.default.func.isRequired,
  currentUser: _propTypes.default.object,
  isAuthorized: _propTypes.default.bool.isRequired,
  projects: _propTypes.default.array.isRequired,
  pins: _propTypes.default.arrayOf(_propTypes.default.shape({
    projectId: _propTypes.default.string.isRequired
  }).isRequired).isRequired,
  removePin: _propTypes.default.func.isRequired,
  projectOptions: _propTypes.default.object
};

const EntityPagePinnedProjectsContainer = function EntityPagePinnedProjectsContainer(_ref) {
  let {
    api,
    projects
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["api", "projects"]);

  return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
    return _react.default.createElement(EntityPagePinnedProjects, _extends({
      api: api,
      projects: projects,
      currentUser: currentUser
    }, props));
  });
};

var _default = EntityPagePinnedProjectsContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/entity-page-recent-projects.jsx":
/*!********************************************************!*\
  !*** ./src/presenters/entity-page-recent-projects.jsx ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _projectsList = _interopRequireDefault(__webpack_require__(/*! ./projects-list.jsx */ "./src/presenters/projects-list.jsx"));

var _currentUser = __webpack_require__(/*! ./current-user.jsx */ "./src/presenters/current-user.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/* globals Set */
const EntityPageProjects = function EntityPageProjects({
  api,
  projects,
  pins,
  currentUser,
  isAuthorized,
  addPin,
  projectOptions
}) {
  const pinnedSet = new Set(pins.map(function ({
    projectId
  }) {
    return projectId;
  }));
  const recentProjects = projects.filter(function ({
    id
  }) {
    return !pinnedSet.has(id);
  });
  return _react.default.createElement(_react.default.Fragment, null, !!recentProjects.length && _react.default.createElement(_projectsList.default, {
    title: "Recent Projects",
    projects: recentProjects,
    api: api,
    projectOptions: isAuthorized ? Object.assign({
      addPin
    }, projectOptions) : currentUser && currentUser.login ? Object.assign({}, projectOptions) : {}
  }));
};

EntityPageProjects.propTypes = {
  api: _propTypes.default.func.isRequired,
  currentUser: _propTypes.default.object,
  isAuthorized: _propTypes.default.bool.isRequired,
  projects: _propTypes.default.array.isRequired,
  pins: _propTypes.default.arrayOf(_propTypes.default.shape({
    projectId: _propTypes.default.string.isRequired
  }).isRequired).isRequired,
  addPin: _propTypes.default.func.isRequired,
  projectOptions: _propTypes.default.object
};

const EntityPageProjectsContainer = function EntityPageProjectsContainer(_ref) {
  let {
    api,
    projects
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["api", "projects"]);

  return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
    return _react.default.createElement(EntityPageProjects, _extends({
      api: api,
      projects: projects,
      currentUser: currentUser
    }, props));
  });
};

var _default = EntityPageProjectsContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/error-handlers.jsx":
/*!*******************************************!*\
  !*** ./src/presenters/error-handlers.jsx ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _notifications = _interopRequireDefault(__webpack_require__(/*! ./notifications.jsx */ "./src/presenters/notifications.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _handleError(notify, error) {
  console.error(error);
  notify();
  return Promise.reject(error);
}

function _handleErrorForInput(notify, error) {
  if (error && error.response && error.response.data) {
    return Promise.reject(error.response.data.message);
  }

  console.error(error);
  notify();
  return Promise.reject();
}

const ErrorHandler = function ErrorHandler({
  children
}) {
  return _react.default.createElement(_notifications.default, null, function ({
    createErrorNotification
  }) {
    return children({
      handleError: function handleError(error) {
        return _handleError(createErrorNotification, error);
      },
      handleErrorForInput: function handleErrorForInput(error) {
        return _handleErrorForInput(createErrorNotification, error);
      }
    });
  });
};

ErrorHandler.propTypes = {
  children: _propTypes.default.func.isRequired
};
var _default = ErrorHandler;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/featured-embed.jsx":
/*!*******************************************!*\
  !*** ./src/presenters/featured-embed.jsx ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _link = _interopRequireDefault(__webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FeaturedEmbed = function FeaturedEmbed({
  image,
  mask,
  title,
  url,
  embed,
  body,
  color
}) {
  return _react.default.createElement("div", {
    className: "featured-embed"
  }, _react.default.createElement("div", {
    className: "mask-container"
  }, _react.default.createElement(_link.default, {
    to: `culture${url}`
  }, _react.default.createElement("img", {
    className: 'mask ' + mask,
    src: image,
    alt: ""
  }))), _react.default.createElement("div", {
    className: "content",
    style: {
      backgroundColor: color
    }
  }, _react.default.createElement("div", {
    className: "description"
  }, _react.default.createElement(_link.default, {
    to: `culture${url}`
  }, _react.default.createElement("h1", null, title)), _react.default.createElement("p", {
    dangerouslySetInnerHTML: {
      __html: body
    }
  }), _react.default.createElement(_link.default, {
    to: `culture${url}`,
    className: "learn-more"
  }, _react.default.createElement("button", {
    className: "button-small"
  }, "Learn More \u2192"))), _react.default.createElement("div", {
    className: "embed"
  }, _react.default.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: embed
    }
  }))));
};

FeaturedEmbed.propTypes = {
  image: _propTypes.default.string.isRequired,
  mask: _propTypes.default.string.isRequired,
  title: _propTypes.default.string.isRequired,
  url: _propTypes.default.string.isRequired,
  embed: _propTypes.default.string.isRequired,
  body: _propTypes.default.string.isRequired,
  color: _propTypes.default.string.isRequired
};
var _default = FeaturedEmbed;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/featured.jsx":
/*!*************************************!*\
  !*** ./src/presenters/featured.jsx ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _sampleSize2 = _interopRequireDefault(__webpack_require__(/*! lodash/sampleSize */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/sampleSize.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _featured = _interopRequireDefault(__webpack_require__(/*! ../curated/featured */ "./src/curated/featured.js"));

var _featuredEmbed = _interopRequireDefault(__webpack_require__(/*! ../curated/featured-embed */ "./src/curated/featured-embed.js"));

var _link = _interopRequireDefault(__webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx"));

var _featuredEmbed2 = _interopRequireDefault(__webpack_require__(/*! ./featured-embed.jsx */ "./src/presenters/featured-embed.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ZineItems extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: window.ZINE_POSTS.slice(0, 4),
      masks: (0, _sampleSize2.default)([1, 2, 3, 4, 5], 4)
    };
  }

  render() {
    var _this = this;

    if (!this.state.posts.length) {
      return null;
    }

    return _react.default.createElement("section", null, _react.default.createElement("ul", {
      className: "zine-items"
    }, this.state.posts.map(function ({
      id,
      title,
      url,
      feature_image,
      primary_tag
    }, n) {
      return _react.default.createElement("li", {
        key: id,
        className: "zine-item"
      }, _react.default.createElement(_link.default, {
        to: `/culture${url}`
      }, !!feature_image && _react.default.createElement("div", {
        className: "mask-container"
      }, _react.default.createElement("img", {
        className: `mask mask-${_this.state.masks[n]}`,
        src: feature_image,
        alt: ""
      })), _react.default.createElement("div", {
        className: "zine-item-meta"
      }, _react.default.createElement("h1", {
        className: "zine-item-title"
      }, title), !!primary_tag && _react.default.createElement("p", {
        className: "zine-item-tag"
      }, primary_tag.name))));
    })));
  }

}

const FeaturedPanel = function FeaturedPanel({
  img,
  link,
  title
}) {
  return _react.default.createElement(_link.default, {
    to: link,
    "data-track": "featured-project",
    "data-track-label": title
  }, _react.default.createElement("div", {
    className: "featured-container"
  }, _react.default.createElement("img", {
    className: "featured",
    src: img,
    alt: ""
  }), _react.default.createElement("p", {
    className: "project-name"
  }, title)));
};

FeaturedPanel.propTypes = {
  img: _propTypes.default.string.isRequired,
  link: _propTypes.default.string.isRequired,
  title: _propTypes.default.string.isRequired
};

const Featured = function Featured({
  featured
}) {
  return _react.default.createElement("section", {
    className: "featured featured-collections"
  }, _react.default.createElement("div", {
    className: "community-pick-embed-container"
  }, _react.default.createElement(_featuredEmbed2.default, _featuredEmbed.default)), _react.default.createElement("section", null, _react.default.createElement("ul", {
    className: "featured-items"
  }, featured.map(function (item) {
    return _react.default.createElement("li", {
      key: item.link
    }, _react.default.createElement(FeaturedPanel, item));
  }))), _react.default.createElement(ZineItems, null));
};

Featured.propTypes = {
  featured: _propTypes.default.array.isRequired
};

const FeaturedContainer = function FeaturedContainer({
  isAuthorized
}) {
  return _react.default.createElement(Featured, {
    featured: _featured.default,
    isAuthorized: isAuthorized
  });
};

FeaturedContainer.propTypes = {
  isAuthorized: _propTypes.default.bool
};
var _default = FeaturedContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/footer.jsx":
/*!***********************************!*\
  !*** ./src/presenters/footer.jsx ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = Footer;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _link = _interopRequireDefault(__webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FooterLine = function FooterLine({
  href,
  track,
  children
}) {
  return _react.default.createElement("p", null, _react.default.createElement(_link.default, {
    to: href,
    "data-track": 'footer → ' + track
  }, children));
};

FooterLine.propTypes = {
  href: _propTypes.default.string.isRequired,
  track: _propTypes.default.string.isRequired,
  children: _propTypes.default.node.isRequired
};

function Footer() {
  const srcForPlatforms = "https://cdn.glitch.com/be1ad2d2-68ab-404a-82f4-6d8e98d28d93%2Ffor-platforms-icon.svg?1506442305188";
  return _react.default.createElement("footer", {
    role: "contentinfo"
  }, _react.default.createElement(FooterLine, {
    href: "/about",
    track: "about"
  }, "About Glitch ", _react.default.createElement("span", {
    role: "img",
    "aria-label": ""
  }, "\uD83D\uDD2E")), _react.default.createElement(FooterLine, {
    href: "https://medium.com/glitch",
    track: "blog"
  }, "Blog ", _react.default.createElement("span", {
    role: "img",
    "aria-label": ""
  }, "\uD83D\uDCF0")), _react.default.createElement(FooterLine, {
    href: "/help/",
    track: "faq"
  }, "Help Center ", _react.default.createElement("span", {
    role: "img",
    "aria-label": ""
  }, "\u2602\uFE0F")), _react.default.createElement(FooterLine, {
    href: "http://status.glitch.com/",
    track: "system status"
  }, "System Status ", _react.default.createElement("span", {
    role: "img",
    "aria-label": ""
  }, "\uD83D\uDEA5")), _react.default.createElement(FooterLine, {
    href: "/legal",
    track: "legal stuff"
  }, "Legal Stuff ", _react.default.createElement("span", {
    role: "img",
    "aria-label": ""
  }, "\uD83D\uDC6E\u200D")), _react.default.createElement("hr", null), _react.default.createElement(FooterLine, {
    href: "/teams",
    track: "platforms"
  }, _react.default.createElement("img", {
    className: "for-platforms-icon",
    src: srcForPlatforms,
    alt: ""
  }), _react.default.createElement("span", {
    className: "for-platforms-text"
  }, "Glitch Teams")));
}

/***/ }),

/***/ "./src/presenters/header.jsx":
/*!***********************************!*\
  !*** ./src/presenters/header.jsx ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _analytics = __webpack_require__(/*! ./analytics */ "./src/presenters/analytics.jsx");

var _link = _interopRequireDefault(__webpack_require__(/*! ./includes/link */ "./src/presenters/includes/link.jsx"));

var _logo = _interopRequireDefault(__webpack_require__(/*! ./includes/logo */ "./src/presenters/includes/logo.jsx"));

var _userOptionsPop = _interopRequireDefault(__webpack_require__(/*! ./pop-overs/user-options-pop */ "./src/presenters/pop-overs/user-options-pop.jsx"));

var _signInPop = _interopRequireDefault(__webpack_require__(/*! ./pop-overs/sign-in-pop */ "./src/presenters/pop-overs/sign-in-pop.jsx"));

var _newProjectPop = _interopRequireDefault(__webpack_require__(/*! ./pop-overs/new-project-pop */ "./src/presenters/pop-overs/new-project-pop.jsx"));

var _newStuff = _interopRequireDefault(__webpack_require__(/*! ./overlays/new-stuff */ "./src/presenters/overlays/new-stuff.jsx"));

var _currentUser = __webpack_require__(/*! ./current-user */ "./src/presenters/current-user.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const ResumeCoding = function ResumeCoding() {
  return _react.default.createElement(_analytics.TrackedExternalLink, {
    name: "Resume Coding clicked",
    className: "button button-small button-cta",
    to: EDITOR_URL
  }, "Resume Coding");
};

class SearchForm extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue || '',
      submitted: false
    };
  }

  onChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  onSubmit(event) {
    event.preventDefault();
    if (!this.state.value) return;
    this.setState({
      submitted: true
    });
  }

  render() {
    const {
      value,
      submitted
    } = this.state;
    return _react.default.createElement("form", {
      action: "/search",
      method: "get",
      role: "search",
      onSubmit: this.onSubmit.bind(this)
    }, _react.default.createElement("input", {
      className: "search-input",
      name: "q",
      placeholder: "bots, apps, users",
      value: value,
      onChange: this.onChange.bind(this)
    }), submitted && _react.default.createElement(_reactRouterDom.Redirect, {
      to: `/search?q=${value}`,
      push: true
    }));
  }

}

SearchForm.propTypes = {
  defaultValue: _propTypes.default.string
};

const Header = function Header({
  api,
  maybeUser,
  clearUser,
  searchQuery,
  showNewStuffOverlay
}) {
  return _react.default.createElement("header", {
    role: "banner"
  }, _react.default.createElement("div", {
    className: "header-info"
  }, _react.default.createElement(_link.default, {
    to: "/"
  }, _react.default.createElement(_logo.default, null))), _react.default.createElement("nav", null, _react.default.createElement(SearchForm, {
    defaultValue: searchQuery
  }), _react.default.createElement(_newProjectPop.default, {
    api: api
  }), !!maybeUser && !!maybeUser.projects.length && _react.default.createElement(ResumeCoding, null), !(maybeUser && maybeUser.login) && _react.default.createElement(_signInPop.default, {
    api: api
  }), !!maybeUser && _react.default.createElement(_userOptionsPop.default, {
    user: maybeUser,
    signOut: clearUser,
    showNewStuffOverlay: showNewStuffOverlay,
    api: api
  })));
};

Header.propTypes = {
  maybeUser: _propTypes.default.object,
  api: _propTypes.default.func.isRequired
};

const HeaderContainer = function HeaderContainer(_ref) {
  let props = Object.assign({}, _ref);
  return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (user, userFetched, {
    clear
  }) {
    return _react.default.createElement(_newStuff.default, {
      isSignedIn: !!user && !!user.login
    }, function (showNewStuffOverlay) {
      return _react.default.createElement(Header, _extends({}, props, {
        maybeUser: user,
        clearUser: clear,
        showNewStuffOverlay: showNewStuffOverlay
      }));
    });
  });
};

var _default = HeaderContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/add-collection-project.jsx":
/*!************************************************************!*\
  !*** ./src/presenters/includes/add-collection-project.jsx ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _addCollectionProjectPop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/add-collection-project-pop.jsx */ "./src/presenters/pop-overs/add-collection-project-pop.jsx"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const AddCollectionProject = function AddCollectionProject(_ref) {
  let {
    currentUserIsOwner
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["currentUserIsOwner"]);

  if (!currentUserIsOwner) {
    return null;
  }

  return _react.default.createElement(_popoverWithButton.default, {
    buttonClass: "button add-project opens-pop-over",
    buttonText: "Add Project",
    passToggleToPop: true
  }, _react.default.createElement(_addCollectionProjectPop.default, props));
};

AddCollectionProject.propTypes = {
  currentUserIsOwner: _propTypes.default.bool.isRequired,
  collection: _propTypes.default.object.isRequired,
  currentUser: _propTypes.default.object.isRequired,
  addProjectToCollection: _propTypes.default.func.isRequired,
  api: _propTypes.default.func.isRequired
};
var _default = AddCollectionProject;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/add-project-to-collection.jsx":
/*!***************************************************************!*\
  !*** ./src/presenters/includes/add-project-to-collection.jsx ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _addProjectToCollectionPop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/add-project-to-collection-pop.jsx */ "./src/presenters/pop-overs/add-project-to-collection-pop.jsx"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const AddProjectToCollection = function AddProjectToCollection(_ref) {
  let {
    project
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["project"]);

  return _react.default.createElement(_popoverWithButton.default, {
    buttonClass: "button button-small has-emoji add-project opens-pop-over",
    buttonText: _react.default.createElement(_react.default.Fragment, null, "Add to Collection ", ' ', _react.default.createElement("span", {
      className: "emoji framed-picture",
      role: "presentation"
    })),
    passToggleToPop: true
  }, _react.default.createElement(_addProjectToCollectionPop.default, _extends({}, props, {
    project: project
  })));
};

AddProjectToCollection.propTypes = {
  addProjectToCollection: _propTypes.default.func.isRequired,
  api: _propTypes.default.func.isRequired,
  project: _propTypes.default.object.isRequired
};
var _default = AddProjectToCollection;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/add-team-project.jsx":
/*!******************************************************!*\
  !*** ./src/presenters/includes/add-team-project.jsx ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _addTeamProjectPop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/add-team-project-pop.jsx */ "./src/presenters/pop-overs/add-team-project-pop.jsx"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const AddTeamProject = function AddTeamProject(_ref) {
  let {
    currentUserIsOnTeam
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["currentUserIsOnTeam"]);

  if (!currentUserIsOnTeam) {
    return null;
  }

  return _react.default.createElement("section", {
    className: "add-project-container"
  }, _react.default.createElement(_popoverWithButton.default, {
    buttonClass: `button add-project has-emoji opens-pop-over ${props.extraButtonClass}`,
    buttonText: _react.default.createElement(_react.default.Fragment, null, "Add Project ", _react.default.createElement("span", {
      className: "emoji bento-box",
      role: "img",
      "aria-label": ""
    })),
    passToggleToPop: true
  }, _react.default.createElement(_addTeamProjectPop.default, props)));
};

AddTeamProject.propTypes = {
  currentUserIsOnTeam: _propTypes.default.bool.isRequired,
  addProject: _propTypes.default.func.isRequired,
  teamProjects: _propTypes.default.array.isRequired,
  extraButtonClass: _propTypes.default.string,
  api: _propTypes.default.func.isRequired
};
var _default = AddTeamProject;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/avatar.jsx":
/*!********************************************!*\
  !*** ./src/presenters/includes/avatar.jsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.UserAvatar = exports.TeamAvatar = exports.Avatar = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _team = __webpack_require__(/*! ../../models/team */ "./src/models/team.js");

var _user = __webpack_require__(/*! ../../models/user */ "./src/models/user.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// UserAvatar
const Avatar = function Avatar({
  name,
  src,
  color,
  srcFallback,
  type,
  isStatic
}) {
  var contents = _react.default.createElement("img", {
    width: "32px",
    height: "32px",
    src: src,
    alt: name,
    style: color ? {
      backgroundColor: color
    } : null,
    onError: srcFallback ? function (event) {
      return event.target.src = srcFallback;
    } : null,
    className: type + "-avatar"
  });

  if (!isStatic) {
    _react.default.createElement("div", {
      "data-tooltip": name,
      "data-tooltip-left": "true"
    }, contents);
  }

  return contents;
};

exports.Avatar = Avatar;
Avatar.propTypes = {
  name: _propTypes.default.string.isRequired,
  src: _propTypes.default.string.isRequired,
  srcFallback: _propTypes.default.string,
  color: _propTypes.default.string,
  type: _propTypes.default.string,
  isStatic: _propTypes.default.bool
};

const TeamAvatar = function TeamAvatar({
  team
}) {
  return _react.default.createElement(Avatar, {
    name: team.name,
    src: (0, _team.getAvatarUrl)(Object.assign({}, team, {
      size: 'small'
    })),
    srcFallback: _team.DEFAULT_TEAM_AVATAR,
    type: "team"
  });
};

exports.TeamAvatar = TeamAvatar;
TeamAvatar.propTypes = {
  team: _propTypes.default.shape({
    id: _propTypes.default.number.isRequired,
    name: _propTypes.default.string.isRequired,
    hasAvatarImage: _propTypes.default.bool.isRequired
  }).isRequired
};

const UserAvatar = function UserAvatar({
  user,
  suffix = '',
  isStatic
}) {
  return _react.default.createElement(Avatar, {
    name: (0, _user.getDisplayName)(user) + suffix,
    src: (0, _user.getAvatarThumbnailUrl)(user),
    color: user.color,
    srcFallback: _user.ANON_AVATAR_URL,
    type: "user",
    isStatic: isStatic
  });
};

exports.UserAvatar = UserAvatar;
UserAvatar.propTypes = {
  user: _propTypes.default.shape({
    id: _propTypes.default.number.isRequired,
    login: _propTypes.default.string,
    name: _propTypes.default.string,
    avatarThumbnailUrl: _propTypes.default.string,
    color: _propTypes.default.string.isRequired
  }).isRequired,
  suffix: _propTypes.default.string,
  isStatic: _propTypes.default.bool
};

/***/ }),

/***/ "./src/presenters/includes/collection-avatar.jsx":
/*!*******************************************************!*\
  !*** ./src/presenters/includes/collection-avatar.jsx ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactSvgInline = _interopRequireDefault(__webpack_require__(/*! react-svg-inline */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-svg-inline/2.1.1/node_modules/react-svg-inline/lib/index.js"));

var _collection = __webpack_require__(/*! ../../models/collection */ "./src/models/collection.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CollectionAvatar extends _react.default.Component {
  constructor(props) {
    super(props);
    this.ref = _react.default.createRef();
  }

  syncColor() {
    const svgBackgroundEl = this.ref.current.querySelector('.background');
    svgBackgroundEl.setAttribute('fill', this.props.backgroundColor);
  }

  componentDidMount() {
    this.syncColor();
  }

  componentDidUpdate() {
    this.syncColor();
  }

  render() {
    return _react.default.createElement("span", {
      ref: this.ref
    }, _react.default.createElement(_reactSvgInline.default, {
      svg: _collection.defaultAvatarSVG
    }));
  }

}

exports.default = CollectionAvatar;
CollectionAvatar.propTypes = {
  backgroundColor: _propTypes.default.string.isRequired
};

/***/ }),

/***/ "./src/presenters/includes/collection-result-item.jsx":
/*!************************************************************!*\
  !*** ./src/presenters/includes/collection-result-item.jsx ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _notifications = _interopRequireDefault(__webpack_require__(/*! ../notifications.jsx */ "./src/presenters/notifications.jsx"));

var _avatar = __webpack_require__(/*! ../includes/avatar.jsx */ "./src/presenters/includes/avatar.jsx");

var _collectionAvatar = _interopRequireDefault(__webpack_require__(/*! ./collection-avatar.jsx */ "./src/presenters/includes/collection-avatar.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AddProjectMessage = function AddProjectMessage({
  projectName,
  collectionName,
  url
}) {
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("p", null, "Added ", _react.default.createElement("b", null, _react.default.createElement("span", {
    className: "project-name"
  }, projectName)), " to collection ", _react.default.createElement("b", null, _react.default.createElement("span", {
    className: "collection-name"
  }, collectionName))), _react.default.createElement("a", {
    href: url,
    rel: "noopener noreferrer",
    className: "button button-small button-tertiary button-in-notification-container notify-collection-link"
  }, "Take me there"));
};

AddProjectMessage.propTypes = {
  projectName: _propTypes.default.string,
  collectionName: _propTypes.default.string.isRequired,
  url: _propTypes.default.string.isRequired
};

const addProject = function addProject(addProjectToCollection, project, collection, collectionPath, notification, togglePopover) {
  try {
    // add project to collection
    addProjectToCollection(project, collection); // toggle popover

    togglePopover(); // show notification

    const content = _react.default.createElement(AddProjectMessage, {
      projectName: project.domain,
      collectionName: collection.name,
      url: collectionPath
    });

    notification(content, "notifySuccess");
  } catch (error) {
    const content = _react.default.createElement("p", null, "Something went wrong. Try refreshing and adding the project again.");

    notification(content, "notifyError");
  }
};

const CollectionResultItem = function CollectionResultItem({
  onClick: _onClick,
  project,
  collection,
  isActive,
  togglePopover
}) {
  let resultClass = "button-unstyled result result-collection";

  if (isActive) {
    resultClass += " active";
  }

  let collectionPath;

  if (collection.userId !== -1) {
    collectionPath = `/@${collection.owner.login}/${collection.url}`;
  } else {
    collectionPath = `/@${collection.owner.url}/${collection.url}`;
  }

  return _react.default.createElement(_notifications.default, null, function ({
    createNotification
  }) {
    return _react.default.createElement("div", null, _react.default.createElement("button", {
      className: resultClass,
      onClick: function onClick() {
        return addProject(_onClick, project, collection, collectionPath, createNotification, togglePopover);
      },
      "data-project-id": project.id
    }, _react.default.createElement("div", {
      className: "avatar",
      id: "avatar-collection-" + collection.id
    }, _react.default.createElement(_collectionAvatar.default, {
      backgroundColor: collection.coverColor
    })), _react.default.createElement("div", {
      className: "results-info"
    }, _react.default.createElement("div", {
      className: "result-name",
      title: collection.name
    }, collection.name), collection.description.length > 0 && _react.default.createElement("div", {
      className: "result-description"
    }, collection.description), collection.userId !== -1 ? _react.default.createElement(_avatar.UserAvatar, {
      user: collection.owner
    }) : _react.default.createElement(_avatar.TeamAvatar, {
      team: collection.owner
    }))), _react.default.createElement("a", {
      href: collectionPath,
      className: "view-result-link button button-small button-link",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "View \u2192"));
  });
};

CollectionResultItem.propTypes = {
  onClick: _propTypes.default.func,
  collection: _propTypes.default.object.isRequired,
  currentUser: _propTypes.default.object,
  isActive: _propTypes.default.bool,
  project: _propTypes.default.object.isRequired,
  togglePopover: _propTypes.default.func.isRequired
};
var _default = CollectionResultItem;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/delete-team.jsx":
/*!*************************************************!*\
  !*** ./src/presenters/includes/delete-team.jsx ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _deleteTeamPop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/delete-team-pop.jsx */ "./src/presenters/pop-overs/delete-team-pop.jsx"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DeleteTeam = function DeleteTeam(_ref) {
  let props = Object.assign({}, _ref);
  return _react.default.createElement("section", null, _react.default.createElement(_popoverWithButton.default, {
    buttonClass: "button button-small button-tertiary has-emoji opens-pop-over danger-zone",
    buttonText: _react.default.createElement(_react.default.Fragment, null, "Delete ", props.teamName, "\xA0", _react.default.createElement("span", {
      className: "emoji bomb",
      role: "img",
      "aria-label": ""
    }), " "),
    passToggleToPop: true
  }, _react.default.createElement(_deleteTeamPop.default, props)));
};

DeleteTeam.propTypes = {
  api: _propTypes.default.func.isRequired,
  teamId: _propTypes.default.number.isRequired,
  teamName: _propTypes.default.string.isRequired,
  users: _propTypes.default.array.isRequired,
  teamAdmins: _propTypes.default.array.isRequired
};
var _default = DeleteTeam;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/description-field.jsx":
/*!*******************************************************!*\
  !*** ./src/presenters/includes/description-field.jsx ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.AuthDescription = exports.StaticDescription = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactTextareaAutosize = _interopRequireDefault(__webpack_require__(/*! react-textarea-autosize */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-textarea-autosize/7.1.0/node_modules/react-textarea-autosize/dist/react-textarea-autosize.esm.browser.js"));

var _markdown = _interopRequireDefault(__webpack_require__(/*! ./markdown.jsx */ "./src/presenters/includes/markdown.jsx"));

var _fieldHelpers = __webpack_require__(/*! ./field-helpers.jsx */ "./src/presenters/includes/field-helpers.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EditableDescriptionImpl extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus(event) {
    if (event.currentTarget === event.target) {
      this.setState({
        focused: true
      });
    }
  }

  onBlur() {
    this.setState({
      focused: false
    });
  }

  render() {
    var _this = this;

    const {
      description,
      placeholder
    } = this.props;
    return this.state.focused ? _react.default.createElement(_reactTextareaAutosize.default, {
      className: "description content-editable",
      value: description,
      onChange: function onChange(evt) {
        return _this.props.update(evt.target.value);
      },
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      placeholder: placeholder,
      spellCheck: false,
      autoFocus: true // eslint-disable-line jsx-a11y/no-autofocus

    }) : _react.default.createElement("p", {
      className: "description content-editable",
      placeholder: placeholder,
      "aria-label": placeholder,
      role: "textbox" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
      ,
      tabIndex: 0,
      onFocus: this.onFocus,
      onBlur: this.onBlur
    }, _react.default.createElement(_markdown.default, null, description));
  }

}

EditableDescriptionImpl.propTypes = {
  description: _propTypes.default.string.isRequired,
  placeholder: _propTypes.default.string,
  update: _propTypes.default.func.isRequired
};

const EditableDescription = function EditableDescription({
  description,
  placeholder,
  update
}) {
  return _react.default.createElement(_fieldHelpers.OptimisticValue, {
    value: description,
    update: update
  }, function ({
    value,
    update
  }) {
    return _react.default.createElement(EditableDescriptionImpl, {
      description: value,
      update: update,
      placeholder: placeholder
    });
  });
};

EditableDescription.propTypes = {
  description: _propTypes.default.string.isRequired,
  placeholder: _propTypes.default.string,
  update: _propTypes.default.func.isRequired
};

const StaticDescription = function StaticDescription({
  description
}) {
  return description ? _react.default.createElement("p", {
    className: "description read-only"
  }, _react.default.createElement(_markdown.default, null, description)) : null;
};

exports.StaticDescription = StaticDescription;
StaticDescription.propTypes = {
  description: _propTypes.default.string.isRequired
};

const AuthDescription = function AuthDescription({
  authorized,
  description,
  placeholder,
  update
}) {
  return authorized ? _react.default.createElement(EditableDescription, {
    description: description,
    update: update,
    placeholder: placeholder
  }) : _react.default.createElement(StaticDescription, {
    description: description
  });
};

exports.AuthDescription = AuthDescription;
AuthDescription.propTypes = {
  authorized: _propTypes.default.bool.isRequired,
  description: _propTypes.default.string.isRequired,
  placeholder: _propTypes.default.string,
  update: _propTypes.default.func.isRequired
};

/***/ }),

/***/ "./src/presenters/includes/dev-toggles.jsx":
/*!*************************************************!*\
  !*** ./src/presenters/includes/dev-toggles.jsx ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.DevToggles = exports.DevTogglesProvider = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _userPrefs = __webpack_require__(/*! ../includes/user-prefs.jsx */ "./src/presenters/includes/user-prefs.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Provider,
  Consumer
} = _react.default.createContext(); //  Dev Toggles!
//
//   Use dev toggles to parts of the site that are still in development.
//   This site is open source, there's no utility here, this is just a way to help us
//   ship things _extra_ early without impacting customer UX
//
// Define your dev toggles here.
// We can only have three.
// Users can enable them with the /secret page.


const toggleData = [{
  name: "Email Invites",
  description: "Enables invite-by-email behavior on the team page."
}, {
  name: "Everybody Dance!",
  description: "Placeholder for a new toggle."
}, {
  name: "Inflatable Crocodiles",
  description: "I don't think this does anything yet."
}].splice(0, 3); // <-- Yeah really, only 3.  If you need more, clean up one first.
// Usage:
// Import Devtoggles into your scope:
// import DevToggles from '../includes/dev-toggles.jsx`
// Use the DevToggles from inside of a DevTogglesProvider
// (Which in turn must be inside of a UserPrefProvider,
// both of which are provided by the Client.jsx)
// Fetch the array enabledToggles and test for features with [].includes:

/*
  <DevToggles>
    {(enabledToggles) => (
      <div> I could sure go for some:
        { enabledToggles.includes("fishsticks") && <FishSticks/> }
      </div>
    )}
  </DevToggles>
*/

const DevTogglesProvider = function DevTogglesProvider({
  children
}) {
  return _react.default.createElement(_userPrefs.UserPref, {
    name: "devToggles",
    default: []
  }, function (enabledToggles, setEnabledToggles) {
    return _react.default.createElement(Provider, {
      value: {
        enabledToggles,
        toggleData,
        setEnabledToggles
      }
    }, children);
  });
};

exports.DevTogglesProvider = DevTogglesProvider;
DevTogglesProvider.propTypes = {
  children: _propTypes.default.node.isRequired
};

const DevToggles = function DevToggles({
  children
}) {
  return _react.default.createElement(Consumer, null, function ({
    enabledToggles,
    toggleData,
    setEnabledToggles
  }) {
    return children(enabledToggles || [], toggleData, setEnabledToggles);
  });
};

exports.DevToggles = DevToggles;
DevToggles.propTypes = {
  children: _propTypes.default.func.isRequired
};
var _default = DevToggles;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/edit-collection-color.jsx":
/*!***********************************************************!*\
  !*** ./src/presenters/includes/edit-collection-color.jsx ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _editCollectionColorPop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/edit-collection-color-pop.jsx */ "./src/presenters/pop-overs/edit-collection-color-pop.jsx"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const EditCollectionColor = function EditCollectionColor(_ref) {
  let {
    update,
    initialColor
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["update", "initialColor"]);

  return _react.default.createElement(_popoverWithButton.default, {
    containerClass: "edit-collection-color-btn",
    buttonClass: "button add-project opens-pop-over",
    buttonText: "Color",
    passToggleToPop: true
  }, _react.default.createElement(_editCollectionColorPop.default, _extends({}, props, {
    updateColor: update,
    initialColor: initialColor
  })));
};

var _default = EditCollectionColor;
exports.default = _default;
EditCollectionColor.propTypes = {
  update: _propTypes.default.func.isRequired,
  initialColor: _propTypes.default.string.isRequired
};

/***/ }),

/***/ "./src/presenters/includes/edit-collection-name-and-url.jsx":
/*!******************************************************************!*\
  !*** ./src/presenters/includes/edit-collection-name-and-url.jsx ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.EditCollectionNameAndUrl = void 0;

var _kebabCase2 = _interopRequireDefault(__webpack_require__(/*! lodash/kebabCase */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/kebabCase.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _fieldHelpers = __webpack_require__(/*! ./field-helpers.jsx */ "./src/presenters/includes/field-helpers.jsx");

var _editableWrappingField = __webpack_require__(/*! ./editable-wrapping-field.jsx */ "./src/presenters/includes/editable-wrapping-field.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This recreates EditableField but OptimisticValue tracks both the name and url
// That way the url preview updates in real time as you type into the name field
const EditCollectionNameAndUrl = function EditCollectionNameAndUrl({
  name,
  url,
  update,
  isAuthorized
}) {
  const placeholder = 'Name your collection';
  return _react.default.createElement(_fieldHelpers.OptimisticValue, {
    value: {
      name,
      url
    },
    update: update,
    resetOnError: false
  }, function ({
    value: nameAndUrl,
    update: _update,
    error
  }) {
    return _react.default.createElement(_fieldHelpers.TrimmedValue, {
      value: nameAndUrl.name,
      update: function update(name) {
        return _update({
          name,
          url: (0, _kebabCase2.default)(name)
        });
      }
    }, function ({
      value: name,
      update
    }) {
      return _react.default.createElement("h1", {
        className: "collection-name"
      }, isAuthorized ? _react.default.createElement(_editableWrappingField.PureEditableWrappingField, {
        value: name,
        update: update,
        placeholder: placeholder,
        error: error
      }) : name);
    });
  });
};

exports.EditCollectionNameAndUrl = EditCollectionNameAndUrl;
EditCollectionNameAndUrl.propTypes = {
  name: _propTypes.default.string.isRequired,
  url: _propTypes.default.string.isRequired,
  update: _propTypes.default.func.isRequired,
  isAuthorized: _propTypes.default.bool.isRequired
};
var _default = EditCollectionNameAndUrl;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/editable-field.jsx":
/*!****************************************************!*\
  !*** ./src/presenters/includes/editable-field.jsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.EditableField = exports.PureEditableField = exports.PureEditableTextArea = void 0;

var _uniqueId2 = _interopRequireDefault(__webpack_require__(/*! lodash/uniqueId */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/uniqueId.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _fieldHelpers = __webpack_require__(/*! ./field-helpers.jsx */ "./src/presenters/includes/field-helpers.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class PureEditableFieldHolder extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: (0, _uniqueId2.default)("editable-field-")
    };
    this.textInput = _react.default.createRef();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.textInput.current.select();
    }
  }

  onChange(evt) {
    this.props.update(evt.target.value);
  }

  render() {
    const classes = ["content-editable", this.props.error ? "error" : ""].join(" ");
    const inputProps = {
      id: this.state.id,
      className: classes,
      value: this.props.value,
      onChange: this.onChange,
      spellCheck: false,
      autoComplete: "off",
      placeholder: this.props.placeholder,
      autoFocus: this.props.autoFocus,
      onBlur: this.props.blur,
      type: this.props.inputType
    };

    const maybeErrorIcon = !!this.props.error && _react.default.createElement(_fieldHelpers.FieldErrorIcon, null);

    const maybeErrorMessage = !!this.props.error && _react.default.createElement(_fieldHelpers.FieldErrorMessage, {
      error: this.props.error,
      hideIcon: true
    });

    const maybePrefix = !!this.props.prefix && _react.default.createElement("span", {
      className: "content-editable-affix " + classes
    }, this.props.prefix);

    const maybeSuffix = !!this.props.suffix && _react.default.createElement("span", {
      className: "content-editable-affix " + classes
    }, this.props.suffix);

    return _react.default.createElement("label", {
      htmlFor: inputProps.id
    }, _react.default.createElement("span", {
      className: "editable-field-flex"
    }, maybePrefix, _react.default.createElement("span", {
      className: "editable-field-input"
    }, this.props.children(inputProps, this.textInput), maybeErrorIcon), maybeSuffix), maybeErrorMessage);
  }

}

PureEditableFieldHolder.propTypes = {
  value: _propTypes.default.string.isRequired,
  placeholder: _propTypes.default.string.isRequired,
  update: _propTypes.default.func.isRequired,
  children: _propTypes.default.func.isRequired,
  // function that takes inputProps and inputRef as parameters and returns a node
  blur: _propTypes.default.func,
  prefix: _propTypes.default.node,
  suffix: _propTypes.default.node,
  autoFocus: _propTypes.default.bool,
  error: _propTypes.default.string
};

const PureEditableTextArea = function PureEditableTextArea(props) {
  return _react.default.createElement(PureEditableFieldHolder, props, function (inputProps, inputRef) {
    return _react.default.createElement("textarea", _extends({}, inputProps, {
      ref: inputRef
    }));
  });
};

exports.PureEditableTextArea = PureEditableTextArea;
PureEditableTextArea.propTypes = {
  value: _propTypes.default.string.isRequired,
  placeholder: _propTypes.default.string.isRequired,
  update: _propTypes.default.func.isRequired,
  blur: _propTypes.default.func,
  prefix: _propTypes.default.node,
  suffix: _propTypes.default.node,
  autoFocus: _propTypes.default.bool,
  error: _propTypes.default.string,
  inputType: _propTypes.default.string
};

const PureEditableField = function PureEditableField(props) {
  return _react.default.createElement(PureEditableFieldHolder, props, function (inputProps, inputRef) {
    return _react.default.createElement("input", _extends({}, inputProps, {
      ref: inputRef
    }));
  });
};

exports.PureEditableField = PureEditableField;
PureEditableField.propTypes = {
  value: _propTypes.default.string.isRequired,
  placeholder: _propTypes.default.string.isRequired,
  update: _propTypes.default.func.isRequired,
  blur: _propTypes.default.func,
  prefix: _propTypes.default.node,
  suffix: _propTypes.default.node,
  autoFocus: _propTypes.default.bool,
  error: _propTypes.default.string,
  inputType: _propTypes.default.string
};

const EditableField = function EditableField(_ref) {
  let {
    value,
    update
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["value", "update"]);

  return _react.default.createElement(_fieldHelpers.OptimisticValue, {
    value: value,
    update: update,
    resetOnError: false
  }, function ({
    value,
    update,
    error
  }) {
    return _react.default.createElement(_fieldHelpers.TrimmedValue, {
      value: value,
      update: update
    }, function (valueProps) {
      return _react.default.createElement(PureEditableField, _extends({}, props, valueProps, {
        error: error
      }));
    });
  });
};

exports.EditableField = EditableField;
EditableField.propTypes = {
  value: _propTypes.default.string.isRequired,
  placeholder: _propTypes.default.string.isRequired,
  update: _propTypes.default.func.isRequired,
  blur: _propTypes.default.func,
  prefix: _propTypes.default.node,
  suffix: _propTypes.default.node,
  autoFocus: _propTypes.default.bool
};
var _default = EditableField;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/editable-wrapping-field.jsx":
/*!*************************************************************!*\
  !*** ./src/presenters/includes/editable-wrapping-field.jsx ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.EditableWrappingField = exports.PureEditableWrappingField = void 0;

var _uniqueId2 = _interopRequireDefault(__webpack_require__(/*! lodash/uniqueId */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/uniqueId.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactTextareaAutosize = _interopRequireDefault(__webpack_require__(/*! react-textarea-autosize */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-textarea-autosize/7.1.0/node_modules/react-textarea-autosize/dist/react-textarea-autosize.esm.browser.js"));

var _fieldHelpers = __webpack_require__(/*! ./field-helpers.jsx */ "./src/presenters/includes/field-helpers.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

class PureEditableWrappingField extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: (0, _uniqueId2.default)("editable-field-")
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(evt) {
    this.props.update(evt.target.value.replace(/\r?\n/g, ''));
  }

  render() {
    const classes = ["content-editable", this.props.error ? "error" : ""].join(" ");
    const inputProps = {
      id: this.state.id,
      className: classes,
      value: this.props.value,
      onChange: this.onChange,
      spellCheck: false,
      autoComplete: "off",
      placeholder: this.props.placeholder,
      autoFocus: this.props.autoFocus
    };
    return _react.default.createElement("label", {
      htmlFor: inputProps.id
    }, _react.default.createElement(_reactTextareaAutosize.default, inputProps), !!this.props.error && _react.default.createElement(_fieldHelpers.FieldErrorMessage, {
      error: this.props.error
    }));
  }

}

exports.PureEditableWrappingField = PureEditableWrappingField;
PureEditableWrappingField.propTypes = {
  value: _propTypes.default.string.isRequired,
  placeholder: _propTypes.default.string.isRequired,
  update: _propTypes.default.func.isRequired,
  autoFocus: _propTypes.default.bool,
  error: _propTypes.default.string
};

const EditableWrappingField = function EditableWrappingField(_ref) {
  let {
    value,
    update
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["value", "update"]);

  return _react.default.createElement(_fieldHelpers.OptimisticValue, {
    value: value,
    update: update,
    resetOnError: false
  }, function ({
    value,
    update,
    error
  }) {
    return _react.default.createElement(_fieldHelpers.TrimmedValue, {
      value: value,
      update: update
    }, function (valueProps) {
      return _react.default.createElement(PureEditableWrappingField, _extends({}, props, valueProps, {
        error: error
      }));
    });
  });
};

exports.EditableWrappingField = EditableWrappingField;
EditableWrappingField.propTypes = {
  value: _propTypes.default.string.isRequired,
  placeholder: _propTypes.default.string.isRequired,
  update: _propTypes.default.func.isRequired,
  autoFocus: _propTypes.default.bool
};
var _default = EditableWrappingField;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/error-boundary.jsx":
/*!****************************************************!*\
  !*** ./src/presenters/includes/error-boundary.jsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _sentry = __webpack_require__(/*! ../../utils/sentry */ "./src/utils/sentry.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ErrorBoundary extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  componentDidCatch(error) {
    console.error(error);
    (0, _sentry.captureException)(error);
    this.setState({
      error
    });
  }

  render() {
    const {
      children,
      fallback
    } = this.props;
    const {
      error
    } = this.state;
    return error ? fallback : children;
  }

}

exports.default = ErrorBoundary;
ErrorBoundary.propTypes = {
  children: _propTypes.default.node.isRequired,
  fallback: _propTypes.default.node
};
ErrorBoundary.defaultProps = {
  fallback: 'Something went wrong, try refreshing?'
};

/***/ }),

/***/ "./src/presenters/includes/expander.jsx":
/*!**********************************************!*\
  !*** ./src/presenters/includes/expander.jsx ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Expander extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      startedExpanding: false,
      doneExpanding: false,
      scrollHeight: Infinity
    };
    this.ref = _react.default.createRef();
    this.updateHeight = this.updateHeight.bind(this);
  }

  componentDidMount() {
    this.updateHeight();
    this.ref.current.addEventListener('load', this.updateHeight, {
      capture: true
    });
    window.addEventListener('resize', this.updateHeight, {
      passive: true
    });
  }

  componentWillUnmount() {
    this.ref.current.removeEventListener('load', this.updateHeight, {
      capture: true
    });
    window.removeEventListener('resize', this.updateHeight, {
      passive: true
    });
  }

  componentDidUpdate() {
    this.updateHeight();
  }

  updateHeight() {
    const scrollHeight = this.ref.current.scrollHeight;

    if (scrollHeight !== this.state.scrollHeight) {
      this.setState({
        scrollHeight
      });
    }
  }

  expand() {
    this.updateHeight();
    this.setState({
      startedExpanding: true
    });
  }

  onExpandEnd(evt) {
    if (evt.propertyName === 'max-height') {
      this.setState({
        doneExpanding: true
      });
    }
  }

  render() {
    const {
      startedExpanding,
      doneExpanding,
      scrollHeight
    } = this.state;
    const aboveLimit = scrollHeight > this.props.height;
    const limitHeight = aboveLimit ? this.props.height - this.props.minSlide : this.props.height;
    const maxHeight = startedExpanding ? scrollHeight : limitHeight;
    const style = !doneExpanding ? {
      maxHeight
    } : null;
    return _react.default.createElement("div", {
      ref: this.ref,
      className: "expander",
      style: style,
      onTransitionEnd: startedExpanding ? this.onExpandEnd.bind(this) : null
    }, this.props.children, !doneExpanding && aboveLimit && _react.default.createElement("div", {
      className: "expander-mask"
    }, !startedExpanding && _react.default.createElement("button", {
      onClick: this.expand.bind(this),
      className: "expander-button button-small button-tertiary"
    }, "Show More")));
  }

}

exports.default = Expander;
Expander.propTypes = {
  children: _propTypes.default.node.isRequired,
  height: _propTypes.default.number.isRequired,
  minSlide: _propTypes.default.number.isRequired
};
Expander.defaultProps = {
  minSlide: 50
};

/***/ }),

/***/ "./src/presenters/includes/field-helpers.jsx":
/*!***************************************************!*\
  !*** ./src/presenters/includes/field-helpers.jsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.FieldErrorMessage = exports.FieldErrorIcon = exports.TrimmedValue = exports.OptimisticValue = void 0;

var _debounce2 = _interopRequireDefault(__webpack_require__(/*! lodash/debounce */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/debounce.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class OptimisticValue extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      // value is only set when waiting for server response
      error: null // error is only set if there is an error ¯\_(ツ)_/¯

    };
    this.onChange = this.onChange.bind(this);
    this.update = (0, _debounce2.default)(this.update.bind(this), 500);
  }

  async update(value) {
    try {
      await this.props.update(value);
      this.setState(function (prevState, props) {
        // if value didn't change during this update then switch back to props
        if (prevState.value === props.value) {
          return {
            value: null,
            error: null
          };
        }

        return {
          error: null
        };
      });
    } catch (error) {
      this.setState(function (prevState, props) {
        // The update failed; we can ignore this if our state has already moved on
        if (prevState.value !== value) {
          return {};
        } // Ah, we haven't moved on, and we know the last edit failed.
        // Ok, display an error.


        if (props.resetOnError) {
          return {
            error,
            value: null
          };
        }

        return {
          error
        };
      });
    }
  }

  onChange(value) {
    this.update(value);
    this.setState({
      value
    });
  }

  render() {
    return this.props.children({
      value: this.state.value !== null ? this.state.value : this.props.value,
      error: this.state.error,
      update: this.onChange
    });
  }

}

exports.OptimisticValue = OptimisticValue;
OptimisticValue.propTypes = {
  value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]).isRequired,
  update: _propTypes.default.func.isRequired,
  resetOnError: _propTypes.default.bool
};
OptimisticValue.defaultProps = {
  resetOnError: true
};

class TrimmedValue extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    this.update = this.update.bind(this);
  }

  update(value) {
    this.props.update(value.trim());
    this.setState({
      value
    });
  }

  render() {
    return this.props.children({
      value: this.state.value.trim() === this.props.value ? this.state.value : this.props.value,
      update: this.update
    });
  }

}

exports.TrimmedValue = TrimmedValue;
TrimmedValue.propTypes = {
  value: _propTypes.default.string.isRequired,
  update: _propTypes.default.func.isRequired
};

const FieldErrorIcon = function FieldErrorIcon() {
  return _react.default.createElement("span", {
    className: "editable-field-error-icon",
    role: "img",
    "aria-label": "Warning"
  }, "\uD83D\uDE92");
};

exports.FieldErrorIcon = FieldErrorIcon;

const FieldErrorMessage = function FieldErrorMessage({
  error,
  hideIcon
}) {
  return _react.default.createElement("span", {
    className: "editable-field-error-message"
  }, !hideIcon && _react.default.createElement(FieldErrorIcon, null), error);
};

exports.FieldErrorMessage = FieldErrorMessage;
FieldErrorMessage.propTypes = {
  error: _propTypes.default.node.isRequired,
  hideIcon: _propTypes.default.bool
};

/***/ }),

/***/ "./src/presenters/includes/konami.jsx":
/*!********************************************!*\
  !*** ./src/presenters/includes/konami.jsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactKonami = _interopRequireDefault(__webpack_require__(/*! react-konami */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-konami/0.5.0/node_modules/react-konami/build/Konami.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Usage:
// <Konami>
//   Inner part will render once konami code is entered.
// </Konami>
class Konami extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }

  render() {
    var _this = this;

    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_reactKonami.default, {
      easterEgg: function easterEgg() {
        return _this.setState({
          active: true
        });
      }
    }), !!this.state.active && this.props.children);
  }

}

exports.default = Konami;
Konami.propTypes = {
  children: _propTypes.default.node.isRequired
};

/***/ }),

/***/ "./src/presenters/includes/link.jsx":
/*!******************************************!*\
  !*** ./src/presenters/includes/link.jsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.UserLink = exports.TeamLink = exports.ProjectLink = exports.CollectionLink = exports.Link = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _collection = __webpack_require__(/*! ../../models/collection */ "./src/models/collection.js");

var _project = __webpack_require__(/*! ../../models/project */ "./src/models/project.js");

var _team = __webpack_require__(/*! ../../models/team */ "./src/models/team.js");

var _user = __webpack_require__(/*! ../../models/user */ "./src/models/user.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/* global EXTERNAL_ROUTES */
const external = Array.from(EXTERNAL_ROUTES);

const Link = _react.default.forwardRef(function Link(_ref, ref) {
  let {
    to,
    children
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["to", "children"]);

  if (typeof to === 'string') {
    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(to, currentUrl);

    if (targetUrl.origin !== currentUrl.origin || external.some(function (route) {
      return targetUrl.pathname.startsWith(route);
    })) {
      return _react.default.createElement("a", _extends({
        href: to
      }, props, {
        ref: ref
      }), children);
    }

    to = {
      pathname: targetUrl.pathname,
      search: targetUrl.search,
      hash: targetUrl.hash
    };
  }

  return _react.default.createElement(_reactRouterDom.Link, _extends({
    to: to
  }, props, {
    innerRef: ref
  }), children);
});

exports.Link = Link;
Link.propTypes = {
  to: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]).isRequired,
  children: _propTypes.default.node.isRequired
};

const CollectionLink = function CollectionLink(_ref2) {
  let {
    collection,
    children
  } = _ref2,
      props = _objectWithoutPropertiesLoose(_ref2, ["collection", "children"]);

  return _react.default.createElement(Link, _extends({
    to: (0, _collection.getLink)(collection)
  }, props), children);
};

exports.CollectionLink = CollectionLink;
CollectionLink.propTypes = {
  collection: _propTypes.default.oneOfType([_propTypes.default.shape({
    team: _propTypes.default.PropTypes.shape({
      url: _propTypes.default.string.isRequired
    }).isRequired,
    url: _propTypes.default.string.isRequired
  }), _propTypes.default.shape({
    user: _propTypes.default.PropTypes.shape({
      id: _propTypes.default.number.isRequired,
      login: _propTypes.default.string
    }).isRequired,
    url: _propTypes.default.string.isRequired
  })]).isRequired
};

const ProjectLink = function ProjectLink(_ref3) {
  let {
    project,
    children
  } = _ref3,
      props = _objectWithoutPropertiesLoose(_ref3, ["project", "children"]);

  return _react.default.createElement(Link, _extends({
    to: (0, _project.getLink)(project)
  }, props), children);
};

exports.ProjectLink = ProjectLink;
ProjectLink.propTypes = {
  project: _propTypes.default.shape({
    domain: _propTypes.default.string.isRequired
  }).isRequired
};

const TeamLink = function TeamLink(_ref4) {
  let {
    team,
    children
  } = _ref4,
      props = _objectWithoutPropertiesLoose(_ref4, ["team", "children"]);

  return _react.default.createElement(Link, _extends({
    to: (0, _team.getLink)(team)
  }, props), children);
};

exports.TeamLink = TeamLink;
TeamLink.propTypes = {
  team: _propTypes.default.shape({
    url: _propTypes.default.string.isRequired
  }).isRequired
};

const UserLink = function UserLink(_ref5) {
  let {
    user,
    children
  } = _ref5,
      props = _objectWithoutPropertiesLoose(_ref5, ["user", "children"]);

  return _react.default.createElement(Link, _extends({
    to: (0, _user.getLink)(user)
  }, props), children);
};

exports.UserLink = UserLink;
UserLink.propTypes = {
  user: _propTypes.default.shape({
    id: _propTypes.default.number.isRequired,
    login: _propTypes.default.string
  }).isRequired
};
var _default = Link;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/loader.jsx":
/*!********************************************!*\
  !*** ./src/presenters/includes/loader.jsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.DataLoader = exports.default = exports.Loader = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Loader = function Loader() {
  return _react.default.createElement("div", {
    className: "loader"
  }, _react.default.createElement("div", {
    className: "moon"
  }), _react.default.createElement("div", {
    className: "earth"
  }), _react.default.createElement("div", {
    className: "asteroid"
  }), _react.default.createElement("div", {
    className: "asteroid-dust"
  }));
};

exports.Loader = Loader;
var _default = Loader;
exports.default = _default;

class DataLoader extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      maybeData: null,
      loaded: false,
      maybeError: null
    };
  }

  componentDidMount() {
    var _this = this;

    this.props.get().then(function (data) {
      return _this.setState({
        maybeData: data,
        loaded: true
      });
    }, function (error) {
      console.error(error);

      _this.setState({
        maybeError: error
      });
    });
  }

  render() {
    if (this.state.loaded) {
      return this.props.children(this.state.maybeData);
    } else if (this.state.maybeError) {
      return this.props.renderError(this.state.maybeError);
    }

    return this.props.renderLoader();
  }

}

exports.DataLoader = DataLoader;
DataLoader.propTypes = {
  children: _propTypes.default.func.isRequired,
  get: _propTypes.default.func.isRequired,
  renderError: _propTypes.default.func,
  renderLoader: _propTypes.default.func
};
DataLoader.defaultProps = {
  renderError: function renderError() {
    return 'Something went wrong, try refreshing?';
  },
  renderLoader: Loader
};

/***/ }),

/***/ "./src/presenters/includes/local-storage.jsx":
/*!***************************************************!*\
  !*** ./src/presenters/includes/local-storage.jsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LocalStorage extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      loaded: false
    };
    this.handleStorage = this.handleStorage.bind(this);
  }

  handleStorage() {
    let value = undefined;

    try {
      const raw = window.localStorage.getItem(this.props.name);

      if (raw !== null) {
        value = JSON.parse(raw);
      }
    } catch (error) {
      console.error('Failed to read from localStorage!', error);
      value = undefined;
    }

    this.setState({
      value,
      loaded: true
    });
  }

  componentDidMount() {
    if (!this.props.ignoreChanges) {
      window.addEventListener('storage', this.handleStorage, {
        passive: true
      });
    }

    this.handleStorage();
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.handleStorage, {
      passive: true
    });
  }

  set(value) {
    try {
      if (value !== undefined) {
        window.localStorage.setItem(this.props.name, JSON.stringify(value));
      } else {
        window.localStorage.removeItem(this.props.name);
      }
    } catch (error) {
      console.error('Failed to write to localStorage!', error);
    }

    this.setState({
      value
    });
  }

  render() {
    return this.props.children(this.state.value !== undefined ? this.state.value : this.props.default, this.set.bind(this), this.state.loaded);
  }

}

exports.default = LocalStorage;
LocalStorage.propTypes = {
  children: _propTypes.default.func.isRequired,
  name: _propTypes.default.string.isRequired,
  default: _propTypes.default.any,
  ignoreChanges: _propTypes.default.bool
};

/***/ }),

/***/ "./src/presenters/includes/logo.jsx":
/*!******************************************!*\
  !*** ./src/presenters/includes/logo.jsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _dayjs = _interopRequireDefault(__webpack_require__(/*! dayjs */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/dayjs/1.8.0/node_modules/dayjs/dayjs.min.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Logo extends _react.default.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hour: new Date().getHours()
    };
  }

  componentDidMount() {
    var _this = this;

    this.interval = window.setInterval(function () {
      _this.setState({
        hour: new Date().getHours()
      });
    }, _dayjs.default.convert(5, 'minutes', 'ms'));
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    const {
      hour
    } = this.state;
    const LOGO_DAY = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg";
    const LOGO_SUNSET = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg";
    const LOGO_NIGHT = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg";
    let logo = LOGO_DAY;

    if (hour >= 16 && hour <= 18) {
      logo = LOGO_SUNSET;
    } else if (hour > 18 || hour <= 8) {
      logo = LOGO_NIGHT;
    }

    return _react.default.createElement("img", {
      className: "logo",
      src: logo,
      alt: "Glitch"
    });
  }

}

exports.default = Logo;

/***/ }),

/***/ "./src/presenters/includes/markdown.jsx":
/*!**********************************************!*\
  !*** ./src/presenters/includes/markdown.jsx ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.TruncatedMarkdown = exports.Markdown = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _htmlTruncate = _interopRequireDefault(__webpack_require__(/*! html-truncate */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/html-truncate/1.2.2/node_modules/html-truncate/lib/truncate.js"));

var _markdownIt = _interopRequireDefault(__webpack_require__(/*! markdown-it */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/markdown-it/8.4.2/node_modules/markdown-it/index.js"));

var _markdownItEmoji = _interopRequireDefault(__webpack_require__(/*! markdown-it-emoji */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/markdown-it-emoji/1.4.0/node_modules/markdown-it-emoji/index.js"));

var _markdownItSanitizer = _interopRequireDefault(__webpack_require__(/*! markdown-it-sanitizer */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/markdown-it-sanitizer/0.4.3/node_modules/markdown-it-sanitizer/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const md = (0, _markdownIt.default)({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
}).disable('smartquotes').use(_markdownItEmoji.default).use(_markdownItSanitizer.default);

const RawHTML = function RawHTML({
  children
}) {
  return children ? _react.default.createElement("span", {
    className: "markdown-content",
    dangerouslySetInnerHTML: {
      __html: children
    }
  }) : null;
};

RawHTML.propTypes = {
  children: _propTypes.default.string.isRequired
};

const Markdown = _react.default.memo(function Markdown({
  children
}) {
  const rendered = md.render(children || '');
  return _react.default.createElement(RawHTML, null, rendered);
});

exports.Markdown = Markdown;
Markdown.propTypes = {
  children: _propTypes.default.string.isRequired
};

const TruncatedMarkdown = _react.default.memo(function ({
  children,
  length
}) {
  const rendered = md.render(children || '');
  const truncated = (0, _htmlTruncate.default)(rendered, length, {
    ellipsis: '…'
  });
  return _react.default.createElement(RawHTML, null, truncated);
});

exports.TruncatedMarkdown = TruncatedMarkdown;
TruncatedMarkdown.propTypes = {
  children: _propTypes.default.string.isRequired,
  length: _propTypes.default.number.isRequired
};
var _default = Markdown;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/name-conflict.jsx":
/*!***************************************************!*\
  !*** ./src/presenters/includes/name-conflict.jsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

var _link = _interopRequireDefault(__webpack_require__(/*! ./link.jsx */ "./src/presenters/includes/link.jsx"));

var _notifications = _interopRequireDefault(__webpack_require__(/*! ../notifications.jsx */ "./src/presenters/notifications.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const NameConflictWarning = function NameConflictWarning({
  id
}) {
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("p", null, "This team has your name. You should update your info to remain unique \u2744"), _react.default.createElement(_link.default, {
    className: "button button-small button-tertiary button-in-notification-container",
    to: `/user/${id}`
  }, "Your Profile"));
};

NameConflictWarning.propTypes = {
  id: _propTypes.default.number.isRequired
};

class NameConflict extends _react.default.Component {
  componentDidMount() {
    const content = NameConflictWarning({
      id: this.props.userId
    });
    this.notification = this.props.createPersistentNotification(content);
  }

  componentWillUnmount() {
    this.notification.removeNotification();
  }

  render() {
    return null;
  }

}

NameConflict.propTypes = {
  createPersistentNotification: _propTypes.default.func.isRequired,
  userId: _propTypes.default.number
};

const NameConflictContainer = function NameConflictContainer() {
  return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function ({
    id
  }) {
    return _react.default.createElement(_notifications.default, null, function (notifyFuncs) {
      return _react.default.createElement(NameConflict, _extends({
        userId: id
      }, notifyFuncs));
    });
  });
};

var _default = NameConflictContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/not-found.jsx":
/*!***********************************************!*\
  !*** ./src/presenters/includes/not-found.jsx ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const compass = "https://cdn.glitch.com/bc50f686-4c0a-4e20-852f-3999b29e8092%2Fcompass.svg?1545073264846";
const needle = "https://cdn.glitch.com/bc50f686-4c0a-4e20-852f-3999b29e8092%2Fneedle.svg?1545073265096";

const NotFound = function NotFound({
  name
}) {
  return _react.default.createElement("section", null, _react.default.createElement("p", null, "We didn't find ", name), _react.default.createElement("div", {
    className: "error-image"
  }, _react.default.createElement("img", {
    className: "compass",
    src: compass,
    alt: ""
  }), _react.default.createElement("img", {
    className: "needle",
    src: needle,
    alt: ""
  })));
};

NotFound.propTypes = {
  name: _propTypes.default.string.isRequired
};
var _default = NotFound;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/profile.jsx":
/*!*********************************************!*\
  !*** ./src/presenters/includes/profile.jsx ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.ProfileContainer = exports.CoverContainer = exports.InfoContainer = exports.ProjectInfoContainer = exports.ImageButtons = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _teamsList = _interopRequireDefault(__webpack_require__(/*! ../teams-list */ "./src/presenters/teams-list.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// Image Buttons
const ImageButtons = function ImageButtons({
  name,
  uploadImage,
  clearImage
}) {
  return _react.default.createElement("div", {
    className: "upload-image-buttons"
  }, !!uploadImage && _react.default.createElement(_analytics.TrackClick, {
    name: `Upload ${name}`
  }, _react.default.createElement("button", {
    className: "button button-small button-tertiary",
    onClick: uploadImage
  }, "Upload ", name)), !!clearImage && _react.default.createElement(_analytics.TrackClick, {
    name: `Clear ${name}`
  }, _react.default.createElement("button", {
    className: "button button-small button-tertiary",
    onClick: clearImage
  }, "Clear ", name)));
};

exports.ImageButtons = ImageButtons;
ImageButtons.propTypes = {
  name: _propTypes.default.string.isRequired,
  uploadImage: _propTypes.default.func,
  clearImage: _propTypes.default.func
}; // Project Info Container

const ProjectInfoContainer = function ProjectInfoContainer({
  style,
  children,
  buttons
}) {
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
    className: "avatar-container"
  }, _react.default.createElement("div", {
    className: "user-avatar",
    style: style
  }), buttons), _react.default.createElement("div", {
    className: "profile-information"
  }, children));
};

exports.ProjectInfoContainer = ProjectInfoContainer;
ProjectInfoContainer.propTypes = {
  style: _propTypes.default.object.isRequired,
  children: _propTypes.default.node.isRequired,
  buttons: _propTypes.default.element
}; // Info Container (generic)

const InfoContainer = function InfoContainer({
  children
}) {
  return _react.default.createElement("div", {
    className: "profile-info"
  }, children);
};

exports.InfoContainer = InfoContainer;
InfoContainer.propTypes = {
  children: _propTypes.default.node.isRequired
}; // Cover Container

const CoverContainer = function CoverContainer(_ref) {
  let {
    buttons,
    children,
    className
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["buttons", "children", "className"]);

  return _react.default.createElement("div", _extends({
    className: `cover-container ${className}`
  }, props), children, buttons);
};

exports.CoverContainer = CoverContainer;
CoverContainer.propTypes = {
  buttons: _propTypes.default.node,
  children: _propTypes.default.node.isRequired,
  className: _propTypes.default.string
};
CoverContainer.defaultProps = {
  className: ''
}; // Profile Container

const ProfileContainer = function ProfileContainer({
  avatarStyle,
  avatarButtons,
  coverStyle,
  coverButtons,
  children,
  teams
}) {
  return _react.default.createElement(CoverContainer, {
    style: coverStyle,
    buttons: coverButtons
  }, _react.default.createElement(InfoContainer, null, _react.default.createElement("div", {
    className: "avatar-container"
  }, _react.default.createElement("div", {
    className: "user-avatar",
    style: avatarStyle
  }), avatarButtons), _react.default.createElement("div", {
    className: "profile-information"
  }, children)), !!teams && !!teams.length && _react.default.createElement("div", {
    className: "teams-information"
  }, _react.default.createElement(_teamsList.default, {
    teams: teams
  })));
};

exports.ProfileContainer = ProfileContainer;

/***/ }),

/***/ "./src/presenters/includes/project-actions.jsx":
/*!*****************************************************!*\
  !*** ./src/presenters/includes/project-actions.jsx ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.RemixButton = exports.EditButton = exports.ShowButton = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _project = __webpack_require__(/*! ../../models/project */ "./src/models/project.js");

var _link = _interopRequireDefault(__webpack_require__(/*! ./link.jsx */ "./src/presenters/includes/link.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const showIcon = "https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg";

const ButtonLink = function ButtonLink(_ref) {
  let {
    href,
    children,
    className
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["href", "children", "className"]);

  return _react.default.createElement(_link.default, _extends({
    to: href,
    className: `button button-link ${className}`
  }, props), children);
};

ButtonLink.propTypes = {
  href: _propTypes.default.string.isRequired,
  children: _propTypes.default.node.isRequired,
  className: _propTypes.default.string
};

const ShowButton = function ShowButton(_ref2) {
  let {
    name,
    className
  } = _ref2,
      props = _objectWithoutPropertiesLoose(_ref2, ["name", "className"]);

  return _react.default.createElement(ButtonLink, _extends({
    href: (0, _project.getShowUrl)(name),
    className: `has-emoji ${className}`
  }, props), _react.default.createElement("img", {
    src: showIcon,
    alt: ""
  }), ' ', "Show");
};

exports.ShowButton = ShowButton;
ShowButton.propTypes = {
  name: _propTypes.default.string.isRequired,
  className: _propTypes.default.string
};

const EditButton = function EditButton(_ref3) {
  let {
    name,
    isMember
  } = _ref3,
      props = _objectWithoutPropertiesLoose(_ref3, ["name", "isMember"]);

  return _react.default.createElement(ButtonLink, _extends({
    href: (0, _project.getEditorUrl)(name)
  }, props), isMember ? 'Edit Project' : 'View Source');
};

exports.EditButton = EditButton;
EditButton.propTypes = {
  name: _propTypes.default.string.isRequired,
  isMember: _propTypes.default.bool,
  className: _propTypes.default.string
};

const RemixButton = function RemixButton(_ref4) {
  let {
    name,
    isMember,
    className
  } = _ref4,
      props = _objectWithoutPropertiesLoose(_ref4, ["name", "isMember", "className"]);

  return _react.default.createElement(ButtonLink, _extends({
    href: (0, _project.getRemixUrl)(name),
    className: `has-emoji ${className}`
  }, props), isMember ? 'Remix This' : 'Remix your own', ' ', _react.default.createElement("span", {
    className: "emoji microphone",
    role: "presentation"
  }));
};

exports.RemixButton = RemixButton;
RemixButton.propTypes = {
  name: _propTypes.default.string.isRequired,
  isMember: _propTypes.default.bool,
  className: _propTypes.default.string
};

/***/ }),

/***/ "./src/presenters/includes/project-result-item.jsx":
/*!*********************************************************!*\
  !*** ./src/presenters/includes/project-result-item.jsx ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _link = __webpack_require__(/*! ./link */ "./src/presenters/includes/link.jsx");

var _project = __webpack_require__(/*! ../../models/project */ "./src/models/project.js");

var _usersList = __webpack_require__(/*! ../users-list.jsx */ "./src/presenters/users-list.jsx");

var _project2 = __webpack_require__(/*! ../../models/project.js */ "./src/models/project.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const ProjectResultItem = function ProjectResultItem(_ref) {
  let {
    onClick,
    isActive,
    isPrivate,
    cdnUrl
  } = _ref,
      project = _objectWithoutPropertiesLoose(_ref, ["onClick", "isActive", "isPrivate", "cdnUrl"]);

  const activeClass = isActive ? "active" : "";
  const privateClass = isPrivate ? "private" : "";
  const resultClass = `button-unstyled result result-project ${activeClass} ${privateClass}`;
  const srcFallback = _project2.FALLBACK_AVATAR_URL;
  const {
    id,
    domain,
    description,
    users
  } = project;
  return _react.default.createElement("div", null, _react.default.createElement("button", {
    className: resultClass,
    onClick: onClick,
    "data-project-id": id
  }, _react.default.createElement("img", {
    className: "avatar",
    src: (0, _project.getAvatarUrl)(id, cdnUrl),
    alt: `Project avatar for ${domain}`,
    onError: function onError(event) {
      return event.target.src = srcFallback;
    }
  }), _react.default.createElement("div", {
    className: "results-info"
  }, _react.default.createElement("div", {
    className: "result-name",
    title: domain
  }, domain), description.length > 0 && _react.default.createElement("div", {
    className: "result-description"
  }, description), !!users && users.length > 0 && _react.default.createElement(_usersList.StaticUsersList, {
    users: users
  }))), _react.default.createElement(_link.ProjectLink, {
    project: project,
    className: "view-result-link button button-small button-link",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "View \u2192"));
};

ProjectResultItem.propTypes = {
  onClick: _propTypes.default.func.isRequired,
  domain: _propTypes.default.string.isRequired,
  description: _propTypes.default.string.isRequired,
  id: _propTypes.default.string.isRequired,
  users: _propTypes.default.array,
  isActive: _propTypes.default.bool,
  isPrivate: _propTypes.default.bool
};
var _default = ProjectResultItem;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/related-projects.jsx":
/*!******************************************************!*\
  !*** ./src/presenters/includes/related-projects.jsx ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _difference2 = _interopRequireDefault(__webpack_require__(/*! lodash/difference */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/difference.js"));

var _sampleSize2 = _interopRequireDefault(__webpack_require__(/*! lodash/sampleSize */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/sampleSize.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _team = __webpack_require__(/*! ../../models/team */ "./src/models/team.js");

var _user = __webpack_require__(/*! ../../models/user */ "./src/models/user.js");

var _loader = __webpack_require__(/*! ./loader.jsx */ "./src/presenters/includes/loader.jsx");

var _profile = __webpack_require__(/*! ./profile.jsx */ "./src/presenters/includes/profile.jsx");

var _link = __webpack_require__(/*! ./link.jsx */ "./src/presenters/includes/link.jsx");

var _projectsList = __webpack_require__(/*! ../projects-list.jsx */ "./src/presenters/projects-list.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PROJECT_COUNT = 3;

const RelatedProjectsBody = function RelatedProjectsBody({
  projects,
  coverStyle
}) {
  return projects.length ? _react.default.createElement(_profile.CoverContainer, {
    style: coverStyle,
    className: "projects"
  }, _react.default.createElement(_projectsList.ProjectsUL, {
    projects: projects
  })) : null;
};

RelatedProjectsBody.propTypes = {
  projects: _propTypes.default.array.isRequired
};

class RelatedProjects extends _react.default.Component {
  constructor(props) {
    super(props);
    const teams = (0, _sampleSize2.default)(props.teams, 1);
    const users = (0, _sampleSize2.default)(props.users, 2 - teams.length);
    this.state = {
      teams,
      users
    };
  }

  async getProjects(id, getPins, getAllProjects) {
    const pins = await getPins(id);
    const pinIds = pins.map(function (pin) {
      return pin.projectId;
    });
    let ids = (0, _sampleSize2.default)((0, _difference2.default)(pinIds, [this.props.ignoreProjectId]), PROJECT_COUNT);

    if (ids.length < PROJECT_COUNT) {
      const {
        projects
      } = await getAllProjects(id);
      const allIds = projects.map(function ({
        id
      }) {
        return id;
      });
      const remainingIds = (0, _difference2.default)(allIds, [this.props.ignoreProjectId, ...ids]);
      ids = [...ids, ...(0, _sampleSize2.default)(remainingIds, PROJECT_COUNT - ids.length)];
    }

    if (ids.length) {
      const {
        data
      } = await this.props.api.get(`projects/byIds?ids=${ids.join(',')}`);
      return data;
    }

    return [];
  }

  render() {
    var _this = this;

    const {
      api
    } = this.props;

    const getTeam = function getTeam(id) {
      return api.get(`teams/${id}`).then(function ({
        data
      }) {
        return data;
      });
    };

    const getTeamPins = function getTeamPins(id) {
      return api.get(`teams/${id}/pinned-projects`).then(function ({
        data
      }) {
        return data;
      });
    };

    const getUser = function getUser(id) {
      return api.get(`users/${id}`).then(function ({
        data
      }) {
        return data;
      });
    };

    const getUserPins = function getUserPins(id) {
      return api.get(`users/${id}/pinned-projects`).then(function ({
        data
      }) {
        return data;
      });
    };

    const {
      teams,
      users
    } = this.state;

    if (!teams.length && !users.length) {
      return null;
    }

    return _react.default.createElement("ul", {
      className: "related-projects"
    }, teams.map(function (team) {
      return _react.default.createElement("li", {
        key: team.id
      }, _react.default.createElement("h2", null, _react.default.createElement(_link.TeamLink, {
        team: team
      }, "More by ", team.name, " \u2192")), _react.default.createElement(_loader.DataLoader, {
        get: function get() {
          return _this.getProjects(team.id, getTeamPins, getTeam);
        }
      }, function (projects) {
        return _react.default.createElement(RelatedProjectsBody, {
          projects: projects,
          coverStyle: (0, _team.getProfileStyle)(team)
        });
      }));
    }), users.map(function (user) {
      return _react.default.createElement("li", {
        key: user.id
      }, _react.default.createElement("h2", null, _react.default.createElement(_link.UserLink, {
        user: user
      }, "More by ", (0, _user.getDisplayName)(user), " \u2192")), _react.default.createElement(_loader.DataLoader, {
        get: function get() {
          return _this.getProjects(user.id, getUserPins, getUser);
        }
      }, function (projects) {
        return _react.default.createElement(RelatedProjectsBody, {
          projects: projects,
          coverStyle: (0, _user.getProfileStyle)(user)
        });
      }));
    }));
  }

}

RelatedProjects.propTypes = {
  api: _propTypes.default.any.isRequired,
  ignoreProjectId: _propTypes.default.string.isRequired,
  teams: _propTypes.default.array.isRequired,
  users: _propTypes.default.array.isRequired
};
var _default = RelatedProjects;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/team-analytics-activity.jsx":
/*!*************************************************************!*\
  !*** ./src/presenters/includes/team-analytics-activity.jsx ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _isEmpty2 = _interopRequireDefault(__webpack_require__(/*! lodash/isEmpty */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/isEmpty.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _groupByTime = _interopRequireDefault(__webpack_require__(/*! group-by-time */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/group-by-time/1.0.0/node_modules/group-by-time/index.js"));

var d3Array = _interopRequireWildcard(__webpack_require__(/*! d3-array */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/d3-array/2.0.3/node_modules/d3-array/src/index.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// transforms the individual data points (buckets) we get from the api into grouped 'bins' of data
// each bin is then rendered as a point on the graph
const createHistogram = function createHistogram(bins) {
  let histogram = [];
  bins = bins || [];
  bins.forEach(function (bin) {
    let totalAppViews = 0;
    let totalRemixes = 0;
    let timestamp = undefined; // let codeViews = []

    bin.forEach(function (data) {
      if (!timestamp) {
        timestamp = data['@timestamp'];
      }

      totalRemixes += data.analytics.remixes;
      totalAppViews += data.analytics.visits; // referrers.push(data.analytics.referrers)
    });
    histogram.push({
      time: timestamp,
      appViews: totalAppViews,
      remixes: totalRemixes
    });
  });
  return histogram;
};

const groupByRegularIntervals = d3Array.histogram().value(function (data) {
  return data['@timestamp'];
});

const createBins = function createBins(buckets, currentTimeFrame) {
  if (currentTimeFrame === "Last 24 Hours") {
    return groupByRegularIntervals(buckets);
  }

  let bins = (0, _groupByTime.default)(buckets, '@timestamp', 'day'); // supports 'day', 'week', 'month'

  return Object.values(bins);
};

const chartColumns = function chartColumns(analytics, currentTimeFrame) {
  const buckets = analytics.buckets;
  let bins = createBins(buckets, currentTimeFrame);
  let histogram = createHistogram(bins);
  let timestamps = ['x'];
  let remixes = ['Remixes'];
  let appViews = ['Total App Views']; // let codeViews = ['Code Views']

  histogram.shift();
  histogram.forEach(function (bucket) {
    timestamps.push(bucket.time);
    appViews.push(bucket.appViews);
    remixes.push(bucket.remixes);
  });
  return [timestamps, appViews, remixes];
};

const dateFormat = function dateFormat(currentTimeFrame) {
  if (currentTimeFrame === "Last 24 Hours") {
    return "%H:%M %p";
  }

  return "%b-%d";
};

const renderChart = function renderChart(c3, analytics, currentTimeFrame) {
  let columns = [];

  if (!(0, _isEmpty2.default)(analytics)) {
    columns = chartColumns(analytics, currentTimeFrame);
  } // eslint-disable-next-line no-unused-vars


  var chart = c3.generate({
    size: {
      height: 200
    },
    data: {
      x: 'x',
      xFormat: dateFormat(currentTimeFrame),
      columns: columns
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: dateFormat(currentTimeFrame)
        }
      }
    }
  });
};

class TeamAnalyticsActivity extends _react.default.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isGettingData === true && this.props.isGettingData === false) {
      renderChart(this.props.c3, this.props.analytics, this.props.currentTimeFrame);
    }
  }

  render() {
    return null;
  }

}

TeamAnalyticsActivity.propTypes = {
  c3: _propTypes.default.object.isRequired,
  analytics: _propTypes.default.object.isRequired,
  currentTimeFrame: _propTypes.default.string.isRequired,
  isGettingData: _propTypes.default.bool.isRequired
};
var _default = TeamAnalyticsActivity;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/team-analytics-project-details.jsx":
/*!********************************************************************!*\
  !*** ./src/presenters/includes/team-analytics-project-details.jsx ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _dayjs = _interopRequireDefault(__webpack_require__(/*! dayjs */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/dayjs/1.8.0/node_modules/dayjs/dayjs.min.js"));

var _link = __webpack_require__(/*! ./link.jsx */ "./src/presenters/includes/link.jsx");

var _loader = _interopRequireDefault(__webpack_require__(/*! ./loader.jsx */ "./src/presenters/includes/loader.jsx"));

var _project = __webpack_require__(/*! ../../models/project.js */ "./src/models/project.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RECENT_REMIXES_COUNT = 100;

const getProjectDetails = async function getProjectDetails({
  id,
  api,
  currentProjectDomain
}) {
  let path = `analytics/${id}/project/${currentProjectDomain}/overview`;

  try {
    return await api.get(path);
  } catch (error) {
    console.error('getProjectDetails', error);
  }
};

const addFallbackSrc = function addFallbackSrc(event) {
  event.target.src = _project.FALLBACK_AVATAR_URL;
};

const ProjectAvatar = function ProjectAvatar({
  project,
  className = ''
}) {
  return _react.default.createElement("img", {
    src: (0, _project.getAvatarUrl)(project.id),
    className: `avatar ${className}`,
    alt: project.domain,
    onError: addFallbackSrc
  });
};

ProjectAvatar.propTypes = {
  project: _propTypes.default.shape({
    domain: _propTypes.default.string.isRequired,
    id: _propTypes.default.string.isRequired
  }).isRequired,
  className: _propTypes.default.string
};

const ProjectDetails = function ProjectDetails({
  projectDetails
}) {
  // This uses dayjs().fromNow() a bunch of times
  // That requires the relativeTime plugin
  // Which is added to dayjs elsewhere
  return _react.default.createElement("article", {
    className: "project-details"
  }, _react.default.createElement(_link.ProjectLink, {
    project: projectDetails
  }, _react.default.createElement(ProjectAvatar, {
    project: projectDetails
  })), _react.default.createElement("table", null, _react.default.createElement("tbody", null, _react.default.createElement("tr", null, _react.default.createElement("td", {
    className: "label"
  }, "Created"), _react.default.createElement("td", null, (0, _dayjs.default)(projectDetails.createdAt).fromNow())), _react.default.createElement("tr", null, _react.default.createElement("td", {
    className: "label"
  }, "Last viewed"), _react.default.createElement("td", null, (0, _dayjs.default)(projectDetails.lastAccess).fromNow())), _react.default.createElement("tr", null, _react.default.createElement("td", {
    className: "label"
  }, "Last edited"), _react.default.createElement("td", null, (0, _dayjs.default)(projectDetails.lastEditedAt).fromNow())), _react.default.createElement("tr", null, _react.default.createElement("td", {
    className: "label"
  }, "Last remixed"), _react.default.createElement("td", null, projectDetails.lastRemixedAt ? (0, _dayjs.default)(projectDetails.lastRemixedAt).fromNow() : "never")), _react.default.createElement("tr", null, _react.default.createElement("td", {
    className: "label"
  }, "Total app views"), _react.default.createElement("td", null, projectDetails.numAppVisits)), _react.default.createElement("tr", null, _react.default.createElement("td", {
    className: "label"
  }, "Total code views"), _react.default.createElement("td", null, projectDetails.numEditorVisits)), _react.default.createElement("tr", null, _react.default.createElement("td", {
    className: "label"
  }, "Total direct remixes"), _react.default.createElement("td", null, projectDetails.numDirectRemixes)), _react.default.createElement("tr", null, _react.default.createElement("td", {
    className: "label"
  }, "Total remixes"), _react.default.createElement("td", null, projectDetails.numTotalRemixes)), projectDetails.baseProject.domain && _react.default.createElement("tr", null, _react.default.createElement("td", {
    className: "label"
  }, "Originally remixed from"), _react.default.createElement("td", null, _react.default.createElement(_link.ProjectLink, {
    project: projectDetails.baseProject
  }, _react.default.createElement(ProjectAvatar, {
    project: projectDetails.baseProject,
    className: "baseproject-avatar"
  }), projectDetails.baseProject.domain))))));
};

const ProjectRemixItem = function ProjectRemixItem({
  remix
}) {
  return _react.default.createElement(_link.ProjectLink, {
    project: remix
  }, _react.default.createElement("span", {
    "data-tooltip": remix.domain,
    "data-tooltip-left": "true"
  }, _react.default.createElement(ProjectAvatar, {
    project: remix
  })));
};

class TeamAnalyticsProjectDetails extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGettingData: true,
      projectDetails: {},
      projectRemixes: []
    };
  }

  updateProjectDetails() {
    var _this = this;

    this.setState({
      isGettingData: true
    });
    getProjectDetails(this.props).then(function ({
      data
    }) {
      _this.setState({
        isGettingData: false,
        projectDetails: data,
        projectRemixes: data.remixes.slice(0, RECENT_REMIXES_COUNT)
      });
    });
  }

  componentDidMount() {
    this.updateProjectDetails();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentProjectDomain !== prevProps.currentProjectDomain) {
      this.updateProjectDetails();
    }
  }

  render() {
    if (this.state.isGettingData) {
      return _react.default.createElement(_loader.default, null);
    }

    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(ProjectDetails, {
      projectDetails: this.state.projectDetails
    }), _react.default.createElement("article", {
      className: "project-remixes"
    }, _react.default.createElement("h4", null, "Latest Remixes"), this.state.projectRemixes.length === 0 && _react.default.createElement("p", null, "No remixes yet (\uFF0F_^)\uFF0F \u25CF"), this.state.projectRemixes.map(function (remix) {
      return _react.default.createElement(ProjectRemixItem, {
        key: remix.id,
        remix: remix
      });
    })));
  }

}

TeamAnalyticsProjectDetails.propTypes = {
  currentProjectDomain: _propTypes.default.string.isRequired,
  id: _propTypes.default.number.isRequired,
  api: _propTypes.default.any.isRequired
};
var _default = TeamAnalyticsProjectDetails;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/team-analytics-referrers.jsx":
/*!**************************************************************!*\
  !*** ./src/presenters/includes/team-analytics-referrers.jsx ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MAX_REFERRERS = 4;

const countTotals = function countTotals(data, countProperty) {
  let total = 0;
  data.forEach(function (referrer) {
    total += referrer[countProperty];
  });
  return total;
};

const ReferrerPlaceholder = function ReferrerPlaceholder({
  count
}) {
  if (count === 0) {
    return 'none';
  }

  return null;
};

const ReferrerItem = function ReferrerItem({
  count,
  total,
  description
}) {
  const progress = Math.max(Math.round(count / total * 100), 3);

  if (count <= 0) {
    return null;
  }

  return _react.default.createElement("li", null, count.toLocaleString('en'), " \u2013 ", description, _react.default.createElement("progress", {
    value: progress,
    max: "100"
  }));
};

ReferrerItem.propTypes = {
  count: _propTypes.default.number.isRequired,
  total: _propTypes.default.number.isRequired,
  description: _propTypes.default.string.isRequired
};

const filterReferrers = function filterReferrers(referrers) {
  let filteredReferrers = referrers.filter(function (referrer) {
    return !referrer.self;
  });
  filteredReferrers = filteredReferrers.slice(0, MAX_REFERRERS);
  return filteredReferrers;
};

class TeamAnalyticsReferrers extends _react.default.PureComponent {
  render() {
    const {
      analytics,
      totalRemixes,
      totalAppViews
    } = this.props;
    const appViewReferrers = filterReferrers(analytics.referrers);
    const remixReferrers = filterReferrers(analytics.remixReferrers);
    const totalDirectAppViews = totalAppViews - countTotals(appViewReferrers, 'requests');
    const totalDirectRemixes = totalRemixes - countTotals(remixReferrers, 'remixes');
    return _react.default.createElement("div", {
      className: "referrers-content"
    }, _react.default.createElement("article", {
      className: "referrers-column app-views"
    }, _react.default.createElement("h4", null, "Total App Views"), _react.default.createElement("ul", null, _react.default.createElement(ReferrerPlaceholder, {
      count: totalAppViews
    }), _react.default.createElement(ReferrerItem, {
      count: totalDirectAppViews,
      total: totalAppViews,
      description: "direct views"
    }), appViewReferrers.map(function (referrer, key) {
      return _react.default.createElement(ReferrerItem, {
        key: key,
        count: referrer.requests,
        total: totalAppViews,
        description: referrer.domain
      });
    }))), _react.default.createElement("article", {
      className: "referrers-column remixes"
    }, _react.default.createElement("h4", null, "Remixes"), _react.default.createElement("ul", null, _react.default.createElement(ReferrerPlaceholder, {
      count: totalRemixes
    }), _react.default.createElement(ReferrerItem, {
      count: totalDirectRemixes,
      total: totalRemixes,
      description: "direct remixes"
    }), remixReferrers.map(function (referrer, key) {
      return _react.default.createElement(ReferrerItem, {
        key: key,
        count: referrer.remixes,
        total: totalRemixes,
        description: referrer.domain
      });
    }))));
  }

}

TeamAnalyticsReferrers.propTypes = {
  analytics: _propTypes.default.object.isRequired,
  totalRemixes: _propTypes.default.number.isRequired,
  totalAppViews: _propTypes.default.number.isRequired
};
var _default = TeamAnalyticsReferrers;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/team-analytics-summary.jsx":
/*!************************************************************!*\
  !*** ./src/presenters/includes/team-analytics-summary.jsx ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactPluralize = _interopRequireDefault(__webpack_require__(/*! react-pluralize */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-pluralize/1.5.0/node_modules/react-pluralize/build/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const clickEvent = new CustomEvent('click', {
  bubbles: true,
  cancelable: true
});
const blurEvent = new CustomEvent('mouseout', {
  bubbles: true,
  cancelable: true
});

class TeamAnalyticsSummary extends _react.default.Component {
  constructor(props) {
    super(props);
  }

  toggleGraph(summaryType) {
    let element = document.querySelector(`.c3-legend-item-${summaryType}`);
    element.dispatchEvent(clickEvent);
    element.dispatchEvent(blurEvent);
  }

  render() {
    var _this = this;

    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("span", {
      className: "summary-item",
      onClick: function onClick() {
        _this.toggleGraph('Total-App-Views');
      },
      onKeyPress: function onKeyPress() {
        _this.toggleGraph('App-Views');
      },
      role: "button",
      tabIndex: 0
    }, _react.default.createElement("span", {
      className: "total app-views"
    }, this.props.totalAppViews.toLocaleString('en')), ' ', _react.default.createElement(_reactPluralize.default, {
      className: "summary-label",
      singular: "Total App View",
      plural: "Total App Views",
      count: this.props.totalAppViews,
      showCount: false
    })), ",", ' ', _react.default.createElement("span", {
      className: "summary-item",
      onClick: function onClick() {
        _this.toggleGraph('Remixes');
      },
      onKeyPress: function onKeyPress() {
        _this.toggleGraph('Remixes');
      },
      role: "button",
      tabIndex: 0
    }, _react.default.createElement("span", {
      className: "total remixes"
    }, this.props.totalRemixes.toLocaleString('en')), ' ', _react.default.createElement(_reactPluralize.default, {
      className: "summary-label",
      singular: "Remix",
      plural: "Remixes",
      count: this.props.totalRemixes,
      showCount: false
    })));
  }

}

TeamAnalyticsSummary.propTypes = {
  totalAppViews: _propTypes.default.number.isRequired,
  totalRemixes: _propTypes.default.number.isRequired
};
var _default = TeamAnalyticsSummary;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/team-analytics.jsx":
/*!****************************************************!*\
  !*** ./src/presenters/includes/team-analytics.jsx ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _cloneDeep2 = _interopRequireDefault(__webpack_require__(/*! lodash/cloneDeep */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/cloneDeep.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _dayjs = _interopRequireDefault(__webpack_require__(/*! dayjs */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/dayjs/1.8.0/node_modules/dayjs/dayjs.min.js"));

var _sampleAnalytics = _interopRequireWildcard(__webpack_require__(/*! ../../curated/sample-analytics */ "./src/curated/sample-analytics.js"));

var _loader = _interopRequireDefault(__webpack_require__(/*! ./loader.jsx */ "./src/presenters/includes/loader.jsx"));

var _teamAnalyticsTimePop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/team-analytics-time-pop.jsx */ "./src/presenters/pop-overs/team-analytics-time-pop.jsx"));

var _teamAnalyticsProjectPop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/team-analytics-project-pop.jsx */ "./src/presenters/pop-overs/team-analytics-project-pop.jsx"));

var _teamAnalyticsSummary = _interopRequireDefault(__webpack_require__(/*! ../includes/team-analytics-summary.jsx */ "./src/presenters/includes/team-analytics-summary.jsx"));

var _teamAnalyticsActivity = _interopRequireDefault(__webpack_require__(/*! ../includes/team-analytics-activity.jsx */ "./src/presenters/includes/team-analytics-activity.jsx"));

var _teamAnalyticsReferrers = _interopRequireDefault(__webpack_require__(/*! ../includes/team-analytics-referrers.jsx */ "./src/presenters/includes/team-analytics-referrers.jsx"));

var _teamAnalyticsProjectDetails = _interopRequireDefault(__webpack_require__(/*! ../includes/team-analytics-project-details.jsx */ "./src/presenters/includes/team-analytics-project-details.jsx"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dateFromTime = function dateFromTime(newTime) {
  const timeMap = {
    "Last 4 Weeks": (0, _dayjs.default)().subtract(4, 'weeks').valueOf(),
    "Last 2 Weeks": (0, _dayjs.default)().subtract(2, 'weeks').valueOf(),
    "Last 24 Hours": (0, _dayjs.default)().subtract(24, 'hours').valueOf()
  };
  return timeMap[newTime];
};

const getAnalytics = async function getAnalytics({
  id,
  api,
  projects
}, fromDate, currentProjectDomain) {
  if (!projects.length) {
    const data = (0, _cloneDeep2.default)(_sampleAnalytics.default); // Update timestamps so they're relative to now

    data.buckets.forEach(function (bucket) {
      bucket['@timestamp'] += Date.now() - _sampleAnalytics.sampleAnalyticsTime;
    });
    return data;
  }

  let path = `analytics/${id}/team?from=${fromDate}`;

  if (currentProjectDomain) {
    path = `analytics/${id}/project/${currentProjectDomain}?from=${fromDate}`;
  }

  try {
    const {
      data
    } = await api.get(path);
    return data;
  } catch (error) {
    console.error('getAnalytics', error);
  }
};

class TeamAnalytics extends _react.default.Component {
  constructor(props) {
    super(props);
    const currentTimeFrame = 'Last 2 Weeks';
    this.state = {
      currentTimeFrame,
      fromDate: dateFromTime(currentTimeFrame),
      currentProjectDomain: '',
      // empty string means all projects
      analytics: {},
      c3: {},
      isGettingData: true,
      isGettingC3: true,
      totalRemixes: 0,
      totalAppViews: 0
    };
  }

  updateTotals() {
    let totalAppViews = 0;
    let totalRemixes = 0;
    this.state.analytics.buckets.forEach(function (bucket) {
      totalAppViews += bucket.analytics.visits;
      totalRemixes += bucket.analytics.remixes;
    });
    this.setState({
      totalAppViews: totalAppViews,
      totalRemixes: totalRemixes
    });
  }

  updateAnalytics() {
    var _this = this;

    this.setState({
      isGettingData: true
    });
    getAnalytics(this.props, this.state.fromDate, this.state.currentProjectDomain).then(function (data) {
      _this.setState({
        isGettingData: false,
        analytics: data
      }, function () {
        _this.updateTotals();
      });
    });
  }

  updateTimeFrame(newTime) {
    var _this2 = this;

    this.setState({
      currentTimeFrame: newTime,
      fromDate: dateFromTime(newTime)
    }, function () {
      _this2.updateAnalytics();
    });
  }

  updateProjectDomain(newDomain) {
    var _this3 = this;

    this.setState({
      currentProjectDomain: newDomain
    }, function () {
      _this3.updateAnalytics();
    });
  }

  componentDidMount() {
    var _this4 = this;

    // eslint-disable-next-line
    __webpack_require__.e(/*! import() | c3-bundle */ "c3-bundle").then(__webpack_require__.t.bind(null, /*! c3 */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/c3/0.6.12/node_modules/c3/c3.js", 7)).then(function (c3) {
      _this4.setState({
        c3: c3,
        isGettingC3: false
      });

      if (_this4.props.currentUserIsOnTeam) {
        _this4.updateAnalytics();
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentUserIsOnTeam === false && this.props.currentUserIsOnTeam === true && this.state.isGettingC3 === false) {
      this.updateAnalytics();
    } else if (prevProps.projects.length !== this.props.projects.length && this.state.isGettingC3 === false) {
      this.updateAnalytics();
      this.setState({
        currentProjectDomain: ''
      });
    }
  }

  render() {
    if (!this.props.currentUserIsOnTeam) {
      return null;
    }

    return _react.default.createElement("section", {
      className: "team-analytics"
    }, _react.default.createElement("h2", null, "Analytics", this.props.projects.length === 0 && !this.state.isGettingData && _react.default.createElement("aside", {
      className: "inline-banners team-page"
    }, "Add projects to see their stats")), !!this.props.projects.length && _react.default.createElement("section", {
      className: "controls"
    }, _react.default.createElement(_teamAnalyticsProjectPop.default, {
      updateProjectDomain: this.updateProjectDomain.bind(this),
      currentProjectDomain: this.state.currentProjectDomain,
      projects: this.props.projects
    }), _react.default.createElement(_teamAnalyticsTimePop.default, {
      updateTimeFrame: this.updateTimeFrame.bind(this),
      currentTimeFrame: this.state.currentTimeFrame
    })), _react.default.createElement("section", {
      className: "summary"
    }, this.state.isGettingData ? _react.default.createElement(_loader.default, null) : _react.default.createElement(_teamAnalyticsSummary.default, {
      totalAppViews: this.state.totalAppViews,
      totalRemixes: this.state.totalRemixes
    })), _react.default.createElement("section", {
      className: "activity"
    }, _react.default.createElement("figure", {
      id: "chart",
      className: "c3"
    }), (this.state.isGettingData || this.state.isGettingC3) && _react.default.createElement(_loader.default, null), !this.state.isGettingC3 && _react.default.createElement(_teamAnalyticsActivity.default, {
      c3: this.state.c3,
      analytics: this.state.analytics,
      isGettingData: this.state.isGettingData,
      currentTimeFrame: this.state.currentTimeFrame
    })), _react.default.createElement("section", {
      className: "referrers"
    }, _react.default.createElement("h3", null, "Referrers"), this.state.isGettingData && _react.default.createElement(_loader.default, null) || _react.default.createElement(_teamAnalyticsReferrers.default, {
      analytics: this.state.analytics,
      totalRemixes: this.state.totalRemixes,
      totalAppViews: this.state.totalAppViews
    })), this.state.currentProjectDomain && _react.default.createElement("section", {
      className: "project-details"
    }, _react.default.createElement("h3", null, "Project Details"), _react.default.createElement(_teamAnalyticsProjectDetails.default, {
      currentProjectDomain: this.state.currentProjectDomain,
      id: this.props.id,
      api: this.props.api
    })), _react.default.createElement("section", {
      className: "explanation"
    }, _react.default.createElement("p", null, "Because Glitch doesn't inject code or cookies into your projects we don't collect the data required for unique app views. You can get uniques by adding Google Analytics to your project.")), !this.props.projects.length && _react.default.createElement("div", {
      className: "placeholder-mask"
    }));
  }

}

TeamAnalytics.propTypes = {
  id: _propTypes.default.number,
  api: _propTypes.default.any.isRequired,
  projects: _propTypes.default.array.isRequired,
  currentUserIsOnTeam: _propTypes.default.bool.isRequired,
  addProject: _propTypes.default.func.isRequired,
  myProjects: _propTypes.default.array.isRequired
};
var _default = TeamAnalytics;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/team-elements.jsx":
/*!***************************************************!*\
  !*** ./src/presenters/includes/team-elements.jsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.AdminOnlyBadge = exports.WhitelistedDomainIcon = exports.VerifiedBadge = exports.TeamMarketing = void 0;

var _debounce2 = _interopRequireDefault(__webpack_require__(/*! lodash/debounce */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/debounce.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _link = _interopRequireDefault(__webpack_require__(/*! ./link.jsx */ "./src/presenters/includes/link.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TeamMarketing = function TeamMarketing() {
  const forPlatformsIcon = 'https://cdn.glitch.com/be1ad2d2-68ab-404a-82f4-6d8e98d28d93%2Ffor-platforms-icon.svg?1506442305188';
  return _react.default.createElement("section", {
    className: "team-marketing"
  }, _react.default.createElement("p", null, _react.default.createElement("img", {
    className: "for-platforms-icon",
    src: forPlatformsIcon,
    alt: "fishing emoji"
  }), "Want your own team page, complete with detailed app analytics?"), _react.default.createElement(_link.default, {
    to: "/teams",
    className: "button button-link has-emoji"
  }, "About Teams ", _react.default.createElement("span", {
    className: "emoji fishing_pole",
    role: "img",
    "aria-label": "emoji"
  })));
};

exports.TeamMarketing = TeamMarketing;

const VerifiedBadge = function VerifiedBadge() {
  const image = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fverified.svg?1501783108220';
  const tooltip = 'Verified to be supportive, helpful people';
  return _react.default.createElement("span", {
    "data-tooltip": tooltip
  }, _react.default.createElement("img", {
    className: "verified",
    src: image,
    alt: "\u2713"
  }));
};

exports.VerifiedBadge = VerifiedBadge;

class WhitelistedDomainIcon extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null
    };
  }

  load() {
    this.setState({
      src: 'https://favicon-fetcher.glitch.me/img/' + this.props.domain
    });
  }

  componentDidMount() {
    this.load();
    this.load = (0, _debounce2.default)(this.load.bind(this), 250);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.domain !== this.props.domain) {
      this.setState({
        src: null
      });
      this.load();
    }
  }

  componentWillUnmount() {
    this.load.cancel();
  }

  render() {
    var _this = this;

    const {
      domain
    } = this.props;

    if (this.state.src) {
      return _react.default.createElement("img", {
        className: "whitelisted-domain",
        alt: domain,
        src: this.state.src,
        onError: function onError() {
          return _this.setState({
            src: null
          });
        }
      });
    }

    return _react.default.createElement("div", {
      className: "whitelisted-domain",
      "aria-label": domain
    }, domain[0].toUpperCase());
  }

} //temp


exports.WhitelistedDomainIcon = WhitelistedDomainIcon;

const AdminOnlyBadge = function AdminOnlyBadge(_ref) {
  let props = Object.assign({}, _ref);
  return _react.default.createElement(_react.default.Fragment, null, props.currentUserIsTeamAdmin === false && _react.default.createElement("div", {
    className: "status-badge"
  }, _react.default.createElement("span", {
    className: "status admin"
  }, "Admin")));
};

exports.AdminOnlyBadge = AdminOnlyBadge;
AdminOnlyBadge.propTypes = {
  currentUserIsTeamAdmin: _propTypes.default.bool.isRequired
};

/***/ }),

/***/ "./src/presenters/includes/team-users.jsx":
/*!************************************************!*\
  !*** ./src/presenters/includes/team-users.jsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.JoinTeam = exports.AddTeamUser = exports.WhitelistedDomain = exports.TeamUsers = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _user = __webpack_require__(/*! ../../models/user */ "./src/models/user.js");

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _teamElements = __webpack_require__(/*! ./team-elements.jsx */ "./src/presenters/includes/team-elements.jsx");

var _avatar = __webpack_require__(/*! ../includes/avatar.jsx */ "./src/presenters/includes/avatar.jsx");

var _addTeamUserPop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/add-team-user-pop.jsx */ "./src/presenters/pop-overs/add-team-user-pop.jsx"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/popover-with-button.jsx */ "./src/presenters/pop-overs/popover-with-button.jsx"));

var _popoverContainer = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/popover-container.jsx */ "./src/presenters/pop-overs/popover-container.jsx"));

var _teamUserInfoPop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/team-user-info-pop.jsx */ "./src/presenters/pop-overs/team-user-info-pop.jsx"));

var _usersList = _interopRequireDefault(__webpack_require__(/*! ../users-list.jsx */ "./src/presenters/users-list.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Team Users list (in profile container)
const TeamUsers = function TeamUsers(props) {
  return _react.default.createElement("ul", {
    className: "users"
  }, props.users.map(function (user) {
    return _react.default.createElement("li", {
      key: user.id
    }, _react.default.createElement(_popoverWithButton.default, {
      buttonClass: "user button-unstyled",
      buttonText: _react.default.createElement(_avatar.UserAvatar, {
        user: user,
        suffix: adminStatusDisplay(props.adminIds, user)
      }),
      passToggleToPop: true
    }, _react.default.createElement(_teamUserInfoPop.default, _extends({
      userIsTeamAdmin: props.adminIds.includes(user.id),
      userIsTheOnlyMember: props.users.length === 1,
      user: user
    }, props))));
  }));
};

exports.TeamUsers = TeamUsers;

const adminStatusDisplay = function adminStatusDisplay(adminIds, user) {
  if (adminIds.includes(user.id)) {
    return " (admin)";
  }

  return "";
};

TeamUsers.propTypes = {
  users: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.number.isRequired
  })).isRequired,
  currentUserIsOnTeam: _propTypes.default.bool.isRequired,
  removeUserFromTeam: _propTypes.default.func.isRequired,
  updateUserPermissions: _propTypes.default.func.isRequired,
  api: _propTypes.default.func.isRequired,
  teamId: _propTypes.default.number.isRequired,
  currentUserIsTeamAdmin: _propTypes.default.bool.isRequired,
  adminIds: _propTypes.default.array.isRequired,
  team: _propTypes.default.object.isRequired
}; // Whitelisted domain icon

const WhitelistedDomain = function WhitelistedDomain({
  domain,
  setDomain
}) {
  const tooltip = `Anyone with an @${domain} email can join`;
  return _react.default.createElement(_popoverContainer.default, null, function ({
    visible,
    setVisible
  }) {
    return _react.default.createElement("details", {
      onToggle: function onToggle(evt) {
        return setVisible(evt.target.open);
      },
      open: visible,
      className: "popover-container whitelisted-domain-container"
    }, _react.default.createElement("summary", {
      "data-tooltip": !visible ? tooltip : null
    }, _react.default.createElement(_teamElements.WhitelistedDomainIcon, {
      domain: domain
    })), _react.default.createElement("dialog", {
      className: "pop-over"
    }, _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("p", {
      className: "info-description"
    }, tooltip)), !!setDomain && _react.default.createElement("section", {
      className: "pop-over-actions danger-zone"
    }, _react.default.createElement("button", {
      className: "button button-small button-tertiary button-on-secondary-background has-emoji",
      onClick: function onClick() {
        return setDomain(null);
      }
    }, "Remove ", domain, " ", _react.default.createElement("span", {
      className: "emoji bomb"
    })))));
  });
};

exports.WhitelistedDomain = WhitelistedDomain;
WhitelistedDomain.propTypes = {
  domain: _propTypes.default.string.isRequired,
  setDomain: _propTypes.default.func
}; // Add Team User

class AddTeamUser extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      invitee: '',
      alreadyInvited: []
    };
    this.removeNotifyInvited = this.removeNotifyInvited.bind(this);
  }

  async setWhitelistedDomain(togglePopover, domain) {
    togglePopover();
    await this.props.setWhitelistedDomain(domain);
  }

  async inviteUser(togglePopover, user) {
    togglePopover();
    this.setState(function (state) {
      return {
        invitee: (0, _user.getDisplayName)(user),
        alreadyInvited: [...state.alreadyInvited, user]
      };
    });
    await this.props.inviteUser(user);
  }

  async inviteEmail(togglePopover, email) {
    togglePopover();
    this.setState({
      invitee: email
    });
    await this.props.inviteEmail(email);
  }

  removeNotifyInvited() {
    this.setState({
      invitee: ''
    });
  }

  render() {
    var _this = this;

    const _this$props = this.props,
          {
      inviteEmail,
      inviteUser,
      setWhitelistedDomain
    } = _this$props,
          props = _objectWithoutPropertiesLoose(_this$props, ["inviteEmail", "inviteUser", "setWhitelistedDomain"]);

    return _react.default.createElement(_popoverContainer.default, null, function ({
      visible,
      togglePopover
    }) {
      return _react.default.createElement("span", {
        className: "add-user-container"
      }, !!_this.state.alreadyInvited.length && _react.default.createElement(_usersList.default, {
        users: _this.state.alreadyInvited
      }), _react.default.createElement(_analytics.TrackClick, {
        name: "Add to Team clicked"
      }, _react.default.createElement("button", {
        onClick: togglePopover,
        className: "button button-small button-tertiary add-user"
      }, "Add")), !!_this.state.invitee && _react.default.createElement("div", {
        className: "notification notifySuccess inline-notification",
        onAnimationEnd: _this.removeNotifyInvited
      }, "Invited ", _this.state.invitee), visible && _react.default.createElement(_addTeamUserPop.default, _extends({}, props, {
        setWhitelistedDomain: setWhitelistedDomain ? function (domain) {
          return _this.setWhitelistedDomain(togglePopover, domain);
        } : null,
        inviteUser: inviteUser ? function (user) {
          return _this.inviteUser(togglePopover, user);
        } : null,
        inviteEmail: inviteEmail ? function (email) {
          return _this.inviteEmail(togglePopover, email);
        } : null
      })));
    });
  }

}

exports.AddTeamUser = AddTeamUser;
AddTeamUser.propTypes = {
  inviteEmail: _propTypes.default.func,
  inviteUser: _propTypes.default.func,
  setWhitelistedDomain: _propTypes.default.func
}; // Join Team

const JoinTeam = function JoinTeam({
  onClick
}) {
  return _react.default.createElement("button", {
    className: "button button-small button-cta join-team-button",
    onClick: onClick
  }, "Join Team");
};

exports.JoinTeam = JoinTeam;

/***/ }),

/***/ "./src/presenters/includes/thanks.jsx":
/*!********************************************!*\
  !*** ./src/presenters/includes/thanks.jsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.ThanksShort = exports.Thanks = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ThanksText = function ThanksText({
  count
}) {
  if (count === 1) {
    return "Thanked once";
  } else if (count === 2) {
    return "Thanked twice";
  }

  return `Thanked ${count} times`;
};

ThanksText.propTypes = {
  count: _propTypes.default.number.isRequired
};

const Thanks = function Thanks({
  count
}) {
  return count > 0 ? _react.default.createElement("p", {
    className: "thanks"
  }, _react.default.createElement(ThanksText, {
    count: count
  }), "\xA0", _react.default.createElement("span", {
    className: "emoji sparkling_heart"
  })) : null;
};

exports.Thanks = Thanks;
Thanks.propTypes = {
  count: _propTypes.default.number.isRequired
};

const ThanksShort = function ThanksShort({
  count
}) {
  return _react.default.createElement("p", {
    className: "thanks"
  }, _react.default.createElement("span", {
    className: "emoji sparkling_heart"
  }), "\xA0", count);
};

exports.ThanksShort = ThanksShort;
ThanksShort.propTypes = {
  count: _propTypes.default.number.isRequired
};
var _default = Thanks;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/uploader.jsx":
/*!**********************************************!*\
  !*** ./src/presenters/includes/uploader.jsx ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _assets = __webpack_require__(/*! ../../utils/assets */ "./src/utils/assets.js");

var _notifications = _interopRequireDefault(__webpack_require__(/*! ../notifications.jsx */ "./src/presenters/notifications.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NotifyUploading = function NotifyUploading({
  progress
}) {
  return _react.default.createElement(_react.default.Fragment, null, "Uploading asset", _react.default.createElement("progress", {
    className: "notify-progress",
    value: progress
  }));
};

const NotifyError = function NotifyError() {
  return 'File upload failed. Try again in a few minutes?';
};

async function uploadWrapper(notifications, upload) {
  let result = null;
  let progress = 0;
  const {
    updateNotification,
    removeNotification
  } = notifications.createPersistentNotification(_react.default.createElement(NotifyUploading, {
    progress: progress
  }), 'notifyUploading');

  try {
    result = await upload(function ({
      lengthComputable,
      loaded,
      total
    }) {
      if (lengthComputable) {
        progress = loaded / total;
      } else {
        progress = (progress + 1) / 2;
      }

      updateNotification(_react.default.createElement(NotifyUploading, {
        progress: progress
      }));
    });
  } catch (e) {
    notifications.createErrorNotification(_react.default.createElement(NotifyError, null));
    throw e;
  } finally {
    removeNotification();
    notifications.createNotification('Image uploaded!');
  }

  return result;
}

const Uploader = function Uploader({
  children
}) {
  return _react.default.createElement(_notifications.default, null, function (notifications) {
    return children({
      uploadAsset: function uploadAsset(blob, policy, key) {
        return uploadWrapper(notifications, function (cb) {
          return (0, _assets.uploadAsset)(blob, policy, key, cb);
        });
      },
      uploadAssetSizes: function uploadAssetSizes(blob, policy, sizes) {
        return uploadWrapper(notifications, function (cb) {
          return (0, _assets.uploadAssetSizes)(blob, policy, sizes, cb);
        });
      }
    });
  });
};

Uploader.propTypes = {
  children: _propTypes.default.func.isRequired
};
var _default = Uploader;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/user-prefs.jsx":
/*!************************************************!*\
  !*** ./src/presenters/includes/user-prefs.jsx ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.UserPref = exports.UserPrefsProvider = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _localStorage = _interopRequireDefault(__webpack_require__(/*! ./local-storage.jsx */ "./src/presenters/includes/local-storage.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const {
  Provider,
  Consumer
} = _react.default.createContext();

const UserPrefsProvider = function UserPrefsProvider({
  children
}) {
  return _react.default.createElement(_localStorage.default, {
    name: "community-userPrefs",
    default: {}
  }, function (prefs, set) {
    return _react.default.createElement(Provider, {
      value: {
        prefs,
        set
      }
    }, children);
  });
};

exports.UserPrefsProvider = UserPrefsProvider;
UserPrefsProvider.propTypes = {
  children: _propTypes.default.node.isRequired
};

const UserPref = function UserPref(_ref) {
  let {
    children,
    name
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["children", "name"]);

  return _react.default.createElement(Consumer, null, function ({
    prefs,
    set
  }) {
    return children(prefs[name] !== undefined ? prefs[name] : props.default, function (value) {
      return set(Object.assign({}, prefs, {
        [name]: value
      }));
    });
  });
};

exports.UserPref = UserPref;
UserPref.propTypes = {
  children: _propTypes.default.func.isRequired,
  name: _propTypes.default.string.isRequired,
  default: _propTypes.default.any.isRequired
};
var _default = UserPref;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/includes/user-result-item.jsx":
/*!******************************************************!*\
  !*** ./src/presenters/includes/user-result-item.jsx ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.WhitelistEmailDomain = exports.InviteByEmail = exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _randomcolor = _interopRequireDefault(__webpack_require__(/*! randomcolor */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/randomcolor/0.5.3/node_modules/randomcolor/randomColor.js"));

var _user = __webpack_require__(/*! ../../models/user */ "./src/models/user.js");

var _thanks = __webpack_require__(/*! ./thanks.jsx */ "./src/presenters/includes/thanks.jsx");

var _teamElements = __webpack_require__(/*! ./team-elements.jsx */ "./src/presenters/includes/team-elements.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserResultItem = function UserResultItem({
  user,
  action
}) {
  const name = (0, _user.getDisplayName)(user);
  const {
    login,
    thanksCount
  } = user;

  const handleClick = function handleClick(event) {
    action(event);
  };

  return _react.default.createElement("button", {
    onClick: handleClick,
    className: "button-unstyled result result-user"
  }, _react.default.createElement("img", {
    className: "avatar",
    src: (0, _user.getAvatarThumbnailUrl)(user),
    alt: ""
  }), _react.default.createElement("div", {
    className: "result-info"
  }, _react.default.createElement("div", {
    className: "result-name",
    title: name
  }, name), !!user.name && _react.default.createElement("div", {
    className: "result-description"
  }, "@", login), thanksCount > 0 && _react.default.createElement(_thanks.ThanksShort, {
    count: thanksCount
  })));
};

UserResultItem.propTypes = {
  user: _propTypes.default.shape({
    avatarThumbnailUrl: _propTypes.default.string,
    name: _propTypes.default.string,
    login: _propTypes.default.string.isRequired,
    thanksCount: _propTypes.default.number.isRequired
  }).isRequired,
  action: _propTypes.default.func.isRequired
};
var _default = UserResultItem;
exports.default = _default;

class InviteByEmail extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: (0, _randomcolor.default)({
        luminosity: 'light'
      })
    };
  }

  render() {
    const style = {
      backgroundColor: this.state.color
    };
    return _react.default.createElement("button", {
      onClick: this.props.onClick,
      className: "button-unstyled result"
    }, _react.default.createElement("img", {
      className: "avatar",
      src: _user.ANON_AVATAR_URL,
      style: style,
      alt: ""
    }), _react.default.createElement("div", {
      className: "result-name"
    }, "Invite ", this.props.email));
  }

}

exports.InviteByEmail = InviteByEmail;
InviteByEmail.propTypes = {
  email: _propTypes.default.string.isRequired,
  onClick: _propTypes.default.func.isRequired
};

const WhitelistEmailDomain = function WhitelistEmailDomain({
  domain,
  prevDomain,
  onClick
}) {
  return _react.default.createElement("button", {
    onClick: onClick,
    className: "button-unstyled result"
  }, _react.default.createElement(_teamElements.WhitelistedDomainIcon, {
    domain: domain
  }), _react.default.createElement("div", {
    className: "result-name"
  }, "Allow anyone with an @", domain, " email to join"), !!prevDomain && _react.default.createElement("div", {
    className: "result-description"
  }, "This will replace @", prevDomain));
};

exports.WhitelistEmailDomain = WhitelistEmailDomain;
WhitelistEmailDomain.propTypes = {
  domain: _propTypes.default.string.isRequired,
  prevDomain: _propTypes.default.string,
  onClick: _propTypes.default.func.isRequired
};

/***/ }),

/***/ "./src/presenters/includes/wrapping-link.jsx":
/*!***************************************************!*\
  !*** ./src/presenters/includes/wrapping-link.jsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// react tells me that nested <a> tags are bad and I shouldn't do that
// so we will replace the outer tags with a special on click <div> tag
// which will act like a link (or as close as I can get via nice code)
const WrappingLink = (0, _reactRouterDom.withRouter)(function ({
  href,
  children,
  className,
  style,
  history
}) {
  const handler = function handler(evt) {
    // Real links and interactive elements take priority
    if (evt.target.closest('a[href], button, input')) return; // Make sure there wasn't a clicky div inside this clicky div

    if (evt.target.closest('[data-href]') !== evt.currentTarget) return; // Ok, this click is real. Do the thing

    history.push(href);
  };

  return _react.default.createElement("div", {
    "data-href": true,
    onClick: handler,
    className: className,
    style: style,
    role: "presentation"
  }, children);
});
WrappingLink.propTypes = {
  href: _propTypes.default.string.isRequired,
  children: _propTypes.default.element.isRequired,
  className: _propTypes.default.string,
  style: _propTypes.default.object
};
var _default = WrappingLink;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/layout.jsx":
/*!***********************************!*\
  !*** ./src/presenters/layout.jsx ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _reactHelmet = _interopRequireDefault(__webpack_require__(/*! react-helmet */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-helmet/5.2.0/node_modules/react-helmet/lib/Helmet.js"));

var _header = _interopRequireDefault(__webpack_require__(/*! ./header.jsx */ "./src/presenters/header.jsx"));

var _footer = _interopRequireDefault(__webpack_require__(/*! ./footer.jsx */ "./src/presenters/footer.jsx"));

var _errorBoundary = _interopRequireDefault(__webpack_require__(/*! ./includes/error-boundary.jsx */ "./src/presenters/includes/error-boundary.jsx"));

var _konami = _interopRequireDefault(__webpack_require__(/*! ./includes/konami.jsx */ "./src/presenters/includes/konami.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Layout = function Layout({
  children,
  api,
  searchQuery
}) {
  return _react.default.createElement("div", {
    className: "content"
  }, _react.default.createElement(_reactHelmet.default, null, _react.default.createElement("title", null, "Glitch")), _react.default.createElement(_header.default, {
    api: api,
    searchQuery: searchQuery
  }), _react.default.createElement(_errorBoundary.default, null, children), _react.default.createElement(_footer.default, null), _react.default.createElement(_errorBoundary.default, {
    fallback: null
  }, _react.default.createElement(_konami.default, null, _react.default.createElement(_reactRouterDom.Redirect, {
    to: "/secret",
    push: true
  }))));
};

Layout.propTypes = {
  api: _propTypes.default.any.isRequired,
  children: _propTypes.default.node.isRequired,
  searchQuery: _propTypes.default.string
};
var _default = Layout;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/notifications.jsx":
/*!******************************************!*\
  !*** ./src/presenters/notifications.jsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.Notifications = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Provider,
  Consumer
} = _react.default.createContext();

const Notification = function Notification({
  children,
  className,
  remove
}) {
  return _react.default.createElement("aside", {
    className: `notification ${className}`,
    onAnimationEnd: remove
  }, children);
};

class Notifications extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: []
    };
  }

  create(content, className = '') {
    const notification = {
      id: `${Date.now()}{Math.random()}`,
      className,
      content
    };
    this.setState(function ({
      notifications
    }) {
      return {
        notifications: [...notifications, notification]
      };
    });
    return notification.id;
  }

  createError(content = 'Something went wrong. Try refreshing?') {
    this.create(content, 'notifyError');
  }

  createPersistent(content, className = '') {
    var _this = this;

    const id = this.create(content, `notifyPersistent ${className}`);

    const updateNotification = function updateNotification(content) {
      _this.setState(function ({
        notifications
      }) {
        return {
          notifications: notifications.map(function (n) {
            return n.id === id ? Object.assign({}, n, {
              content
            }) : n;
          })
        };
      });
    };

    const removeNotification = function removeNotification() {
      _this.remove(id);
    };

    return {
      updateNotification,
      removeNotification
    };
  }

  remove(id) {
    this.setState(function ({
      notifications
    }) {
      return {
        notifications: notifications.filter(function (n) {
          return n.id !== id;
        })
      };
    });
  }

  render() {
    var _this2 = this;

    const funcs = {
      createNotification: this.create.bind(this),
      createPersistentNotification: this.createPersistent.bind(this),
      createErrorNotification: this.createError.bind(this)
    };
    const {
      notifications
    } = this.state;
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(Provider, {
      value: funcs
    }, this.props.children), !!notifications.length && _react.default.createElement("div", {
      className: "notifications"
    }, notifications.map(function ({
      id,
      className,
      content
    }) {
      return _react.default.createElement(Notification, {
        key: id,
        className: className,
        remove: _this2.remove.bind(_this2, id)
      }, content);
    })));
  }

}

exports.Notifications = Notifications;
var _default = Consumer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/overlays/new-stuff.jsx":
/*!***********************************************!*\
  !*** ./src/presenters/overlays/new-stuff.jsx ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _link = _interopRequireDefault(__webpack_require__(/*! ../includes/link.jsx */ "./src/presenters/includes/link.jsx"));

var _markdown = _interopRequireDefault(__webpack_require__(/*! ../includes/markdown.jsx */ "./src/presenters/includes/markdown.jsx"));

var _popoverContainer = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/popover-container.jsx */ "./src/presenters/pop-overs/popover-container.jsx"));

var _userPrefs = _interopRequireDefault(__webpack_require__(/*! ../includes/user-prefs.jsx */ "./src/presenters/includes/user-prefs.jsx"));

var _newStuffLog = _interopRequireDefault(__webpack_require__(/*! ../../curated/new-stuff-log */ "./src/curated/new-stuff-log.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const latestId = Math.max(..._newStuffLog.default.map(function ({
  id
}) {
  return id;
}));

const NewStuffOverlay = function NewStuffOverlay({
  setShowNewStuff,
  showNewStuff,
  newStuff
}) {
  return _react.default.createElement("dialog", {
    className: "pop-over overlay new-stuff-overlay overlay-narrow",
    open: true
  }, _react.default.createElement("section", {
    className: "pop-over-info"
  }, _react.default.createElement("figure", {
    className: "new-stuff-avatar"
  }), _react.default.createElement("div", {
    className: "overlay-title"
  }, "New Stuff"), _react.default.createElement("div", null, _react.default.createElement("label", {
    className: "button button-small",
    htmlFor: "showNewStuff"
  }, _react.default.createElement("input", {
    id: "showNewStuff",
    className: "button-checkbox",
    type: "checkbox",
    checked: showNewStuff,
    onChange: function onChange(evt) {
      return setShowNewStuff(evt.target.checked);
    }
  }), "Keep showing me these"))), _react.default.createElement("section", {
    className: "pop-over-actions"
  }, newStuff.map(function ({
    id,
    title,
    body,
    link
  }) {
    return _react.default.createElement("article", {
      key: id
    }, _react.default.createElement("div", {
      className: "title"
    }, title), _react.default.createElement("div", {
      className: "body"
    }, _react.default.createElement(_markdown.default, null, body)), !!link && _react.default.createElement("p", null, _react.default.createElement(_link.default, {
      className: "link",
      to: link
    }, "Read the blog post \u2192")));
  })));
};

NewStuffOverlay.propTypes = {
  setShowNewStuff: _propTypes.default.func.isRequired,
  showNewStuff: _propTypes.default.bool.isRequired,
  newStuff: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.number.isRequired,
    title: _propTypes.default.string.isRequired,
    body: _propTypes.default.string.isRequired,
    link: _propTypes.default.string
  }).isRequired).isRequired
};

class NewStuff extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      log: _newStuffLog.default
    };
  }

  showNewStuff(setVisible) {
    var _this = this;

    setVisible(true);

    const unreadStuff = _newStuffLog.default.filter(function ({
      id
    }) {
      return id > _this.props.newStuffReadId;
    });

    this.setState({
      log: unreadStuff.length ? unreadStuff : _newStuffLog.default
    });
    this.props.setNewStuffReadId(latestId);
  }

  renderOuter({
    visible,
    setVisible
  }) {
    var _this2 = this;

    const {
      children,
      isSignedIn,
      showNewStuff,
      newStuffReadId
    } = this.props;
    const dogVisible = isSignedIn && showNewStuff && newStuffReadId < latestId;

    const show = function show() {
      if (window.analytics) {
        window.analytics.track("Pupdate");
      }

      _this2.showNewStuff(setVisible);
    };

    return _react.default.createElement(_react.default.Fragment, null, children(show), dogVisible && _react.default.createElement("div", {
      className: "new-stuff-footer"
    }, _react.default.createElement("button", {
      className: "button-unstyled new-stuff opens-pop-over",
      onClick: show
    }, _react.default.createElement("figure", {
      className: "new-stuff-avatar",
      "data-tooltip": "New",
      "data-tooltip-top": "true",
      "data-tooltip-persistent": "true",
      alt: "New Stuff"
    }))), visible && _react.default.createElement("div", {
      className: "overlay-background",
      role: "presentation"
    }));
  }

  render() {
    var _this3 = this;

    return _react.default.createElement(_popoverContainer.default, {
      outer: this.renderOuter.bind(this)
    }, function ({
      visible
    }) {
      return visible ? _react.default.createElement(NewStuffOverlay, _extends({}, _this3.props, {
        newStuff: _this3.state.log
      })) : null;
    });
  }

}

NewStuff.propTypes = {
  children: _propTypes.default.func.isRequired,
  isSignedIn: _propTypes.default.bool.isRequired,
  showNewStuff: _propTypes.default.bool.isRequired,
  newStuffReadId: _propTypes.default.number.isRequired,
  setNewStuffReadId: _propTypes.default.func.isRequired
};

const NewStuffContainer = function NewStuffContainer({
  children,
  isSignedIn
}) {
  return _react.default.createElement(_userPrefs.default, {
    name: "showNewStuff",
    default: true
  }, function (showNewStuff, setShowNewStuff) {
    return _react.default.createElement(_userPrefs.default, {
      name: "newStuffReadId",
      default: 0
    }, function (newStuffReadId, setNewStuffReadId) {
      return _react.default.createElement(NewStuff, {
        isSignedIn,
        showNewStuff,
        newStuffReadId,
        setShowNewStuff,
        setNewStuffReadId
      }, children);
    });
  });
};

NewStuffContainer.propTypes = {
  children: _propTypes.default.func.isRequired,
  isSignedIn: _propTypes.default.bool.isRequired
};
var _default = NewStuffContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/overlays/overlay-video.jsx":
/*!***************************************************!*\
  !*** ./src/presenters/overlays/overlay-video.jsx ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _popoverContainer = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/popover-container.jsx */ "./src/presenters/pop-overs/popover-container.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Video = function Video() {
  return _react.default.createElement("div", {
    className: "wistia_responsive_padding"
  }, _react.default.createElement("div", {
    className: "wistia_responsive_wrapper"
  }, _react.default.createElement("div", {
    className: "wistia_embed wistia_async_i0m98yntdb",
    videofoam: "true"
  })));
};

const OverlayVideo = function OverlayVideo({
  children
}) {
  return _react.default.createElement(_popoverContainer.default, null, function ({
    visible,
    setVisible
  }) {
    return _react.default.createElement("details", {
      onToggle: function onToggle(evt) {
        return setVisible(evt.target.open);
      },
      open: visible,
      className: "overlay-container"
    }, _react.default.createElement("summary", null, children), _react.default.createElement("dialog", {
      className: "overlay video-overlay"
    }, _react.default.createElement("section", {
      className: "pop-over-actions"
    }, _react.default.createElement(Video, null))));
  });
};

OverlayVideo.propTypes = {
  children: _propTypes.default.node.isRequired
};
var _default = OverlayVideo;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pages/category.jsx":
/*!*******************************************!*\
  !*** ./src/presenters/pages/category.jsx ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactHelmet = _interopRequireDefault(__webpack_require__(/*! react-helmet */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-helmet/5.2.0/node_modules/react-helmet/lib/Helmet.js"));

var _layout = _interopRequireDefault(__webpack_require__(/*! ../layout.jsx */ "./src/presenters/layout.jsx"));

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _loader = __webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx");

var _projectsList = __webpack_require__(/*! ../projects-list.jsx */ "./src/presenters/projects-list.jsx");

var _projectsLoader = _interopRequireDefault(__webpack_require__(/*! ../projects-loader.jsx */ "./src/presenters/projects-loader.jsx"));

var _categories = _interopRequireDefault(__webpack_require__(/*! ../categories.jsx */ "./src/presenters/categories.jsx"));

var _collectionEditor = _interopRequireDefault(__webpack_require__(/*! ../collection-editor.jsx */ "./src/presenters/collection-editor.jsx"));

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const CategoryPageWrap = function CategoryPageWrap(_ref) {
  let {
    addProjectToCollection,
    api,
    category,
    currentUser
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["addProjectToCollection", "api", "category", "currentUser"]);

  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_reactHelmet.default, null, _react.default.createElement("title", null, category.name)), _react.default.createElement("main", {
    className: "collection-page"
  }, _react.default.createElement("article", {
    className: "projects",
    style: {
      backgroundColor: category.backgroundColor
    }
  }, _react.default.createElement("header", {
    className: "collection"
  }, _react.default.createElement("h1", {
    className: "collection-name"
  }, category.name), _react.default.createElement("div", {
    className: "collection-image-container"
  }, _react.default.createElement("img", {
    src: category.avatarUrl,
    alt: ""
  })), _react.default.createElement("p", {
    className: "description"
  }, category.description)), _react.default.createElement(_projectsLoader.default, {
    api: api,
    projects: category.projects
  }, function (projects) {
    return _react.default.createElement("div", {
      className: "collection-contents"
    }, _react.default.createElement("div", {
      className: "collection-project-container-header"
    }, _react.default.createElement("h3", null, "Projects (", category.projects.length, ")")), currentUser.login ? _react.default.createElement(_projectsList.ProjectsUL, _extends({
      projects,
      currentUser,
      api,
      addProjectToCollection
    }, {
      category: true,
      projectOptions: {
        addProjectToCollection
      }
    }, props)) : _react.default.createElement(_projectsList.ProjectsUL, _extends({
      projects,
      currentUser,
      api,
      addProjectToCollection
    }, {
      category: true,
      projectOptions: {}
    }, props)));
  }))), _react.default.createElement(_categories.default, null));
};

CategoryPageWrap.propTypes = {
  category: _propTypes.default.shape({
    avatarUrl: _propTypes.default.string.isRequired,
    backgroundColor: _propTypes.default.string.isRequired,
    description: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired,
    projects: _propTypes.default.array.isRequired
  }).isRequired,
  api: _propTypes.default.any.isRequired,
  addProjectToCollection: _propTypes.default.func.isRequired
};

async function loadCategory(api, id) {
  const {
    data
  } = await api.get(`categories/${id}`);
  return data;
}

const CategoryPage = function CategoryPage(_ref2) {
  let {
    api,
    category
  } = _ref2,
      props = _objectWithoutPropertiesLoose(_ref2, ["api", "category"]);

  return _react.default.createElement(_layout.default, {
    api: api
  }, _react.default.createElement(_analytics.AnalyticsContext, {
    properties: {
      origin: 'category'
    }
  }, _react.default.createElement(_loader.DataLoader, {
    get: function get() {
      return loadCategory(api, category.id);
    }
  }, function (category) {
    return _react.default.createElement(_collectionEditor.default, {
      api: api,
      initialCollection: category
    }, function (category, funcs) {
      return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
        return _react.default.createElement(CategoryPageWrap, _extends({
          category: category,
          api: api,
          userIsAuthor: false,
          currentUser: currentUser
        }, funcs, props));
      });
    });
  })));
};

CategoryPage.propTypes = {
  api: _propTypes.default.any.isRequired,
  category: _propTypes.default.object.isRequired
};
var _default = CategoryPage;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pages/collection.jsx":
/*!*********************************************!*\
  !*** ./src/presenters/pages/collection.jsx ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _reactHelmet = _interopRequireDefault(__webpack_require__(/*! react-helmet */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-helmet/5.2.0/node_modules/react-helmet/lib/Helmet.js"));

var _layout = _interopRequireDefault(__webpack_require__(/*! ../layout.jsx */ "./src/presenters/layout.jsx"));

var _collection = __webpack_require__(/*! ../../models/collection */ "./src/models/collection.js");

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _loader = __webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx");

var _projectsList = __webpack_require__(/*! ../projects-list.jsx */ "./src/presenters/projects-list.jsx");

var _projectsLoader = _interopRequireDefault(__webpack_require__(/*! ../projects-loader.jsx */ "./src/presenters/projects-loader.jsx"));

var _notFound = _interopRequireDefault(__webpack_require__(/*! ../includes/not-found.jsx */ "./src/presenters/includes/not-found.jsx"));

var _descriptionField = __webpack_require__(/*! ../includes/description-field.jsx */ "./src/presenters/includes/description-field.jsx");

var _collectionEditor = _interopRequireDefault(__webpack_require__(/*! ../collection-editor.jsx */ "./src/presenters/collection-editor.jsx"));

var _editCollectionColor = _interopRequireDefault(__webpack_require__(/*! ../includes/edit-collection-color.jsx */ "./src/presenters/includes/edit-collection-color.jsx"));

var _editCollectionNameAndUrl = _interopRequireDefault(__webpack_require__(/*! ../includes/edit-collection-name-and-url.jsx */ "./src/presenters/includes/edit-collection-name-and-url.jsx"));

var _addCollectionProject = _interopRequireDefault(__webpack_require__(/*! ../includes/add-collection-project.jsx */ "./src/presenters/includes/add-collection-project.jsx"));

var _reportAbusePop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/report-abuse-pop.jsx */ "./src/presenters/pop-overs/report-abuse-pop.jsx"));

var _collectionAvatar = _interopRequireDefault(__webpack_require__(/*! ../includes/collection-avatar.jsx */ "./src/presenters/includes/collection-avatar.jsx"));

var _teamsList = __webpack_require__(/*! ../teams-list */ "./src/presenters/teams-list.jsx");

var _usersList = __webpack_require__(/*! ../users-list */ "./src/presenters/users-list.jsx");

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function syncPageToUrl(collection, url) {
  history.replaceState(null, null, (0, _collection.getLink)(Object.assign({}, collection, {
    url
  })));
}

class DeleteCollectionBtn extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false
    };
  }

  render() {
    var _this = this;

    if (this.state.done) {
      return _react.default.createElement(_reactRouterDom.Redirect, {
        to: (0, _collection.getOwnerLink)(this.props.collection)
      });
    }

    return _react.default.createElement("button", {
      className: `button delete-collection button-tertiary`,
      onClick: function onClick() {
        if (!window.confirm(`Are you sure you want to delete your collection?`)) {
          return;
        }

        _this.props.deleteCollection();

        _this.setState({
          done: true
        });
      }
    }, "Delete Collection");
  }

}

DeleteCollectionBtn.propTypes = {
  collection: _propTypes.default.shape({
    team: _propTypes.default.object,
    user: _propTypes.default.object,
    url: _propTypes.default.string.isRequired
  }).isRequired,
  deleteCollection: _propTypes.default.func.isRequired
};

const CollectionPageContents = function CollectionPageContents(_ref) {
  let {
    api,
    collection,
    currentUser,
    deleteCollection,
    isAuthorized,
    updateNameAndUrl,
    updateDescription,
    addProjectToCollection,
    removeProjectFromCollection,
    updateColor
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["api", "collection", "currentUser", "deleteCollection", "isAuthorized", "updateNameAndUrl", "updateDescription", "addProjectToCollection", "removeProjectFromCollection", "updateColor"]);

  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_reactHelmet.default, null, _react.default.createElement("title", null, collection.name)), _react.default.createElement("main", {
    className: "collection-page"
  }, _react.default.createElement("article", {
    className: "projects",
    style: {
      backgroundColor: collection.coverColor
    }
  }, _react.default.createElement("header", {
    className: "collection " + ((0, _collection.getContrastTextColor)(collection.coverColor) == "white" ? "dark" : "")
  }, _react.default.createElement("div", {
    className: "collection-image-container"
  }, _react.default.createElement(_collectionAvatar.default, {
    backgroundColor: (0, _collection.hexToRgbA)(collection.coverColor)
  })), _react.default.createElement(_editCollectionNameAndUrl.default, {
    isAuthorized: isAuthorized,
    name: collection.name,
    url: collection.url,
    update: function update(data) {
      return updateNameAndUrl(data).then(function () {
        return syncPageToUrl(collection, data.url);
      });
    }
  }), collection.team && _react.default.createElement(_teamsList.TeamTile, {
    team: collection.team
  }), collection.user && _react.default.createElement(_usersList.UserTile, collection.user), _react.default.createElement("div", {
    className: "collection-description"
  }, _react.default.createElement(_descriptionField.AuthDescription, {
    authorized: isAuthorized,
    description: collection.description,
    update: updateDescription,
    placeholder: "Tell us about your collection"
  })), isAuthorized && _react.default.createElement(_editCollectionColor.default, {
    update: updateColor,
    initialColor: collection.coverColor
  })), !!collection && _react.default.createElement(_projectsLoader.default, {
    api: api,
    projects: collection.projects
  }, function (projects) {
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
      className: "collection-contents"
    }, _react.default.createElement("div", {
      className: "collection-project-container-header"
    }, _react.default.createElement("h3", null, "Projects (", collection.projects.length, ")"), !!isAuthorized && _react.default.createElement(_addCollectionProject.default, {
      addProjectToCollection: addProjectToCollection,
      collection: collection,
      api: api,
      currentUserIsOwner: isAuthorized,
      currentUser: currentUser
    })), collection.projects.length > 0 ? isAuthorized ? _react.default.createElement(_projectsList.ProjectsUL, _extends({
      projects,
      currentUser,
      api
    }, {
      projectOptions: {
        removeProjectFromCollection,
        addProjectToCollection
      }
    }, props)) : currentUser && currentUser.login ? _react.default.createElement(_projectsList.ProjectsUL, _extends({
      projects,
      currentUser,
      api
    }, {
      projectOptions: {
        addProjectToCollection
      }
    }, props)) : _react.default.createElement(_projectsList.ProjectsUL, _extends({
      projects,
      currentUser,
      api
    }, {
      projectOptions: {}
    }, props)) : isAuthorized ? _react.default.createElement("div", {
      className: "empty-collection-hint"
    }, _react.default.createElement("img", {
      src: "https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934",
      alt: ""
    }), _react.default.createElement("p", null, "You can add any project, created by any user")) : _react.default.createElement("div", {
      className: "empty-collection-hint"
    }, "No projects to see in this collection just yet.")));
  })), !isAuthorized && _react.default.createElement(_reportAbusePop.default, {
    reportedType: "collection",
    reportedModel: collection
  })), isAuthorized && _react.default.createElement(DeleteCollectionBtn, {
    collection: collection,
    deleteCollection: deleteCollection
  }));
};

CollectionPageContents.propTypes = {
  addProjectToCollection: _propTypes.default.func,
  api: _propTypes.default.any.isRequired,
  collection: _propTypes.default.shape({
    avatarUrl: _propTypes.default.string.isRequired,
    backgroundColor: _propTypes.default.string,
    description: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired,
    projects: _propTypes.default.array.isRequired
  }).isRequired,
  children: _propTypes.default.node,
  currentUser: _propTypes.default.object,
  deleteCollection: _propTypes.default.func.isRequired,
  isAuthorized: _propTypes.default.any.isRequired,
  removeProjectFromCollection: _propTypes.default.func,
  uploadAvatar: _propTypes.default.func
};

const getOrNull = async function getOrNull(api, route) {
  try {
    const {
      data
    } = await api.get(route);
    return data;
  } catch (error) {
    if (error && error.response && error.response.status === 404) {
      return null;
    }

    throw error;
  }
};

async function getUserIdByLogin(api, userLogin) {
  const {
    data
  } = await api.get(`userid/byLogin/${userLogin}`);

  if (data === "NOT FOUND") {
    return null;
  }

  return data;
}

async function loadCollection(api, ownerName, collectionName) {
  let collections = []; // get team by url

  const team = await getOrNull(api, `teams/byUrl/${ownerName}`);

  if (team) {
    const {
      data
    } = await api.get(`collections?teamId=${team.id}`);
    collections = data;
  } else {
    // get userId by login name
    const userId = await getUserIdByLogin(api, ownerName);

    if (userId) {
      const {
        data
      } = await api.get(`collections?userId=${userId}`);
      collections = data;
    }
  } // pick out the correct collection, then load the full data


  const collectionMatch = collections.find(function (c) {
    return c.url == collectionName;
  });
  const collection = collectionMatch && (await getOrNull(api, `collections/${collectionMatch.id}`));
  if (!collection) return null; // inject the full team so we get their projects and members

  if (team) {
    collection.team = team;
  }

  return collection;
}

const CollectionPage = function CollectionPage(_ref2) {
  let {
    api,
    ownerName,
    name
  } = _ref2,
      props = _objectWithoutPropertiesLoose(_ref2, ["api", "ownerName", "name"]);

  return _react.default.createElement(_layout.default, {
    api: api
  }, _react.default.createElement(_loader.DataLoader, {
    get: function get() {
      return loadCollection(api, ownerName, name);
    }
  }, function (collection) {
    return collection ? _react.default.createElement(_analytics.AnalyticsContext, {
      properties: {
        origin: 'collection'
      },
      context: {
        groupId: collection.team ? collection.team.id.toString() : '0'
      }
    }, _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
      return _react.default.createElement(_collectionEditor.default, {
        api: api,
        initialCollection: collection
      }, function (collection, funcs, userIsAuthor) {
        return _react.default.createElement(CollectionPageContents, _extends({
          collection: collection,
          api: api,
          currentUser: currentUser,
          isAuthorized: userIsAuthor
        }, funcs, props));
      });
    })) : _react.default.createElement(_notFound.default, {
      name: name
    });
  }));
};

var _default = CollectionPage;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pages/error.jsx":
/*!****************************************!*\
  !*** ./src/presenters/pages/error.jsx ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.ProjectNotFoundPage = exports.OauthErrorPage = exports.EmailErrorPage = exports.NotFoundPage = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactHelmet = __webpack_require__(/*! react-helmet */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-helmet/5.2.0/node_modules/react-helmet/lib/Helmet.js");

var _layout = _interopRequireDefault(__webpack_require__(/*! ../layout */ "./src/presenters/layout.jsx"));

var _project = __webpack_require__(/*! ../../models/project */ "./src/models/project.js");

var _currentUser = __webpack_require__(/*! ../current-user */ "./src/presenters/current-user.jsx");

var _notFound = _interopRequireDefault(__webpack_require__(/*! ../includes/not-found */ "./src/presenters/includes/not-found.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const telescopeImageUrl = 'https://cdn.glitch.com/7138972f-76e1-43f4-8ede-84c3cdd4b40a%2Ftelescope_404.svg?1543258683849';

const NotFoundPage = function NotFoundPage({
  api
}) {
  return _react.default.createElement(_layout.default, {
    api: api
  }, _react.default.createElement(_reactHelmet.Helmet, null, _react.default.createElement("title", null, "\uD83D\uDC7B Page not found"), " "), _react.default.createElement("main", {
    className: "error-page-container"
  }, _react.default.createElement("img", {
    className: "error-image",
    src: telescopeImageUrl,
    alt: "",
    width: "318px",
    height: "297px"
  }), _react.default.createElement("div", {
    className: "error-msg"
  }, _react.default.createElement("h1", null, "Page Not Found"), _react.default.createElement("p", null, "Maybe a typo, or perhaps it's moved?"), _react.default.createElement("a", {
    className: "button button-link",
    href: "/"
  }, "Back to Glitch"))));
};

exports.NotFoundPage = NotFoundPage;
NotFoundPage.propTypes = {
  api: _propTypes.default.func.isRequired
};
const emailImageUrl = 'https://cdn.glitch.com/26ac422d-705d-42be-b9cb-1fbdfe7e5a63%2Ferror-mailer.svg?1543429767321';

const EmailErrorPage = function EmailErrorPage({
  api,
  title,
  description
}) {
  return _react.default.createElement(_layout.default, {
    api: api
  }, _react.default.createElement(_reactHelmet.Helmet, null, _react.default.createElement("title", null, "\u2709\uFE0F ", title), " "), _react.default.createElement("main", {
    className: "error-page-container"
  }, _react.default.createElement("img", {
    className: "error-image email-error-image",
    src: emailImageUrl,
    alt: "",
    width: "470px"
  }), _react.default.createElement("div", {
    className: "error-msg"
  }, _react.default.createElement("h1", null, title), _react.default.createElement("p", null, description), _react.default.createElement("a", {
    className: "button button-link",
    href: "/"
  }, "Back to Glitch"))));
};

exports.EmailErrorPage = EmailErrorPage;
EmailErrorPage.propTypes = {
  api: _propTypes.default.func.isRequired,
  title: _propTypes.default.string.isRequired,
  description: _propTypes.default.string.isRequired
};
const oauthImageUrl = 'https://cdn.glitch.com/8ae9b195-ef39-406b-aee0-764888d15665%2Foauth-key.svg?1544466885907';

const OauthErrorPage = function OauthErrorPage({
  api,
  title,
  description
}) {
  return _react.default.createElement(_layout.default, {
    api: api
  }, _react.default.createElement(_reactHelmet.Helmet, null, _react.default.createElement("title", null, "\uD83D\uDD11 ", title), " "), _react.default.createElement("main", {
    className: "error-page-container"
  }, _react.default.createElement("img", {
    className: "error-image",
    src: oauthImageUrl,
    alt: "",
    width: "370px"
  }), _react.default.createElement("div", {
    className: "error-msg"
  }, _react.default.createElement("h1", null, title), _react.default.createElement("p", null, description), _react.default.createElement("a", {
    className: "button button-link",
    href: "/"
  }, "Back to Glitch"))));
};

exports.OauthErrorPage = OauthErrorPage;
OauthErrorPage.propTypes = {
  api: _propTypes.default.func.isRequired,
  title: _propTypes.default.string.isRequired,
  description: _propTypes.default.string.isRequired
};

class ProjectNotFoundPageReloader extends _react.default.Component {
  async check() {
    const {
      data
    } = await this.props.api.get(`projects/${this.props.name}`);

    if (data) {
      window.location.replace((0, _project.getShowUrl)(this.props.name));
    }
  }

  componentDidMount() {
    this.check();
  }

  componentDidUpdate(prevProps) {
    const token = this.props.currentUser && this.props.currentUser.persistentToken;
    const prevToken = prevProps.currentUser && prevProps.currentUser.persistentToken;

    if (this.props.name !== prevProps.name || token !== prevToken) {
      this.check();
    }
  }

  render() {
    return null;
  }

}

const ProjectNotFoundPage = function ProjectNotFoundPage({
  api,
  name
}) {
  return _react.default.createElement(_layout.default, {
    api: api
  }, _react.default.createElement(_reactHelmet.Helmet, null, _react.default.createElement("title", null, "\uD83D\uDC7B Project not found"), " "), _react.default.createElement(_notFound.default, {
    name: name
  }), _react.default.createElement("p", null, "Either there's no project here, or you don't have access to it.  Are you logged in as the right user?"), _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
    return _react.default.createElement(ProjectNotFoundPageReloader, {
      api: api,
      name: name,
      currentUser: currentUser
    });
  }));
};

exports.ProjectNotFoundPage = ProjectNotFoundPage;
ProjectNotFoundPage.propTypes = {
  api: _propTypes.default.func.isRequired,
  name: _propTypes.default.string.isRequired
};

/***/ }),

/***/ "./src/presenters/pages/index.jsx":
/*!****************************************!*\
  !*** ./src/presenters/pages/index.jsx ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _layout = _interopRequireDefault(__webpack_require__(/*! ../layout.jsx */ "./src/presenters/layout.jsx"));

var _project = __webpack_require__(/*! ../../models/project */ "./src/models/project.js");

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

var _link = _interopRequireDefault(__webpack_require__(/*! ../includes/link.jsx */ "./src/presenters/includes/link.jsx"));

var _categories = _interopRequireDefault(__webpack_require__(/*! ../categories.jsx */ "./src/presenters/categories.jsx"));

var _featured = _interopRequireDefault(__webpack_require__(/*! ../featured.jsx */ "./src/presenters/featured.jsx"));

var _overlayVideo = _interopRequireDefault(__webpack_require__(/*! ../overlays/overlay-video.jsx */ "./src/presenters/overlays/overlay-video.jsx"));

var _questions = _interopRequireDefault(__webpack_require__(/*! ../questions.jsx */ "./src/presenters/questions.jsx"));

var _randomCategories = _interopRequireDefault(__webpack_require__(/*! ../random-categories.jsx */ "./src/presenters/random-categories.jsx"));

var _recentProjects = _interopRequireDefault(__webpack_require__(/*! ../recent-projects.jsx */ "./src/presenters/recent-projects.jsx"));

var _reportAbusePop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/report-abuse-pop.jsx */ "./src/presenters/pop-overs/report-abuse-pop.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

const Callout = function Callout({
  classes,
  imgUrl,
  title,
  description
}) {
  return _react.default.createElement("div", {
    className: "callout " + classes
  }, _react.default.createElement("img", {
    className: "badge",
    src: imgUrl,
    alt: title
  }), _react.default.createElement("div", {
    className: "window"
  }, _react.default.createElement("div", {
    className: "title"
  }, title), _react.default.createElement("div", {
    className: "description"
  }, description)));
};

Callout.propTypes = {
  classes: _propTypes.default.string,
  imgUrl: _propTypes.default.string,
  title: _propTypes.default.string,
  description: _propTypes.default.string
};

class WhatIsGlitch extends _react.default.Component {
  componentDidMount() {
    loadScript('//fast.wistia.com/embed/medias/i0m98yntdb.jsonp');
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }

  render() {
    const witchLarge = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fglitch-witch-large.svg?1543872118446";
    const witchSmall = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fglitch-witch-small.svg?1543872119039";
    const discover = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fexplore-illustration.svg?1543508598659";
    const remix = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fremix-illustration.svg?1543508529783";
    const collaborate = "https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fcollaborate-illustration.svg?1543508686482";
    const play = "https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg";
    const whatsGlitchAlt = "Glitch is the friendly community where you'll find the app of your dreams";
    return _react.default.createElement("section", {
      className: "what-is-glitch"
    }, _react.default.createElement("span", null, _react.default.createElement("figure", null, _react.default.createElement("img", {
      className: "witch large",
      src: witchLarge,
      alt: whatsGlitchAlt
    }), _react.default.createElement("img", {
      className: "witch small",
      src: witchSmall,
      alt: whatsGlitchAlt
    }), _react.default.createElement(_overlayVideo.default, null, _react.default.createElement("div", {
      className: "button video"
    }, _react.default.createElement("img", {
      className: "play-button",
      src: play,
      alt: "How it works"
    }), _react.default.createElement("span", null, "How it works")))), _react.default.createElement("div", {
      className: "callouts"
    }, _react.default.createElement(Callout, {
      classes: "discover",
      imgUrl: discover,
      title: "Explore Apps",
      description: "Discover over a million free apps built by people like you"
    }), _react.default.createElement(Callout, {
      classes: "remix",
      imgUrl: remix,
      title: "Remix Anything",
      description: "Edit any project and have your own app running instantly"
    }), _react.default.createElement(Callout, {
      classes: "collaborate",
      imgUrl: collaborate,
      title: "Build with Your Team",
      description: "Invite everyone to create together"
    }), "          ")));
  }

}

const MadeInGlitch = function MadeInGlitch() {
  return _react.default.createElement("section", {
    className: "made-in-glitch"
  }, _react.default.createElement("p", null, "Of course, this site was made on Glitch too"), _react.default.createElement(_link.default, {
    to: (0, _project.getEditorUrl)('community'),
    className: "button button-link has-emoji"
  }, "View Source ", _react.default.createElement("span", {
    className: "emoji carp_streamer"
  })));
};

const IndexPage = function IndexPage({
  api,
  user
}) {
  return _react.default.createElement("main", null, !user.login && _react.default.createElement(WhatIsGlitch, null), !!user.projects.length && _react.default.createElement(_recentProjects.default, {
    api: api
  }), !!user.login && _react.default.createElement(_questions.default, {
    api: api
  }), _react.default.createElement(_featured.default, {
    isAuthorized: !!user.login
  }), _react.default.createElement(_randomCategories.default, {
    api: api
  }), _react.default.createElement(_categories.default, null), _react.default.createElement(MadeInGlitch, null), _react.default.createElement(_reportAbusePop.default, {
    reportedType: "home"
  }));
};

IndexPage.propTypes = {
  user: _propTypes.default.shape({
    id: _propTypes.default.number,
    login: _propTypes.default.string
  })
};

const IndexPageContainer = function IndexPageContainer({
  api
}) {
  return _react.default.createElement(_layout.default, {
    api: api
  }, _react.default.createElement(_analytics.AnalyticsContext, {
    properties: {
      origin: 'index'
    }
  }, _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (user) {
    return _react.default.createElement(IndexPage, {
      api: api,
      user: user
    });
  })));
};

var _default = IndexPageContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pages/join-team.jsx":
/*!********************************************!*\
  !*** ./src/presenters/pages/join-team.jsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.JoinTeamPage = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _sentry = __webpack_require__(/*! ../../utils/sentry */ "./src/utils/sentry.js");

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _team = __webpack_require__(/*! ../../models/team */ "./src/models/team.js");

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

var _notifications = _interopRequireDefault(__webpack_require__(/*! ../notifications.jsx */ "./src/presenters/notifications.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class JoinTeamPageBase extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null
    };
  }

  async componentDidMount() {
    try {
      var {
        data: team
      } = await this.props.api.get(`/teams/byUrl/${this.props.teamUrl}`);
    } catch (error) {
      if (error && !(error.response && error.response.status === 404)) {
        (0, _sentry.captureException)(error);
      }
    }

    if (!team) {
      // Either the api is down or the team doesn't exist
      // Regardless we can't really do anything with this
      this.props.createErrorNotification('Invite failed, try asking your teammate to resend the invite');
      this.setState({
        redirect: (0, _team.getLink)({
          url: this.props.teamUrl
        })
      });
      return;
    }

    try {
      // Suppress the authorization header to prevent user merging
      await this.props.api.post(`/teams/${team.id}/join/${this.props.joinToken}`, {}, {
        headers: {
          Authorization: ''
        }
      });
      this.props.createNotification('Invitation accepted');
    } catch (error) {
      // The team is real but the token didn't work
      // Maybe it's been used already or expired?
      console.log('Team invite error', error && error.response && error.response.data);
      (0, _sentry.captureMessage)('Team invite error', {
        extra: {
          error
        }
      });
      this.props.createErrorNotification('Invite failed, try asking your teammate to resend the invite');
    }

    await this.props.reloadCurrentUser();
    this.setState({
      redirect: (0, _team.getLink)(team)
    });
  }

  render() {
    if (this.state.redirect) {
      return _react.default.createElement(_reactRouterDom.Redirect, {
        to: this.state.redirect
      });
    }

    return null;
  }

}

JoinTeamPageBase.propTypes = {
  api: _propTypes.default.any.isRequired,
  teamUrl: _propTypes.default.string.isRequired,
  joinToken: _propTypes.default.string.isRequired,
  createErrorNotification: _propTypes.default.func.isRequired,
  createNotification: _propTypes.default.func.isRequired,
  reloadCurrentUser: _propTypes.default.func.isRequired
};

const JoinTeamPage = function JoinTeamPage(props) {
  return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser, fetched, {
    reload
  }) {
    return _react.default.createElement(_notifications.default, null, function (notify) {
      return _react.default.createElement(JoinTeamPageBase, _extends({}, notify, props, {
        reloadCurrentUser: reload
      }));
    });
  });
};

exports.JoinTeamPage = JoinTeamPage;
var _default = JoinTeamPage;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pages/login.jsx":
/*!****************************************!*\
  !*** ./src/presenters/pages/login.jsx ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.EmailTokenLoginPage = exports.GitHubLoginPage = exports.FacebookLoginPage = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _sentry = __webpack_require__(/*! ../../utils/sentry */ "./src/utils/sentry.js");

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _localStorage = _interopRequireDefault(__webpack_require__(/*! ../includes/local-storage */ "./src/presenters/includes/local-storage.jsx"));

var _currentUser = __webpack_require__(/*! ../current-user */ "./src/presenters/current-user.jsx");

var _error = __webpack_require__(/*! ./error */ "./src/presenters/pages/error.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// The Editor may embed /login/* endpoints in an iframe in order to share code.
// NotifyParent allows the editor to receive messages from this page.
// We use this to pass on auth success/failure messages.
function notifyParent(message = {}) {
  if (window.parent === window) {
    return;
  } // Specifically target our same origin;
  // we're only communicating between the editor and its corresponding ~community site,
  // not across other environments.


  const sameOrigin = window.origin; // Add 'LoginMessage' to all messages of this type so that the Editor
  // can filter for them specifically.

  message.type = "LoginMessage";
  window.parent.postMessage(message, sameOrigin);
}

class LoginPage extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false,
      redirect: {
        pathname: '/'
      },
      error: false,
      errorMessage: null
    };
  }

  async componentDidMount() {
    const {
      api,
      provider,
      url,
      destination
    } = this.props;
    this.props.setDestination(undefined);

    try {
      const {
        data
      } = await api.post(url);

      if (data.id <= 0) {
        throw new Error(`Bad user id (${data.id}) after ${provider} login`);
      }

      console.log("LOGGED IN", data);
      this.props.setUser(data);

      if (destination && destination.expires > new Date().toISOString()) {
        this.setState({
          redirect: destination.to
        });
      }

      this.setState({
        done: true
      });
      analytics.track("Signed In", {
        provider
      });
      notifyParent({
        success: true,
        details: {
          provider
        }
      });
    } catch (error) {
      this.setState({
        error: true
      });
      const errorData = error && error.response && error.response.data;

      if (errorData && errorData.message) {
        this.setState({
          errorMessage: errorData.message
        });
      }

      const details = {
        provider,
        error: errorData
      };
      console.error("Login error.", details);
      (0, _sentry.captureMessage)("Login error", {
        extra: details
      });
      notifyParent({
        success: false,
        details
      });
    }
  }

  render() {
    if (this.state.done) {
      return _react.default.createElement(_reactRouterDom.Redirect, {
        to: this.state.redirect
      });
    } else if (this.state.error) {
      const genericDescription = "Hard to say what happened, but we couldn't log you in. Try again?";

      if (this.props.provider === "Email") {
        return _react.default.createElement(_error.EmailErrorPage, {
          api: this.props.api,
          title: `${this.props.provider} Login Problem`,
          description: this.state.errorMessage || genericDescription
        });
      }

      return _react.default.createElement(_error.OauthErrorPage, {
        api: this.props.api,
        title: `${this.props.provider} Login Problem`,
        description: this.state.errorMessage || genericDescription
      });
    }

    return _react.default.createElement("div", {
      className: "content"
    });
  }

}

LoginPage.propTypes = {
  api: _propTypes.default.any.isRequired,
  url: _propTypes.default.string.isRequired,
  provider: _propTypes.default.string.isRequired,
  setUser: _propTypes.default.func.isRequired,
  destination: _propTypes.default.shape({
    expires: _propTypes.default.string.isRequired,
    to: _propTypes.default.object.isRequired
  }),
  hash: _propTypes.default.string
};

const LoginPageContainer = function LoginPageContainer(props) {
  return _react.default.createElement(_localStorage.default, {
    name: "destinationAfterAuth",
    default: undefined
  }, function (destination, setDestination, loaded) {
    return loaded && _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser, fetched, {
      login
    }) {
      return _react.default.createElement(LoginPage, _extends({
        setUser: login,
        destination: destination,
        setDestination: setDestination
      }, props));
    });
  });
};

const FacebookLoginPage = function FacebookLoginPage(_ref) {
  let {
    code
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["code"]);

  const callbackUrl = `${APP_URL}/login/facebook`;
  const url = `/auth/facebook/${code}?callbackURL=${encodeURIComponent(callbackUrl)}`;
  return _react.default.createElement(LoginPageContainer, _extends({}, props, {
    provider: "Facebook",
    url: url
  }));
};

exports.FacebookLoginPage = FacebookLoginPage;

const GitHubLoginPage = function GitHubLoginPage(_ref2) {
  let {
    code
  } = _ref2,
      props = _objectWithoutPropertiesLoose(_ref2, ["code"]);

  const url = `/auth/github/${code}`;
  return _react.default.createElement(LoginPageContainer, _extends({}, props, {
    provider: "GitHub",
    url: url
  }));
};

exports.GitHubLoginPage = GitHubLoginPage;

const EmailTokenLoginPage = function EmailTokenLoginPage(_ref3) {
  let {
    token
  } = _ref3,
      props = _objectWithoutPropertiesLoose(_ref3, ["token"]);

  const url = `/auth/email/${token}`;
  return _react.default.createElement(LoginPageContainer, _extends({}, props, {
    provider: "Email",
    url: url
  }));
};

exports.EmailTokenLoginPage = EmailTokenLoginPage;

/***/ }),

/***/ "./src/presenters/pages/project.jsx":
/*!******************************************!*\
  !*** ./src/presenters/pages/project.jsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactHelmet = _interopRequireDefault(__webpack_require__(/*! react-helmet */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-helmet/5.2.0/node_modules/react-helmet/lib/Helmet.js"));

var _project = __webpack_require__(/*! ../../models/project */ "./src/models/project.js");

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _loader = __webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx");

var _notFound = _interopRequireDefault(__webpack_require__(/*! ../includes/not-found.jsx */ "./src/presenters/includes/not-found.jsx"));

var _markdown = __webpack_require__(/*! ../includes/markdown.jsx */ "./src/presenters/includes/markdown.jsx");

var _projectEditor = _interopRequireDefault(__webpack_require__(/*! ../project-editor.jsx */ "./src/presenters/project-editor.jsx"));

var _expander = _interopRequireDefault(__webpack_require__(/*! ../includes/expander.jsx */ "./src/presenters/includes/expander.jsx"));

var _editableField = _interopRequireDefault(__webpack_require__(/*! ../includes/editable-field.jsx */ "./src/presenters/includes/editable-field.jsx"));

var _descriptionField = __webpack_require__(/*! ../includes/description-field.jsx */ "./src/presenters/includes/description-field.jsx");

var _profile = __webpack_require__(/*! ../includes/profile.jsx */ "./src/presenters/includes/profile.jsx");

var _projectActions = __webpack_require__(/*! ../includes/project-actions.jsx */ "./src/presenters/includes/project-actions.jsx");

var _reportAbusePop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/report-abuse-pop.jsx */ "./src/presenters/pop-overs/report-abuse-pop.jsx"));

var _addProjectToCollection = _interopRequireDefault(__webpack_require__(/*! ../includes/add-project-to-collection.jsx */ "./src/presenters/includes/add-project-to-collection.jsx"));

var _teamsList = _interopRequireDefault(__webpack_require__(/*! ../teams-list.jsx */ "./src/presenters/teams-list.jsx"));

var _usersList = _interopRequireDefault(__webpack_require__(/*! ../users-list.jsx */ "./src/presenters/users-list.jsx"));

var _relatedProjects = _interopRequireDefault(__webpack_require__(/*! ../includes/related-projects.jsx */ "./src/presenters/includes/related-projects.jsx"));

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

var _layout = _interopRequireDefault(__webpack_require__(/*! ../layout.jsx */ "./src/presenters/layout.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function trackRemix(id, domain) {
  analytics.track("Click Remix", {
    origin: "project page",
    baseProjectId: id,
    baseDomain: domain
  });
}

function syncPageToDomain(domain) {
  history.replaceState(null, null, `/~${domain}`);
}

const PrivateTooltip = "Only members can view code";
const PublicTooltip = "Visible to everyone";

const PrivateBadge = function PrivateBadge() {
  return _react.default.createElement("span", {
    className: "project-badge private-project-badge",
    "aria-label": PrivateTooltip,
    "data-tooltip": PrivateTooltip
  });
};

const PrivateToggle = function PrivateToggle({
  isPrivate,
  setPrivate
}) {
  const tooltip = isPrivate ? PrivateTooltip : PublicTooltip;
  const classBase = "button-tertiary button-on-secondary-background project-badge";
  const className = isPrivate ? 'private-project-badge' : 'public-project-badge';
  return _react.default.createElement("span", {
    "data-tooltip": tooltip
  }, _react.default.createElement("button", {
    "aria-label": tooltip,
    onClick: function onClick() {
      return setPrivate(!isPrivate);
    },
    className: `${classBase} ${className}`
  }));
};

PrivateToggle.propTypes = {
  isPrivate: _propTypes.default.bool.isRequired,
  setPrivate: _propTypes.default.func.isRequired
};

const Embed = function Embed({
  domain
}) {
  return _react.default.createElement("div", {
    className: "glitch-embed-wrap"
  }, _react.default.createElement("iframe", {
    title: "embed",
    src: `${APP_URL}/embed/#!/embed/${domain}?path=README.md&previewSize=100`,
    allow: "geolocation; microphone; camera; midi; encrypted-media"
  }));
};

Embed.propTypes = {
  domain: _propTypes.default.string.isRequired
};

const ReadmeError = function ReadmeError(error) {
  return error && error.response && error.response.status === 404 ? _react.default.createElement(_react.default.Fragment, null, "This project would be even better with a ", _react.default.createElement("code", null, "README.md")) : _react.default.createElement(_react.default.Fragment, null, "We couldn't load the readme. Try refreshing?");
};

const ReadmeLoader = function ReadmeLoader({
  api,
  domain
}) {
  return _react.default.createElement(_loader.DataLoader, {
    get: function get() {
      return api.get(`projects/${domain}/readme`);
    },
    renderError: ReadmeError
  }, function ({
    data
  }) {
    return _react.default.createElement(_expander.default, {
      height: 250
    }, _react.default.createElement(_markdown.Markdown, null, data));
  });
};

ReadmeLoader.propTypes = {
  api: _propTypes.default.any.isRequired,
  domain: _propTypes.default.string.isRequired
};

const ProjectPage = function ProjectPage({
  project,
  addProjectToCollection,
  api,
  currentUser,
  isAuthorized,
  updateDomain,
  updateDescription,
  updatePrivate
}) {
  const {
    domain,
    users,
    teams
  } = project;
  return _react.default.createElement("main", {
    className: "project-page"
  }, _react.default.createElement("section", {
    id: "info"
  }, _react.default.createElement(_profile.InfoContainer, null, _react.default.createElement(_profile.ProjectInfoContainer, {
    style: {
      backgroundImage: `url('${(0, _project.getAvatarUrl)(project.id)}')`
    }
  }, _react.default.createElement("h1", null, isAuthorized ? _react.default.createElement(_editableField.default, {
    value: domain,
    placeholder: "Name your project",
    update: function update(domain) {
      return updateDomain(domain).then(function () {
        return syncPageToDomain(domain);
      });
    },
    suffix: _react.default.createElement(PrivateToggle, {
      isPrivate: project.private,
      isMember: isAuthorized,
      setPrivate: updatePrivate
    })
  }) : _react.default.createElement(_react.default.Fragment, null, domain, " ", project.private && _react.default.createElement(PrivateBadge, null))), _react.default.createElement("div", {
    className: "users-information"
  }, _react.default.createElement(_usersList.default, {
    users: users
  }), !!teams.length && _react.default.createElement(_teamsList.default, {
    teams: teams
  })), _react.default.createElement(_descriptionField.AuthDescription, {
    authorized: isAuthorized,
    description: project.description,
    update: updateDescription,
    placeholder: "Tell us about your app"
  }), _react.default.createElement("p", {
    className: "buttons"
  }, _react.default.createElement(_projectActions.ShowButton, {
    name: domain
  }), _react.default.createElement(_projectActions.EditButton, {
    name: domain,
    isMember: isAuthorized
  }))))), _react.default.createElement("section", {
    id: "embed"
  }, _react.default.createElement(Embed, {
    domain: domain
  }), _react.default.createElement("div", {
    className: "buttons space-between"
  }, _react.default.createElement(_reportAbusePop.default, {
    reportedType: "project",
    reportedModel: project
  }), _react.default.createElement("div", null, currentUser.login && _react.default.createElement(_addProjectToCollection.default, {
    className: "button-small margin",
    api: api,
    currentUser: currentUser,
    project: project,
    fromProject: true,
    addProjectToCollection: addProjectToCollection
  }), _react.default.createElement(_projectActions.RemixButton, {
    className: "button-small margin",
    name: domain,
    isMember: isAuthorized,
    onClick: function onClick() {
      return trackRemix(project.id, domain);
    }
  })))), _react.default.createElement("section", {
    id: "readme"
  }, _react.default.createElement(ReadmeLoader, {
    api: api,
    domain: domain
  })), _react.default.createElement("section", {
    id: "related"
  }, _react.default.createElement(_relatedProjects.default, _extends({
    ignoreProjectId: project.id
  }, {
    api,
    teams,
    users
  }))));
};

ProjectPage.propTypes = {
  api: _propTypes.default.any.isRequired,
  currentUser: _propTypes.default.object.isRequired,
  isAuthorized: _propTypes.default.bool.isRequired,
  project: _propTypes.default.object.isRequired
};

async function getProject(api, domain) {
  const {
    data
  } = await api.get(`projects/${domain}`);
  console.log("project", data);
  return data;
}

const ProjectPageLoader = function ProjectPageLoader(_ref) {
  let {
    domain,
    api,
    currentUser
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["domain", "api", "currentUser"]);

  return _react.default.createElement(_loader.DataLoader, {
    get: function get() {
      return getProject(api, domain);
    },
    renderError: function renderError() {
      return _react.default.createElement(_notFound.default, {
        name: domain
      });
    }
  }, function (project) {
    return project ? _react.default.createElement(_projectEditor.default, {
      api: api,
      initialProject: project
    }, function (project, funcs, userIsMember) {
      return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_reactHelmet.default, null, _react.default.createElement("title", null, project.domain)), _react.default.createElement(ProjectPage, _extends({
        api: api,
        project: project
      }, funcs, {
        isAuthorized: userIsMember,
        currentUser: currentUser
      }, props)));
    }) : _react.default.createElement(_notFound.default, {
      name: domain
    });
  });
};

ProjectPageLoader.propTypes = {
  api: _propTypes.default.func.isRequired,
  domain: _propTypes.default.string.isRequired,
  currentUser: _propTypes.default.object.isRequired
};

const ProjectPageContainer = function ProjectPageContainer({
  api,
  name
}) {
  return _react.default.createElement(_layout.default, {
    api: api
  }, _react.default.createElement(_analytics.AnalyticsContext, {
    properties: {
      origin: 'project'
    }
  }, _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
    return _react.default.createElement(ProjectPageLoader, {
      api: api,
      domain: name,
      currentUser: currentUser
    });
  })));
};

var _default = ProjectPageContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pages/questions.jsx":
/*!********************************************!*\
  !*** ./src/presenters/pages/questions.jsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactHelmet = _interopRequireDefault(__webpack_require__(/*! react-helmet */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-helmet/5.2.0/node_modules/react-helmet/lib/Helmet.js"));

var _layout = _interopRequireDefault(__webpack_require__(/*! ../layout.jsx */ "./src/presenters/layout.jsx"));

var _questions = _interopRequireDefault(__webpack_require__(/*! ../questions.jsx */ "./src/presenters/questions.jsx"));

var _categories = _interopRequireDefault(__webpack_require__(/*! ../categories.jsx */ "./src/presenters/categories.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const QuestionsPage = function QuestionsPage({
  api
}) {
  return _react.default.createElement(_layout.default, {
    api: api
  }, _react.default.createElement(_reactHelmet.default, null, _react.default.createElement("title", null, "Questions")), _react.default.createElement("main", {
    className: "questions-page"
  }, _react.default.createElement(_questions.default, {
    api: api,
    max: 12
  }), _react.default.createElement(_categories.default, null)));
};

QuestionsPage.propTypes = {
  api: _propTypes.default.any.isRequired
};
var _default = QuestionsPage;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pages/router.jsx":
/*!*****************************************!*\
  !*** ./src/presenters/pages/router.jsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _categories = _interopRequireDefault(__webpack_require__(/*! ../../curated/categories */ "./src/curated/categories.js"));

var _teams = _interopRequireDefault(__webpack_require__(/*! ../../curated/teams */ "./src/curated/teams.js"));

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

var _index = _interopRequireDefault(__webpack_require__(/*! ./index.jsx */ "./src/presenters/pages/index.jsx"));

var _login = __webpack_require__(/*! ./login.jsx */ "./src/presenters/pages/login.jsx");

var _joinTeam = _interopRequireDefault(__webpack_require__(/*! ./join-team.jsx */ "./src/presenters/pages/join-team.jsx"));

var _questions = _interopRequireDefault(__webpack_require__(/*! ./questions.jsx */ "./src/presenters/pages/questions.jsx"));

var _project = _interopRequireDefault(__webpack_require__(/*! ./project.jsx */ "./src/presenters/pages/project.jsx"));

var _teamOrUser = __webpack_require__(/*! ./team-or-user.jsx */ "./src/presenters/pages/team-or-user.jsx");

var _search = _interopRequireDefault(__webpack_require__(/*! ./search.jsx */ "./src/presenters/pages/search.jsx"));

var _category = _interopRequireDefault(__webpack_require__(/*! ./category.jsx */ "./src/presenters/pages/category.jsx"));

var _collection = _interopRequireDefault(__webpack_require__(/*! ./collection.jsx */ "./src/presenters/pages/collection.jsx"));

var _error = __webpack_require__(/*! ./error.jsx */ "./src/presenters/pages/error.jsx");

var _secret = _interopRequireDefault(__webpack_require__(/*! ./secret.jsx */ "./src/presenters/pages/secret.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* global EXTERNAL_ROUTES */
const parse = function parse(search, name) {
  const params = new URLSearchParams(search);
  return params.get(name);
};

class ExternalPageReloader extends _react.default.Component {
  componentDidMount() {
    window.location.reload();
  }

  render() {
    return null;
  }

}

class PageChangeHandlerBase extends _react.default.Component {
  track() {
    try {
      const analytics = window.analytics;

      if (analytics) {
        analytics.page({}, {
          groupId: '0'
        });
      }
    } catch (ex) {
      console.error("Error tracking page transition.", ex);
    }
  }

  componentDidUpdate(prev) {
    if (this.props.location.key !== prev.location.key) {
      window.scrollTo(0, 0);
      this.props.reloadCurrentUser();
      this.track();
    }
  }

  componentDidMount() {
    this.track();
  }

  render() {
    return null;
  }

}

const PageChangeHandler = (0, _reactRouterDom.withRouter)(function ({
  location
}) {
  return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (user, fetched, {
    reload
  }) {
    return _react.default.createElement(PageChangeHandlerBase, {
      location: location,
      reloadCurrentUser: reload
    });
  });
});

const Router = function Router({
  api
}) {
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(PageChangeHandler, null), _react.default.createElement(_reactRouterDom.Switch, null, _react.default.createElement(_reactRouterDom.Route, {
    path: "/",
    exact: true,
    render: function render({
      location
    }) {
      return _react.default.createElement(_index.default, {
        key: location.key,
        api: api
      });
    }
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/index.html",
    exact: true,
    strict: true,
    render: function render({
      location
    }) {
      return _react.default.createElement(_index.default, {
        key: location.key,
        api: api
      });
    }
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/login/facebook",
    exact: true,
    render: function render({
      location
    }) {
      return _react.default.createElement(_login.FacebookLoginPage, {
        key: location.key,
        api: api,
        code: parse(location.search, 'code'),
        hash: parse(location.search, 'hash')
      });
    }
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/login/github",
    exact: true,
    render: function render({
      location
    }) {
      return _react.default.createElement(_login.GitHubLoginPage, {
        key: location.key,
        api: api,
        code: parse(location.search, 'code'),
        hash: parse(location.search, 'hash')
      });
    }
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/login/email",
    exact: true,
    render: function render({
      location
    }) {
      return _react.default.createElement(_login.EmailTokenLoginPage, {
        key: location.key,
        api: api,
        token: parse(location.search, 'token'),
        hash: parse(location.search, 'hash')
      });
    }
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/join/@:teamUrl/:joinToken",
    exact: true,
    render: function render({
      match
    }) {
      return _react.default.createElement(_joinTeam.default, _extends({
        key: location.key,
        api: api
      }, match.params));
    }
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/questions",
    exact: true,
    render: function render({
      location
    }) {
      return _react.default.createElement(_questions.default, {
        key: location.key,
        api: api
      });
    }
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/~:name",
    exact: true,
    render: function render({
      location,
      match
    }) {
      return _react.default.createElement(_project.default, {
        key: location.key,
        api: api,
        name: match.params.name
      });
    }
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/~:name/404",
    exact: true,
    render: function render({
      location,
      match
    }) {
      return _react.default.createElement(_error.ProjectNotFoundPage, {
        key: location.key,
        api: api,
        name: match.params.name
      });
    }
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/@:name",
    exact: true,
    render: function render({
      location,
      match
    }) {
      return _react.default.createElement(_teamOrUser.TeamOrUserPage, {
        key: location.key,
        api: api,
        name: match.params.name
      });
    }
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/@:owner/:name",
    exact: true,
    render: function render({
      location,
      match
    }) {
      return _react.default.createElement(_collection.default, {
        key: location.key,
        api: api,
        ownerName: match.params.owner,
        name: match.params.name
      });
    }
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/user/:id(\\d+)",
    exact: true,
    render: function render({
      location,
      match
    }) {
      return _react.default.createElement(_teamOrUser.UserPage, {
        key: location.key,
        api: api,
        id: parseInt(match.params.id, 10),
        name: `user ${match.params.id}`
      });
    }
  }), Object.keys(_teams.default).map(function (name) {
    return _react.default.createElement(_reactRouterDom.Route, {
      key: name,
      path: `/${name}`,
      exact: true,
      render: function render({
        location
      }) {
        return _react.default.createElement(_teamOrUser.TeamPage, {
          key: location.key,
          api: api,
          id: _teams.default[name],
          name: name
        });
      }
    });
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/search",
    exact: true,
    render: function render({
      location
    }) {
      return _react.default.createElement(_search.default, {
        key: location.key,
        api: api,
        query: parse(location.search, 'q')
      });
    }
  }), _categories.default.map(function (category) {
    return _react.default.createElement(_reactRouterDom.Route, {
      key: category.url,
      path: `/${category.url}`,
      exact: true,
      render: function render({
        location
      }) {
        return _react.default.createElement(_category.default, {
          key: location.key,
          api: api,
          category: category
        });
      }
    });
  }), _react.default.createElement(_reactRouterDom.Route, {
    path: "/secret",
    exact: true,
    render: function render({
      location
    }) {
      return _react.default.createElement(_secret.default, {
        key: location.key
      });
    }
  }), EXTERNAL_ROUTES.map(function (route) {
    return _react.default.createElement(_reactRouterDom.Route, {
      key: route,
      path: route,
      render: function render({
        location
      }) {
        return _react.default.createElement(ExternalPageReloader, {
          key: location.key
        });
      }
    });
  }), _react.default.createElement(_reactRouterDom.Route, {
    render: function render({
      location
    }) {
      return _react.default.createElement(_error.NotFoundPage, {
        api: api,
        key: location.key
      });
    }
  })));
};

Router.propTypes = {
  api: _propTypes.default.any.isRequired
};
var _default = Router;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pages/search.jsx":
/*!*****************************************!*\
  !*** ./src/presenters/pages/search.jsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactHelmet = _interopRequireDefault(__webpack_require__(/*! react-helmet */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-helmet/5.2.0/node_modules/react-helmet/lib/Helmet.js"));

var _layout = _interopRequireDefault(__webpack_require__(/*! ../layout.jsx */ "./src/presenters/layout.jsx"));

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

var _errorHandlers = _interopRequireDefault(__webpack_require__(/*! ../error-handlers.jsx */ "./src/presenters/error-handlers.jsx"));

var _categories = _interopRequireDefault(__webpack_require__(/*! ../categories.jsx */ "./src/presenters/categories.jsx"));

var _loader = _interopRequireDefault(__webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx"));

var _notFound = _interopRequireDefault(__webpack_require__(/*! ../includes/not-found.jsx */ "./src/presenters/includes/not-found.jsx"));

var _projectsList = _interopRequireDefault(__webpack_require__(/*! ../projects-list.jsx */ "./src/presenters/projects-list.jsx"));

var _teamItem = _interopRequireDefault(__webpack_require__(/*! ../team-item.jsx */ "./src/presenters/team-item.jsx"));

var _userItem = _interopRequireDefault(__webpack_require__(/*! ../user-item.jsx */ "./src/presenters/user-item.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const TeamResults = function TeamResults({
  teams
}) {
  return _react.default.createElement("article", null, _react.default.createElement("h2", null, "Teams"), _react.default.createElement("ul", {
    className: "teams-container"
  }, teams ? teams.map(function (team) {
    return _react.default.createElement("li", {
      key: team.id
    }, _react.default.createElement(_teamItem.default, {
      team: team
    }));
  }) : _react.default.createElement(_loader.default, null)));
};

const UserResults = function UserResults({
  users
}) {
  return _react.default.createElement("article", null, _react.default.createElement("h2", null, "Users"), _react.default.createElement("ul", {
    className: "users-container"
  }, users ? users.map(function (user) {
    return _react.default.createElement("li", {
      key: user.id
    }, _react.default.createElement(_userItem.default, {
      user: user
    }));
  }) : _react.default.createElement(_loader.default, null)));
};

const ProjectResults = function ProjectResults({
  addProjectToCollection,
  api,
  projects,
  currentUser
}) {
  return projects ? currentUser.login ? _react.default.createElement(_projectsList.default, {
    title: "Projects",
    projects: projects,
    api: api,
    projectOptions: {
      addProjectToCollection
    }
  }) : _react.default.createElement(_projectsList.default, {
    title: "Projects",
    projects: projects
  }) : _react.default.createElement("article", null, _react.default.createElement("h2", null, "Projects"), _react.default.createElement(_loader.default, null));
};

const MAX_RESULTS = 20;

const showResults = function showResults(results) {
  return !results || !!results.length;
};

class SearchResults extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: null,
      users: null,
      projects: null
    };
    this.addProjectToCollection = this.addProjectToCollection.bind(this);
  }

  async searchTeams() {
    const {
      api,
      query
    } = this.props;
    const {
      data
    } = await api.get(`teams/search?q=${query}`);
    this.setState({
      teams: data.slice(0, MAX_RESULTS)
    });
  }

  async searchUsers() {
    const {
      api,
      query
    } = this.props;
    const {
      data
    } = await api.get(`users/search?q=${query}`);
    this.setState({
      users: data.slice(0, MAX_RESULTS)
    });
  }

  async searchProjects() {
    const {
      api,
      query
    } = this.props;
    const {
      data
    } = await api.get(`projects/search?q=${query}`);
    this.setState({
      projects: data.filter(function (project) {
        return !project.notSafeForKids;
      }).slice(0, MAX_RESULTS)
    });
  }

  async addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  componentDidMount() {
    const {
      handleError
    } = this.props;
    this.searchTeams().catch(handleError);
    this.searchUsers().catch(handleError);
    this.searchProjects().catch(handleError);
  }

  render() {
    const {
      teams,
      users,
      projects
    } = this.state;
    const noResults = [teams, users, projects].every(function (results) {
      return !showResults(results);
    });
    return _react.default.createElement("main", {
      className: "search-results"
    }, showResults(teams) && _react.default.createElement(TeamResults, {
      teams: teams
    }), showResults(users) && _react.default.createElement(UserResults, {
      users: users
    }), showResults(projects) && _react.default.createElement(ProjectResults, {
      projects: projects,
      currentUser: this.props.currentUser,
      api: this.props.api,
      addProjectToCollection: this.addProjectToCollection
    }), noResults && _react.default.createElement(_notFound.default, {
      name: "any results"
    }));
  }

}

SearchResults.propTypes = {
  api: _propTypes.default.any.isRequired,
  query: _propTypes.default.string.isRequired,
  currentUser: _propTypes.default.object.isRequired
};

const SearchPage = function SearchPage({
  api,
  query
}) {
  return _react.default.createElement(_layout.default, {
    api: api,
    searchQuery: query
  }, _react.default.createElement(_reactHelmet.default, null, !!query && _react.default.createElement("title", null, "Search for ", query)), query ? _react.default.createElement(_errorHandlers.default, null, function (errorFuncs) {
    return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
      return _react.default.createElement(SearchResults, _extends({}, errorFuncs, {
        api: api,
        query: query,
        currentUser: currentUser
      }));
    });
  }) : _react.default.createElement(_notFound.default, {
    name: "anything"
  }), _react.default.createElement(_categories.default, null));
};

SearchPage.propTypes = {
  api: _propTypes.default.any.isRequired,
  query: _propTypes.default.string
};
var _default = SearchPage;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pages/secret.jsx":
/*!*****************************************!*\
  !*** ./src/presenters/pages/secret.jsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactHelmet = _interopRequireDefault(__webpack_require__(/*! react-helmet */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-helmet/5.2.0/node_modules/react-helmet/lib/Helmet.js"));

var _devToggles = __webpack_require__(/*! ../includes/dev-toggles.jsx */ "./src/presenters/includes/dev-toggles.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SecretEffectsOnMount extends _react.default.Component {
  componentDidMount() {
    //try to play the secret sound:
    const audio = new Audio('https://cdn.glitch.com/a5a035b7-e3db-4b07-910a-b5c3ca9d8e86%2Fsecret.mp3?1535396729988');
    const maybePromise = audio.play(); // Chrome returns a promise which we must handle:

    maybePromise && maybePromise.then(function () {// DO-Do Do-do do-dO dO-DO
    }).catch(function () {// This empty catch block prevents an exception from bubbling up.
      // play() will fail if the user hasn't interacted with the dom yet.
      // s'fine, let it.
    });
  }

  render() {
    return null;
  }

}

const SecretPageContainer = function SecretPageContainer() {
  return _react.default.createElement(_devToggles.DevToggles, null, function (enabledToggles, toggleData, setEnabledToggles) {
    return _react.default.createElement(Secret, {
      enabledToggles,
      toggleData,
      setEnabledToggles
    });
  });
};

const Secret = function Secret({
  enabledToggles,
  toggleData,
  setEnabledToggles
}) {
  const toggleTheToggle = function toggleTheToggle(name) {
    let newToggles = null;

    if (isEnabled(name)) {
      newToggles = enabledToggles.filter(function (enabledToggleName) {
        return enabledToggleName !== name;
      });
    } else {
      newToggles = enabledToggles.concat([name]);
    }

    setEnabledToggles(newToggles);
  };

  const isEnabled = function isEnabled(toggleName) {
    return enabledToggles && enabledToggles.includes(toggleName);
  };

  return _react.default.createElement("section", {
    className: "secretPage"
  }, _react.default.createElement("div", {
    className: "filler"
  }), _react.default.createElement(_reactHelmet.default, null, _react.default.createElement("title", null, "Glitch - It's a secret to everybody.")), _react.default.createElement(SecretEffectsOnMount, null), _react.default.createElement("ul", null, toggleData.map(function ({
    name,
    description
  }) {
    return _react.default.createElement("li", {
      key: name
    }, _react.default.createElement("button", {
      title: description,
      onClick: function onClick() {
        return toggleTheToggle(name);
      },
      className: isEnabled(name) ? "lit" : "dark"
    }, name));
  })));
};

Secret.propTypes = {
  toggleData: _propTypes.default.array.isRequired,
  enabledToggles: _propTypes.default.array.isRequired,
  setEnabledToggles: _propTypes.default.func.isRequired
};
var _default = SecretPageContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pages/team-or-user.jsx":
/*!***********************************************!*\
  !*** ./src/presenters/pages/team-or-user.jsx ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.TeamOrUserPage = exports.UserPage = exports.TeamPage = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _loader = __webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx");

var _notFound = _interopRequireDefault(__webpack_require__(/*! ../includes/not-found.jsx */ "./src/presenters/includes/not-found.jsx"));

var _layout = _interopRequireDefault(__webpack_require__(/*! ../layout.jsx */ "./src/presenters/layout.jsx"));

var _team = _interopRequireDefault(__webpack_require__(/*! ./team.jsx */ "./src/presenters/pages/team.jsx"));

var _user = _interopRequireDefault(__webpack_require__(/*! ./user.jsx */ "./src/presenters/pages/user.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const getOrNull = async function getOrNull(api, route) {
  try {
    const {
      data
    } = await api.get(route);
    return data;
  } catch (error) {
    if (error && error.response && error.response.status === 404) {
      return null;
    }

    throw error;
  }
};

const getUserById = async function getUserById(api, id) {
  const user = await getOrNull(api, `/users/${id}`);
  return user;
};

const getUser = async function getUser(api, name) {
  const id = await getOrNull(api, `/userId/byLogin/${name}`);

  if (id === "NOT FOUND") {
    return null;
  }

  return await getUserById(api, id);
};

const parseTeam = function parseTeam(team) {
  const ADMIN_ACCESS_LEVEL = 30;
  const adminIds = team.users.filter(function (user) {
    return user.teamsUser.accessLevel === ADMIN_ACCESS_LEVEL;
  });
  team.adminIds = adminIds.map(function (user) {
    return user.id;
  });
  return team;
};

const getTeamById = async function getTeamById(api, id) {
  const team = await getOrNull(api, `/teams/${id}`);
  return team && parseTeam(team);
};

const getTeam = async function getTeam(api, name) {
  const team = await getOrNull(api, `/teams/byUrl/${name}`);
  return team && parseTeam(team);
};

const TeamPageLoader = function TeamPageLoader(_ref) {
  let {
    api,
    id,
    name
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["api", "id", "name"]);

  return _react.default.createElement(_loader.DataLoader, {
    get: function get() {
      return getTeamById(api, id);
    }
  }, function (team) {
    return team ? _react.default.createElement(_team.default, _extends({
      api: api,
      team: team
    }, props)) : _react.default.createElement(_notFound.default, {
      name: name
    });
  });
};

TeamPageLoader.propTypes = {
  api: _propTypes.default.any.isRequired,
  id: _propTypes.default.number.isRequired,
  name: _propTypes.default.string.isRequired
};

const UserPageLoader = function UserPageLoader(_ref2) {
  let {
    api,
    id,
    name
  } = _ref2,
      props = _objectWithoutPropertiesLoose(_ref2, ["api", "id", "name"]);

  return _react.default.createElement(_loader.DataLoader, {
    get: function get() {
      return getUserById(api, id);
    }
  }, function (user) {
    return user ? _react.default.createElement(_user.default, _extends({
      api: api,
      user: user
    }, props)) : _react.default.createElement(_notFound.default, {
      name: name
    });
  });
};

UserPageLoader.propTypes = {
  api: _propTypes.default.any.isRequired,
  id: _propTypes.default.number.isRequired,
  name: _propTypes.default.string.isRequired
};

const TeamOrUserPageLoader = function TeamOrUserPageLoader(_ref3) {
  let {
    api,
    name
  } = _ref3,
      props = _objectWithoutPropertiesLoose(_ref3, ["api", "name"]);

  return _react.default.createElement(_loader.DataLoader, {
    get: function get() {
      return getTeam(api, name);
    }
  }, function (team) {
    return team ? _react.default.createElement(_team.default, _extends({
      api: api,
      team: team
    }, props)) : _react.default.createElement(_loader.DataLoader, {
      get: function get() {
        return getUser(api, name);
      }
    }, function (user) {
      return user ? _react.default.createElement(_user.default, _extends({
        api: api,
        user: user
      }, props)) : _react.default.createElement(_notFound.default, {
        name: name
      });
    });
  });
};

TeamOrUserPageLoader.propTypes = {
  api: _propTypes.default.any.isRequired,
  name: _propTypes.default.string.isRequired
};

const Presenter = function Presenter(api, Loader, args) {
  return _react.default.createElement(_layout.default, {
    api: api
  }, _react.default.createElement(Loader, _extends({
    api: api
  }, args)));
};

const TeamPagePresenter = function TeamPagePresenter({
  api,
  id,
  name
}) {
  return Presenter(api, TeamPageLoader, {
    id,
    name
  });
};

exports.TeamPage = TeamPagePresenter;

const UserPagePresenter = function UserPagePresenter({
  api,
  id,
  name
}) {
  return Presenter(api, UserPageLoader, {
    id,
    name
  });
};

exports.UserPage = UserPagePresenter;

const TeamOrUserPagePresenter = function TeamOrUserPagePresenter({
  api,
  name
}) {
  return Presenter(api, TeamOrUserPageLoader, {
    name
  });
};

exports.TeamOrUserPage = TeamOrUserPagePresenter;

/***/ }),

/***/ "./src/presenters/pages/team.jsx":
/*!***************************************!*\
  !*** ./src/presenters/pages/team.jsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactHelmet = _interopRequireDefault(__webpack_require__(/*! react-helmet */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-helmet/5.2.0/node_modules/react-helmet/lib/Helmet.js"));

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _currentUser = __webpack_require__(/*! ../current-user */ "./src/presenters/current-user.jsx");

var _loader = __webpack_require__(/*! ../includes/loader */ "./src/presenters/includes/loader.jsx");

var _teamEditor = _interopRequireDefault(__webpack_require__(/*! ../team-editor.jsx */ "./src/presenters/team-editor.jsx"));

var _team = __webpack_require__(/*! ../../models/team */ "./src/models/team.js");

var _descriptionField = __webpack_require__(/*! ../includes/description-field.jsx */ "./src/presenters/includes/description-field.jsx");

var _profile = __webpack_require__(/*! ../includes/profile.jsx */ "./src/presenters/includes/profile.jsx");

var _errorBoundary = _interopRequireDefault(__webpack_require__(/*! ../includes/error-boundary */ "./src/presenters/includes/error-boundary.jsx"));

var _collectionsList = _interopRequireDefault(__webpack_require__(/*! ../collections-list */ "./src/presenters/collections-list.jsx"));

var _editableField = _interopRequireDefault(__webpack_require__(/*! ../includes/editable-field.jsx */ "./src/presenters/includes/editable-field.jsx"));

var _thanks = _interopRequireDefault(__webpack_require__(/*! ../includes/thanks.jsx */ "./src/presenters/includes/thanks.jsx"));

var _nameConflict = _interopRequireDefault(__webpack_require__(/*! ../includes/name-conflict.jsx */ "./src/presenters/includes/name-conflict.jsx"));

var _addTeamProject = _interopRequireDefault(__webpack_require__(/*! ../includes/add-team-project.jsx */ "./src/presenters/includes/add-team-project.jsx"));

var _deleteTeam = _interopRequireDefault(__webpack_require__(/*! ../includes/delete-team.jsx */ "./src/presenters/includes/delete-team.jsx"));

var _teamUsers = __webpack_require__(/*! ../includes/team-users.jsx */ "./src/presenters/includes/team-users.jsx");

var _entityPagePinnedProjects = _interopRequireDefault(__webpack_require__(/*! ../entity-page-pinned-projects.jsx */ "./src/presenters/entity-page-pinned-projects.jsx"));

var _entityPageRecentProjects = _interopRequireDefault(__webpack_require__(/*! ../entity-page-recent-projects.jsx */ "./src/presenters/entity-page-recent-projects.jsx"));

var _projectsLoader = _interopRequireDefault(__webpack_require__(/*! ../projects-loader.jsx */ "./src/presenters/projects-loader.jsx"));

var _teamAnalytics = _interopRequireDefault(__webpack_require__(/*! ../includes/team-analytics.jsx */ "./src/presenters/includes/team-analytics.jsx"));

var _teamElements = __webpack_require__(/*! ../includes/team-elements.jsx */ "./src/presenters/includes/team-elements.jsx");

var _reportAbusePop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/report-abuse-pop.jsx */ "./src/presenters/pop-overs/report-abuse-pop.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function syncPageToUrl(team) {
  history.replaceState(null, null, (0, _team.getLink)(team));
}

const TeamNameUrlFields = function TeamNameUrlFields({
  team,
  updateName,
  updateUrl
}) {
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("h1", null, _react.default.createElement(_editableField.default, {
    value: team.name,
    update: updateName,
    placeholder: "What's its name?",
    suffix: team.isVerified ? _react.default.createElement(_teamElements.VerifiedBadge, null) : null
  })), _react.default.createElement("p", {
    className: "team-url"
  }, _react.default.createElement(_editableField.default, {
    value: team.url,
    update: function update(url) {
      return updateUrl(url).then(function () {
        return syncPageToUrl(Object.assign({}, team, {
          url
        }));
      });
    },
    placeholder: "Short url?",
    prefix: "@"
  })));
};

const TeamPageCollections = function TeamPageCollections({
  collections,
  team,
  api,
  currentUser,
  currentUserIsOnTeam
}) {
  return _react.default.createElement(_collectionsList.default, {
    title: "Collections",
    collections: collections.map(function (collection) {
      return Object.assign({}, collection, {
        team: team
      });
    }),
    api: api,
    maybeCurrentUser: currentUser,
    maybeTeam: team,
    isAuthorized: currentUserIsOnTeam
  });
}; // Team Page


class TeamPage extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.teamAdmins = this.teamAdmins.bind(this);
    this.addProjectToCollection = this.addProjectToCollection.bind(this);
  }

  async addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  getProjectOptions() {
    const projectOptions = {
      addProjectToCollection: this.addProjectToCollection,
      deleteProject: this.props.deleteProject,
      leaveTeamProject: this.props.leaveTeamProject
    };

    if (this.props.currentUserIsOnTeam) {
      projectOptions["removeProjectFromTeam"] = this.props.removeProject;
      projectOptions["joinTeamProject"] = this.props.joinTeamProject;
    }

    return projectOptions;
  }

  teamAdmins() {
    var _this = this;

    return this.props.team.users.filter(function (user) {
      return _this.props.team.adminIds.includes(user.id);
    });
  }

  userCanJoinTeam() {
    const {
      currentUser,
      team
    } = this.props;

    if (!this.props.currentUserIsOnTeam && team.whitelistedDomain && currentUser && currentUser.emails) {
      return currentUser.emails.some(function ({
        email,
        verified
      }) {
        return verified && email.endsWith(`@${team.whitelistedDomain}`);
      });
    }

    return false;
  }

  render() {
    var _this2 = this;

    return _react.default.createElement("main", {
      className: "profile-page team-page"
    }, _react.default.createElement("section", null, _react.default.createElement("a", {
      href: "/teams/",
      target: "_blank",
      className: "beta"
    }, _react.default.createElement("img", {
      src: "https://cdn.glitch.com/0c3ba0da-dac8-4904-bb5e-e1c7acc378a2%2Fbeta-flag.svg?1541448893958",
      alt: ""
    }), _react.default.createElement("div", null, _react.default.createElement("h4", null, "Teams are in beta"), _react.default.createElement("p", null, "Learn More"))), _react.default.createElement(_profile.ProfileContainer, {
      avatarStyle: (0, _team.getAvatarStyle)(Object.assign({}, this.props.team, {
        cache: this.props.team._cacheAvatar
      })),
      coverStyle: (0, _team.getProfileStyle)(Object.assign({}, this.props.team, {
        cache: this.props.team._cacheCover
      })),
      avatarButtons: this.props.currentUserIsTeamAdmin ? _react.default.createElement(_profile.ImageButtons, {
        name: "Avatar",
        uploadImage: this.props.uploadAvatar
      }) : null,
      coverButtons: this.props.currentUserIsTeamAdmin ? _react.default.createElement(_profile.ImageButtons, {
        name: "Cover",
        uploadImage: this.props.uploadCover,
        clearImage: this.props.team.hasCoverImage ? this.props.clearCover : null
      }) : null
    }, this.props.currentUserIsTeamAdmin ? _react.default.createElement(TeamNameUrlFields, {
      team: this.props.team,
      updateName: this.props.updateName,
      updateUrl: this.props.updateUrl
    }) : _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("h1", null, this.props.team.name, " ", this.props.team.isVerified && _react.default.createElement(_teamElements.VerifiedBadge, null)), _react.default.createElement("p", {
      className: "team-url"
    }, "@", this.props.team.url)), _react.default.createElement("div", {
      className: "users-information"
    }, _react.default.createElement(_teamUsers.TeamUsers, _extends({}, this.props, {
      users: this.props.team.users,
      teamId: this.props.team.id,
      adminIds: this.props.team.adminIds
    })), !!this.props.team.whitelistedDomain && _react.default.createElement(_teamUsers.WhitelistedDomain, {
      domain: this.props.team.whitelistedDomain,
      setDomain: this.props.currentUserIsTeamAdmin ? this.props.updateWhitelistedDomain : null
    }), this.props.currentUserIsOnTeam && _react.default.createElement(_teamUsers.AddTeamUser, {
      inviteEmail: this.props.inviteEmail,
      inviteUser: this.props.inviteUser,
      setWhitelistedDomain: this.props.currentUserIsTeamAdmin ? this.props.updateWhitelistedDomain : null,
      members: this.props.team.users.map(function ({
        id
      }) {
        return id;
      }),
      whitelistedDomain: this.props.team.whitelistedDomain,
      api: this.props.api
    }), this.userCanJoinTeam() && _react.default.createElement(_teamUsers.JoinTeam, {
      onClick: this.props.joinTeam
    })), _react.default.createElement(_thanks.default, {
      count: this.props.team.users.reduce(function (total, {
        thanksCount
      }) {
        return total + thanksCount;
      }, 0)
    }), _react.default.createElement(_descriptionField.AuthDescription, {
      authorized: this.props.currentUserIsTeamAdmin,
      description: this.props.team.description,
      update: this.props.updateDescription,
      placeholder: "Tell us about your team"
    }))), _react.default.createElement(_errorBoundary.default, null, _react.default.createElement(_addTeamProject.default, _extends({}, this.props, {
      teamProjects: this.props.team.projects,
      api: this.props.api
    }))), _react.default.createElement(_entityPagePinnedProjects.default, {
      projects: this.props.team.projects,
      pins: this.props.team.teamPins,
      isAuthorized: this.props.currentUserIsOnTeam,
      removePin: this.props.removePin,
      projectOptions: this.getProjectOptions(),
      api: this.props.api
    }), _react.default.createElement(_entityPageRecentProjects.default, {
      projects: this.props.team.projects,
      pins: this.props.team.teamPins,
      isAuthorized: this.props.currentUserIsOnTeam,
      addPin: this.props.addPin,
      projectOptions: this.getProjectOptions(),
      api: this.props.api
    }), this.props.team.projects.length === 0 && this.props.currentUserIsOnTeam && _react.default.createElement("aside", {
      className: "inline-banners add-project-to-empty-team-banner"
    }, _react.default.createElement("div", {
      className: "description-container"
    }, _react.default.createElement("img", {
      className: "project-pals",
      src: "https://cdn.glitch.com/02ae6077-549b-429d-85bc-682e0e3ced5c%2Fcollaborate.svg?1540583258925",
      alt: ""
    }), _react.default.createElement("div", {
      className: "description"
    }, "Add projects to share them with your team"))), _react.default.createElement(_errorBoundary.default, null, _react.default.createElement(_loader.DataLoader, {
      get: function get() {
        return _this2.props.api.get(`collections?teamId=${_this2.props.team.id}`);
      },
      renderLoader: function renderLoader() {
        return _react.default.createElement(TeamPageCollections, _extends({}, _this2.props, {
          collections: _this2.props.team.collections
        }));
      }
    }, function ({
      data
    }) {
      return _react.default.createElement(TeamPageCollections, _extends({}, _this2.props, {
        collections: data
      }));
    })), this.props.currentUserIsOnTeam && _react.default.createElement(_errorBoundary.default, null, _react.default.createElement(_teamAnalytics.default, {
      api: this.props.api,
      id: this.props.team.id,
      currentUserIsOnTeam: this.props.currentUserIsOnTeam,
      projects: this.props.team.projects,
      addProject: this.props.addProject,
      myProjects: this.props.currentUser ? this.props.currentUser.projects : []
    })), this.props.currentUserIsTeamAdmin && _react.default.createElement(_deleteTeam.default, {
      api: function api() {
        return _this2.props.api;
      },
      teamId: this.props.team.id,
      teamName: this.props.team.name,
      teamAdmins: this.teamAdmins(),
      users: this.props.team.users
    }), !this.props.currentUserIsOnTeam && _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_reportAbusePop.default, {
      reportedType: "team",
      reportedModel: this.props.team
    }), _react.default.createElement(_teamElements.TeamMarketing, null)));
  }

}

TeamPage.propTypes = {
  team: _propTypes.default.shape({
    _cacheAvatar: _propTypes.default.number.isRequired,
    _cacheCover: _propTypes.default.number.isRequired,
    adminIds: _propTypes.default.array.isRequired,
    backgroundColor: _propTypes.default.string.isRequired,
    coverColor: _propTypes.default.string.isRequired,
    description: _propTypes.default.string.isRequired,
    hasAvatarImage: _propTypes.default.bool.isRequired,
    hasCoverImage: _propTypes.default.bool.isRequired,
    id: _propTypes.default.number.isRequired,
    isVerified: _propTypes.default.bool.isRequired,
    name: _propTypes.default.string.isRequired,
    projects: _propTypes.default.array.isRequired,
    teamPins: _propTypes.default.array.isRequired,
    users: _propTypes.default.array.isRequired,
    whitelistedDomain: _propTypes.default.string
  }),
  addPin: _propTypes.default.func.isRequired,
  addProject: _propTypes.default.func.isRequired,
  deleteProject: _propTypes.default.func.isRequired,
  updateWhitelistedDomain: _propTypes.default.func.isRequired,
  inviteEmail: _propTypes.default.func.isRequired,
  inviteUser: _propTypes.default.func.isRequired,
  api: _propTypes.default.func.isRequired,
  clearCover: _propTypes.default.func.isRequired,
  currentUser: _propTypes.default.object,
  currentUserIsOnTeam: _propTypes.default.bool.isRequired,
  currentUserIsTeamAdmin: _propTypes.default.bool.isRequired,
  removeUserFromTeam: _propTypes.default.func.isRequired,
  removePin: _propTypes.default.func.isRequired,
  removeProject: _propTypes.default.func.isRequired,
  updateName: _propTypes.default.func.isRequired,
  updateUrl: _propTypes.default.func.isRequired,
  updateDescription: _propTypes.default.func.isRequired,
  uploadAvatar: _propTypes.default.func.isRequired,
  uploadCover: _propTypes.default.func.isRequired
};

const teamConflictsWithUser = function teamConflictsWithUser(team, currentUser) {
  if (currentUser && currentUser.login) {
    return currentUser.login.toLowerCase() === team.url;
  }

  return false;
};

const TeamNameConflict = function TeamNameConflict({
  team
}) {
  return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
    return teamConflictsWithUser(team, currentUser) && _react.default.createElement(_nameConflict.default, null);
  });
};

const TeamPageEditor = function TeamPageEditor({
  api,
  initialTeam,
  children
}) {
  return _react.default.createElement(_teamEditor.default, {
    api: api,
    initialTeam: initialTeam
  }, function (team, funcs, ...args) {
    return _react.default.createElement(_projectsLoader.default, {
      api: api,
      projects: team.projects
    }, function (projects, reloadProjects) {
      // Inject page specific changes to the editor
      // Mainly url updating and calls to reloadProjects
      const removeUserFromTeam = async function removeUserFromTeam(user, projectIds) {
        await funcs.removeUserFromTeam(user, projectIds);
        reloadProjects(...projectIds);
      };

      const joinTeamProject = async function joinTeamProject(projectId) {
        await funcs.joinTeamProject(projectId);
        reloadProjects(projectId);
      };

      const leaveTeamProject = async function leaveTeamProject(projectId) {
        await funcs.leaveTeamProject(projectId);
        reloadProjects(projectId);
      };

      return children(Object.assign({}, team, {
        projects
      }), Object.assign({}, funcs, {
        removeUserFromTeam,
        joinTeamProject,
        leaveTeamProject
      }), ...args);
    });
  });
};

const TeamPageContainer = function TeamPageContainer(_ref) {
  let {
    api,
    team
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["api", "team"]);

  return _react.default.createElement(_analytics.AnalyticsContext, {
    properties: {
      origin: 'team'
    },
    context: {
      groupId: team.id.toString()
    }
  }, _react.default.createElement(TeamPageEditor, {
    api: api,
    initialTeam: team
  }, function (team, funcs, currentUserIsOnTeam, currentUserIsTeamAdmin) {
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_reactHelmet.default, null, _react.default.createElement("title", null, team.name)), _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
      return _react.default.createElement(TeamPage, _extends({
        api: api,
        team: team
      }, funcs, {
        currentUser: currentUser,
        currentUserIsOnTeam: currentUserIsOnTeam,
        currentUserIsTeamAdmin: currentUserIsTeamAdmin
      }, props));
    }), _react.default.createElement(TeamNameConflict, {
      team: team
    }));
  }));
};

var _default = TeamPageContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pages/user.jsx":
/*!***************************************!*\
  !*** ./src/presenters/pages/user.jsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactHelmet = _interopRequireDefault(__webpack_require__(/*! react-helmet */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-helmet/5.2.0/node_modules/react-helmet/lib/Helmet.js"));

var _user = __webpack_require__(/*! ../../models/user */ "./src/models/user.js");

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

var _descriptionField = __webpack_require__(/*! ../includes/description-field.jsx */ "./src/presenters/includes/description-field.jsx");

var _editableField = _interopRequireDefault(__webpack_require__(/*! ../includes/editable-field.jsx */ "./src/presenters/includes/editable-field.jsx"));

var _userEditor = _interopRequireDefault(__webpack_require__(/*! ../user-editor.jsx */ "./src/presenters/user-editor.jsx"));

var _thanks = _interopRequireDefault(__webpack_require__(/*! ../includes/thanks.jsx */ "./src/presenters/includes/thanks.jsx"));

var _deletedProjects2 = _interopRequireDefault(__webpack_require__(/*! ../deleted-projects.jsx */ "./src/presenters/deleted-projects.jsx"));

var _entityPagePinnedProjects = _interopRequireDefault(__webpack_require__(/*! ../entity-page-pinned-projects.jsx */ "./src/presenters/entity-page-pinned-projects.jsx"));

var _entityPageRecentProjects = _interopRequireDefault(__webpack_require__(/*! ../entity-page-recent-projects.jsx */ "./src/presenters/entity-page-recent-projects.jsx"));

var _collectionsList = _interopRequireDefault(__webpack_require__(/*! ../collections-list.jsx */ "./src/presenters/collections-list.jsx"));

var _profile = __webpack_require__(/*! ../includes/profile.jsx */ "./src/presenters/includes/profile.jsx");

var _projectsLoader = _interopRequireDefault(__webpack_require__(/*! ../projects-loader.jsx */ "./src/presenters/projects-loader.jsx"));

var _reportAbusePop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/report-abuse-pop.jsx */ "./src/presenters/pop-overs/report-abuse-pop.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function syncPageToLogin(login) {
  history.replaceState(null, null, (0, _user.getLink)({
    login
  }));
}

const NameAndLogin = function NameAndLogin({
  name,
  login,
  isAuthorized,
  updateName,
  updateLogin
}) {
  if (!login) {
    return _react.default.createElement("h1", {
      className: "login"
    }, "Anonymous");
  }

  if (!isAuthorized) {
    if (!name) {
      return _react.default.createElement("h1", {
        className: "login"
      }, "@", login);
    }

    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("h1", {
      className: "username"
    }, name), _react.default.createElement("h2", {
      className: "login"
    }, "@", login));
  }

  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("h1", {
    className: "username"
  }, _react.default.createElement(_editableField.default, {
    value: name || "",
    update: updateName,
    placeholder: "What's your name?"
  })), _react.default.createElement("h2", {
    className: "login"
  }, _react.default.createElement(_editableField.default, {
    value: login,
    update: updateLogin,
    prefix: "@",
    placeholder: "Nickname?"
  })));
};

NameAndLogin.propTypes = {
  name: _propTypes.default.string,
  login: _propTypes.default.string,
  isAuthorized: _propTypes.default.bool.isRequired,
  updateName: _propTypes.default.func,
  updateLogin: _propTypes.default.func
};

const UserPage = function UserPage(_ref) {
  let {
    user: {
      //has science gone too far?
      _deletedProjects,
      _cacheCover
    },
    api,
    isAuthorized,
    maybeCurrentUser,
    updateDescription,
    updateName,
    updateLogin: _updateLogin,
    uploadCover,
    clearCover,
    uploadAvatar,
    addPin,
    removePin,
    leaveProject,
    deleteProject,
    undeleteProject,
    setDeletedProjects,
    addProjectToCollection
  } = _ref,
      user = _objectWithoutPropertiesLoose(_ref.user, ["_deletedProjects", "_cacheCover"]);

  return _react.default.createElement("main", {
    className: "profile-page user-page"
  }, _react.default.createElement("section", null, _react.default.createElement(_profile.ProfileContainer, {
    avatarStyle: (0, _user.getAvatarStyle)(user),
    coverStyle: (0, _user.getProfileStyle)(Object.assign({}, user, {
      cache: _cacheCover
    })),
    coverButtons: isAuthorized && !!user.login && _react.default.createElement(_profile.ImageButtons, {
      name: "Cover",
      uploadImage: uploadCover,
      clearImage: user.hasCoverImage ? clearCover : null
    }),
    avatarButtons: isAuthorized && !!user.login && _react.default.createElement(_profile.ImageButtons, {
      name: "Avatar",
      uploadImage: uploadAvatar
    }),
    teams: user.teams
  }, _react.default.createElement(NameAndLogin, _extends({
    name: user.name,
    login: user.login
  }, {
    isAuthorized,
    updateName
  }, {
    updateLogin: function updateLogin(login) {
      return _updateLogin(login).then(function () {
        return syncPageToLogin(login);
      });
    }
  })), !!user.thanksCount && _react.default.createElement(_thanks.default, {
    count: user.thanksCount
  }), _react.default.createElement(_descriptionField.AuthDescription, {
    authorized: isAuthorized && !!user.login,
    description: user.description,
    update: updateDescription,
    placeholder: "Tell us about yourself"
  }))), _react.default.createElement(_entityPagePinnedProjects.default, {
    projects: user.projects,
    pins: user.pins,
    isAuthorized: isAuthorized,
    api: api,
    removePin: removePin,
    projectOptions: {
      leaveProject,
      deleteProject,
      addProjectToCollection
    }
  }), !!user.login && _react.default.createElement(_collectionsList.default, {
    title: "Collections",
    collections: user.collections.map(function (collection) {
      return Object.assign({}, collection, {
        user
      });
    }),
    api: api,
    isAuthorized: isAuthorized,
    maybeCurrentUser: maybeCurrentUser
  }), _react.default.createElement(_entityPageRecentProjects.default, {
    projects: user.projects,
    pins: user.pins,
    isAuthorized: isAuthorized,
    api: api,
    addPin: addPin,
    projectOptions: {
      leaveProject,
      deleteProject,
      addProjectToCollection
    }
  }), isAuthorized && _react.default.createElement(_deletedProjects2.default, {
    api: api,
    setDeletedProjects: setDeletedProjects,
    deletedProjects: _deletedProjects,
    undelete: undeleteProject
  }), !isAuthorized && _react.default.createElement(_reportAbusePop.default, {
    reportedType: "user",
    reportedModel: user
  }));
};

UserPage.propTypes = {
  clearCover: _propTypes.default.func.isRequired,
  maybeCurrentUser: _propTypes.default.object,
  isAuthorized: _propTypes.default.bool.isRequired,
  leaveProject: _propTypes.default.func.isRequired,
  uploadAvatar: _propTypes.default.func.isRequired,
  uploadCover: _propTypes.default.func.isRequired,
  user: _propTypes.default.shape({
    name: _propTypes.default.string,
    login: _propTypes.default.string,
    id: _propTypes.default.number.isRequired,
    thanksCount: _propTypes.default.number.isRequired,
    hasCoverImage: _propTypes.default.bool.isRequired,
    avatarUrl: _propTypes.default.string,
    color: _propTypes.default.string.isRequired,
    coverColor: _propTypes.default.string,
    _cacheCover: _propTypes.default.number.isRequired,
    _deletedProjects: _propTypes.default.array.isRequired
  }).isRequired,
  addProjectToCollection: _propTypes.default.func.isRequired
};

const UserPageContainer = function UserPageContainer({
  api,
  user
}) {
  return _react.default.createElement(_analytics.AnalyticsContext, {
    properties: {
      origin: 'user'
    }
  }, _react.default.createElement(_userEditor.default, {
    api: api,
    initialUser: user
  }, function (user, funcs, isAuthorized) {
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_reactHelmet.default, null, _react.default.createElement("title", null, user.name || (user.login ? `@${user.login}` : `User ${user.id}`))), _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (maybeCurrentUser) {
      return _react.default.createElement(_projectsLoader.default, {
        api: api,
        projects: user.projects
      }, function (projects) {
        return _react.default.createElement(UserPage, _extends({
          api,
          isAuthorized,
          maybeCurrentUser
        }, {
          user: Object.assign({}, user, {
            projects
          })
        }, funcs));
      });
    }));
  }));
};

var _default = UserPageContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/add-collection-project-pop.jsx":
/*!*****************************************************************!*\
  !*** ./src/presenters/pop-overs/add-collection-project-pop.jsx ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _debounce2 = _interopRequireDefault(__webpack_require__(/*! lodash/debounce */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/debounce.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _loader = _interopRequireDefault(__webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx"));

var _projectResultItem = _interopRequireDefault(__webpack_require__(/*! ../includes/project-result-item.jsx */ "./src/presenters/includes/project-result-item.jsx"));

var _projectsLoader = _interopRequireDefault(__webpack_require__(/*! ../projects-loader.jsx */ "./src/presenters/projects-loader.jsx"));

var _notifications = _interopRequireDefault(__webpack_require__(/*! ../notifications.jsx */ "./src/presenters/notifications.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// add-collection-project-pop.jsx -> Add a project to a collection via the collection page
const ProjectResultsUL = function ProjectResultsUL({
  projects,
  collection,
  onClick: _onClick
}) {
  return _react.default.createElement("ul", {
    className: "results"
  }, projects.map(function (project) {
    return _react.default.createElement(_notifications.default, {
      key: project.id
    }, function ({
      createNotification
    }) {
      return _react.default.createElement("li", null, _react.default.createElement(_analytics.TrackClick, {
        name: "Project Added to Collection",
        properties: {
          origin: 'Add Project collection'
        }
      }, _react.default.createElement(_projectResultItem.default, {
        domain: project.domain,
        description: project.description,
        users: project.users,
        id: project.id,
        isActive: false,
        collection: collection,
        onClick: function onClick() {
          return _onClick(project, collection, createNotification);
        },
        isPrivate: project.private
      })));
    });
  }));
};

ProjectResultsUL.propTypes = {
  projects: _propTypes.default.array.isRequired,
  collection: _propTypes.default.object.isRequired,
  onClick: _propTypes.default.func.isRequired
};

const ProjectSearchResults = function ProjectSearchResults({
  projects,
  collection,
  onClick,
  projectName,
  excludedProjectsCount
}) {
  if (projects.length > 0) {
    const collectionProjectIds = collection.projects.map(function (project) {
      return project.id;
    });
    projects = projects.filter(function (project) {
      return !collectionProjectIds.includes(project.id);
    });
    return _react.default.createElement(ProjectResultsUL, {
      projects,
      collection,
      onClick
    });
  }

  if (projectName) {
    return _react.default.createElement("p", {
      className: "results-empty"
    }, projectName, " is already in this collection", _react.default.createElement("span", {
      role: "img",
      "aria-label": ""
    }, "\uD83D\uDCAB"));
  }

  return _react.default.createElement("p", {
    className: "results-empty"
  }, "nothing found ", _react.default.createElement("span", {
    role: "img",
    "aria-label": ""
  }, "\uD83D\uDCAB"), _react.default.createElement("br", null), excludedProjectsCount > 0 && _react.default.createElement("span", null, "(Excluded ", excludedProjectsCount, " search ", excludedProjectsCount > 1 ? "results" : "result", " already found in collection)"));
};

ProjectSearchResults.propTypes = {
  collection: _propTypes.default.object.isRequired,
  projectName: _propTypes.default.string,
  excludedProjectsCount: _propTypes.default.number
};

function isUrl(s) {
  try {
    new URL(s);
    return true;
  } catch (_) {
    return false;
  }
}

class AddCollectionProjectPop extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      //The actual search text
      maybeRequest: null,
      //The active request promise
      maybeResults: null,
      //Null means still waiting vs empty,
      projectName: '',
      // the project name if the search result is a Url
      excludedProjectsCount: 0 // number of projects omitted from search

    };
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.startSearch = (0, _debounce2.default)(this.startSearch.bind(this), 300);
    this.onClick = this.onClick.bind(this);
  }

  handleChange(evt) {
    const query = evt.currentTarget.value.trim();
    this.setState({
      query
    });

    if (query) {
      this.startSearch();
    } else {
      this.clearSearch();
    }
  }

  clearSearch() {
    this.setState({
      maybeRequest: null,
      maybeResults: null,
      projectName: '',
      excludedProjectsCount: 0
    });
  }

  async startSearch() {
    if (!this.state.query) {
      return this.clearSearch();
    } // reset the results


    this.setState({
      maybeResults: null
    });
    let searchByUrl = false;
    let query = this.state.query;
    const collectionProjectIds = this.props.collection.projects.map(function (project) {
      return project.id;
    });

    if (isUrl(query)) {
      searchByUrl = true; // check if the query is a URL or a name of a project
      // Project URL pattern: https://add-to-alexa.glitch.me/, https://glitch.com/~add-to-alexa

      let queryUrl = new URL(query);

      if (queryUrl.href.includes("me") && !queryUrl.href.includes("~")) {
        // https://add-to-alexa.glitch.me/
        query = queryUrl.hostname.substring(0, queryUrl.hostname.indexOf('.'));
      } else {
        // https://glitch.com/~add-to-alexa
        query = queryUrl.pathname.substring(queryUrl.pathname.indexOf("~") + 1);
      }
    }

    let request = null;

    if (!searchByUrl) {
      request = this.props.api.get(`projects/search?q=${query}`);
      this.setState({
        maybeRequest: request
      });
    } else {
      request = this.props.api.get(`projects/${query}`);
      this.setState({
        maybeRequest: request
      });
    }

    let {
      data
    } = await request;

    if (searchByUrl) {
      data = [data];
    }

    const results = data;
    let originalNumResults = results.length;
    let nonCollectionResults = [];

    if (searchByUrl) {
      // get the single result that matches the URL exactly - check with https://community.glitch.me/
      nonCollectionResults = results.filter(function (result) {
        return result.domain == query;
      }); // check if the project is already in the collection

      if (nonCollectionResults.length > 0 && collectionProjectIds.includes(nonCollectionResults[0].id)) {
        nonCollectionResults = [];
        this.setState({
          projectName: query
        });
      }
    } else {
      // user is searching by project name  - filter out any projects currently in the collection
      nonCollectionResults = results.filter(function (result) {
        return !collectionProjectIds.includes(result.id);
      });

      if (nonCollectionResults.length !== originalNumResults) {
        if (originalNumResults === 1) {
          // the single search result is already in the collection
          this.setState({
            projectName: query
          });
        } else {
          // multiple projects have been excluded from the search results
          this.setState({
            excludedProjectsCount: originalNumResults
          });
        }
      }
    }

    this.setState(function ({
      maybeRequest
    }) {
      return request === maybeRequest ? {
        maybeRequest: null,
        maybeResults: nonCollectionResults,
        recentProjects: null
      } : {};
    });
  }

  onClick(project, collection, createNotification) {
    this.props.togglePopover(); // add project to page if successful

    this.props.addProjectToCollection(project, collection); // show notification

    createNotification(_react.default.createElement("p", null, "Added ", _react.default.createElement("b", null, _react.default.createElement("span", {
      className: "project-name"
    }, project.domain))), "notifySuccess");
  }

  render() {
    var _this = this;

    // load user's recent projects
    const ownProjects = this.props.collection.team ? this.props.collection.team.projects : this.props.currentUser.projects;
    const results = this.state.query ? this.state.maybeResults : ownProjects.slice(0, 20);
    const showResults = !!(this.state.query || results && results.length);
    const isLoading = !!(this.state.maybeRequest || !results);
    return _react.default.createElement("dialog", {
      className: "pop-over add-collection-project-pop wide-pop"
    }, _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("input", {
      autoFocus: true // eslint-disable-line jsx-a11y/no-autofocus
      ,
      value: this.state.query,
      onChange: this.handleChange,
      className: "pop-over-input search-input pop-over-search",
      placeholder: "Search by project name or URL"
    })), showResults && _react.default.createElement("section", {
      className: "pop-over-actions last-section results-list"
    }, isLoading && _react.default.createElement(_loader.default, null), !!results && _react.default.createElement(_projectsLoader.default, {
      api: this.props.api,
      projects: results
    }, function (projects) {
      return _react.default.createElement(ProjectSearchResults, {
        projects: projects,
        onClick: _this.onClick,
        collection: _this.props.collection,
        projectName: _this.state.projectName,
        excludedProjectsCount: _this.state.excludedProjectsCount
      });
    })));
  }

}

AddCollectionProjectPop.propTypes = {
  api: _propTypes.default.func.isRequired,
  collection: _propTypes.default.object.isRequired,
  addProjectToCollection: _propTypes.default.func.isRequired,
  togglePopover: _propTypes.default.func,
  // required but added dynamically
  currentUser: _propTypes.default.object.isRequired
};
var _default = AddCollectionProjectPop;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/add-project-to-collection-pop.jsx":
/*!********************************************************************!*\
  !*** ./src/presenters/pop-overs/add-project-to-collection-pop.jsx ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _orderBy2 = _interopRequireDefault(__webpack_require__(/*! lodash/orderBy */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/orderBy.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _popoverNested = __webpack_require__(/*! ./popover-nested */ "./src/presenters/pop-overs/popover-nested.jsx");

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _project = __webpack_require__(/*! ../../models/project */ "./src/models/project.js");

var _loader = _interopRequireDefault(__webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx"));

var _collectionResultItem = _interopRequireDefault(__webpack_require__(/*! ../includes/collection-result-item.jsx */ "./src/presenters/includes/collection-result-item.jsx"));

var _createCollectionPop = _interopRequireDefault(__webpack_require__(/*! ./create-collection-pop.jsx */ "./src/presenters/pop-overs/create-collection-pop.jsx"));

var _popoverNested2 = __webpack_require__(/*! ./popover-nested.jsx */ "./src/presenters/pop-overs/popover-nested.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class AddProjectToCollectionPopContents extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      // value of filter input field
      collections: this.props.collections,
      filteredCollections: this.props.collections // collections filtered from search query

    };
    this.updateFilter = this.updateFilter.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collections !== this.props.collections) {
      this.setState({
        collections: nextProps.collections,
        filteredCollections: nextProps.collections
      });
    }
  }

  updateFilter(query) {
    query = query.toLowerCase().trim();
    let filteredCollections = this.props.collections.filter(function (collection) {
      return collection.name.toLowerCase().includes(query);
    });
    this.setState({
      filteredCollections: filteredCollections,
      query: query
    });
  }

  render() {
    var _this = this;

    const {
      filteredCollections,
      query
    } = this.state;

    const NoSearchResultsPlaceholder = _react.default.createElement("p", {
      className: "info-description"
    }, "No matching collections found \u2013\xA0add to a new one?");

    const NoCollectionPlaceholder = _react.default.createElement("p", {
      className: "info-description"
    }, "Create collections to organize your favorite projects.");

    return _react.default.createElement("dialog", {
      className: "pop-over add-project-to-collection-pop wide-pop"
    }, !this.props.fromProject && _react.default.createElement(_popoverNested2.NestedPopoverTitle, null, _react.default.createElement("img", {
      src: (0, _project.getAvatarUrl)(this.props.project.id),
      alt: `Project avatar for ${this.props.project.domain}`
    }), " Add ", this.props.project.domain, " to collection"), this.props.collections ? _react.default.createElement(_react.default.Fragment, null, this.props.collections.length > 3 && _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("input", {
      id: "collection-filter",
      className: "pop-over-input search-input pop-over-search",
      onChange: function onChange(evt) {
        _this.updateFilter(evt.target.value);
      },
      placeholder: "Filter collections"
    })), filteredCollections && filteredCollections.length ? _react.default.createElement("section", {
      className: "pop-over-actions results-list"
    }, _react.default.createElement("ul", {
      className: "results"
    }, filteredCollections.map(function (collection) {
      return (// filter out collections that already contain the selected project
        collection.projects && collection.projects.every(function (project) {
          return project.id !== _this.props.project.id;
        }) && _react.default.createElement("li", {
          key: collection.id
        }, _react.default.createElement(_analytics.TrackClick, {
          name: "Project Added to Collection",
          context: {
            groupId: collection.team ? collection.team.id : 0
          }
        }, _react.default.createElement(_collectionResultItem.default, {
          api: _this.props.api,
          onClick: _this.props.addProjectToCollection,
          project: _this.props.project,
          collection: collection,
          togglePopover: _this.props.togglePopover,
          currentUser: _this.props.currentUser
        })))
      );
    }))) : _react.default.createElement("section", {
      className: "pop-over-info"
    }, query ? NoSearchResultsPlaceholder : NoCollectionPlaceholder), _react.default.createElement("section", {
      className: "pop-over-actions"
    }, _react.default.createElement("button", {
      className: "create-new-collection button-small button-tertiary",
      onClick: this.props.createCollectionPopover
    }, "Add to a new collection"))) : _react.default.createElement("div", {
      className: "loader-container"
    }, _react.default.createElement(_loader.default, null)));
  }

}

AddProjectToCollectionPopContents.propTypes = {
  addProjectToCollection: _propTypes.default.func,
  collections: _propTypes.default.array,
  api: _propTypes.default.func.isRequired,
  currentUser: _propTypes.default.object,
  togglePopover: _propTypes.default.func,
  // required but added dynamically
  project: _propTypes.default.object.isRequired,
  fromProject: _propTypes.default.bool
};

class AddProjectToCollectionPop extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      maybeCollections: null // null means still loading

    };
  }

  async loadCollections() {
    var _this2 = this;

    // first, load all of the user's collections
    const userCollections = await this.props.api.get(`collections/?userId=${this.props.currentUser.id}`); // add current user as owner for collection (for generating user avatar for collection result item)

    userCollections.data.forEach(function (userCollection) {
      userCollection.owner = _this2.props.currentUser;
    }); // next load all of the user's team's collections

    const userTeams = this.props.currentUser.teams;

    for (const team of userTeams) {
      const {
        data
      } = await this.props.api.get(`collections/?teamId=${team.id}`);
      const teamCollections = data;

      if (teamCollections) {
        teamCollections.forEach(function (teamCollection) {
          teamCollection.owner = _this2.props.currentUser.teams.find(function (userTeam) {
            return userTeam.id == team.id;
          });
          userCollections.data.push(teamCollection);
        });
      }
    } // order reverse chronological


    let orderedCollections = (0, _orderBy2.default)(userCollections.data, function (collection) {
      return collection.updatedAt;
    }).reverse();
    this.setState({
      maybeCollections: orderedCollections
    });
  }

  async componentDidMount() {
    this.loadCollections();
  }

  render() {
    var _this3 = this;

    return _react.default.createElement(_popoverNested.NestedPopover, {
      alternateContent: function alternateContent() {
        return _react.default.createElement(_createCollectionPop.default, _extends({}, _this3.props, {
          api: _this3.props.api,
          collections: _this3.state.maybeCollections,
          togglePopover: _this3.props.togglePopover
        }));
      },
      startAlternateVisible: false
    }, function (createCollectionPopover) {
      return _react.default.createElement(AddProjectToCollectionPopContents, _extends({}, _this3.props, {
        collections: _this3.state.maybeCollections,
        createCollectionPopover: createCollectionPopover
      }));
    });
  }

}

AddProjectToCollectionPop.propTypes = {
  api: _propTypes.default.func.isRequired,
  currentUser: _propTypes.default.object
};
var _default = AddProjectToCollectionPop;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/add-team-project-pop.jsx":
/*!***********************************************************!*\
  !*** ./src/presenters/pop-overs/add-team-project-pop.jsx ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.AddTeamProjectPop = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

var _projectResultItem = _interopRequireDefault(__webpack_require__(/*! ../includes/project-result-item.jsx */ "./src/presenters/includes/project-result-item.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class AddTeamProjectPop extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      templateProjects: [],
      filteredProjects: [],
      source: 'my-projects',
      // my-projects, templates
      filterPlaceholder: 'Filter my projects',
      loadingTemplates: false,
      notifyTemplateIsRemixing: false
    };
    this.onClick = this.onClick.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.filterInputIsBlank = this.filterInputIsBlank.bind(this);
    this.filterInput = _react.default.createRef();
  }

  normalizeTemplateProjects(data) {
    let projects = data.map(function (project) {
      project.users = [];
      return project;
    });
    return projects;
  }

  updateFilter(query) {
    let projects = [];

    if (this.state.source === 'templates') {
      projects = this.state.templateProjects;
    } else {
      projects = this.props.myProjects;
    }

    let filteredProjects = this.filterProjects(query, projects, this.props.teamProjects);
    this.setState({
      filteredProjects: filteredProjects
    });
  }

  filterProjects(query, projects, teamProjects) {
    query = query.toLowerCase().trim();
    let MAX_PROJECTS = 20;
    let teamProjectIds = teamProjects.map(function ({
      id
    }) {
      return id;
    });
    let availableProjects = projects.filter(function ({
      id
    }) {
      return !teamProjectIds.includes(id);
    });
    let filteredProjects = [];

    if (!query) {
      return availableProjects.splice(0, MAX_PROJECTS);
    }

    for (let project of availableProjects) {
      if (filteredProjects.length > MAX_PROJECTS) {
        break;
      }

      let titleMatch = project.domain.toLowerCase().includes(query);
      let descMatch = project.description.toLowerCase().includes(query);

      if (titleMatch || descMatch) {
        filteredProjects.push(project);
      }
    }

    return filteredProjects;
  }

  activeIfSourceIsTemplates() {
    if (this.state.source === 'templates') {
      return 'active';
    }
  }

  activeIfSourceIsMyProjects() {
    if (this.state.source === 'my-projects') {
      return 'active';
    }
  }

  async remixTemplate(projectId) {
    let remixTemplatePath = `projects/${projectId}/remix`;
    return await this.props.api.post(remixTemplatePath);
  }

  async inviteUserToRemix(data) {
    let inviteUserPath = `projects/${data.inviteToken}/join`;
    return await this.props.api.post(inviteUserPath);
  }

  onClick(event, project) {
    event.preventDefault();
    this.props.togglePopover();
    this.props.addProject(project);
  }

  sourceIsTemplates() {
    this.setState({
      source: 'templates',
      filterPlaceholder: 'Filter templates'
    });
  }

  sourceIsMyProjects() {
    this.setState({
      source: 'my-projects',
      filterPlaceholder: 'Filter projects'
    });
  }

  getTemplateProjects() {
    var _this = this;

    this.setState({
      loadingTemplates: true
    });
    const templateIds = ['9cd48134-1624-48f5-beaf-6c1b68bd9217', // 'timelink'
    '712cc905-bfcb-454e-a47a-c729ab63c455', // 'poller'
    '929980a8-32fc-4ae7-a66f-dddb3ae4912c'];
    let projectsPath = `projects/byIds?ids=${templateIds.join(',')}`;
    this.props.api.get(projectsPath).then(function ({
      data
    }) {
      let projects = _this.normalizeTemplateProjects(data);

      _this.setState({
        templateProjects: projects,
        loadingTemplates: false
      });

      _this.updateFilter('');
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.source !== this.state.source) {
      this.updateFilter("");
      this.filterInput.current.focus();
    }
  }

  componentDidMount() {
    this.getTemplateProjects();
    this.filterInput.current.focus();
    this.updateFilter("");
  }

  filterInputIsBlank() {
    if (this.filterInput.current.value.length === 0) {
      return true;
    }
  }

  render() {
    var _this2 = this;

    const filteredProjects = this.state.filteredProjects;
    return _react.default.createElement("dialog", {
      className: "pop-over add-team-project-pop wide-pop"
    }, _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("input", {
      ref: this.filterInput,
      onChange: function onChange(event) {
        _this2.updateFilter(event.target.value);
      },
      id: "team-project-search",
      className: "pop-over-input search-input pop-over-search",
      placeholder: this.state.filterPlaceholder,
      autoFocus: true // eslint-disable-line jsx-a11y/no-autofocus

    })), _react.default.createElement("section", {
      className: "pop-over-actions results-list",
      "data-source": "templates"
    }, _react.default.createElement("ul", {
      className: "results"
    }, filteredProjects.map(function (project) {
      return _react.default.createElement("li", {
        key: project.id
      }, _react.default.createElement(_projectResultItem.default, _extends({
        onClick: function onClick(event) {
          return _this2.onClick(event, project);
        }
      }, project, {
        title: project.domain,
        isPrivate: project.private
      })));
    })), this.state.filteredProjects.length === 0 && this.filterInputIsBlank && _react.default.createElement("p", {
      className: "action-description no-projects-description"
    }, "Create or Join projects to add them to the team")));
  }

}

exports.AddTeamProjectPop = AddTeamProjectPop;
AddTeamProjectPop.propTypes = {
  myProjects: _propTypes.default.array.isRequired,
  teamProjects: _propTypes.default.array.isRequired,
  addProject: _propTypes.default.func.isRequired,
  togglePopover: _propTypes.default.func.isRequired,
  api: _propTypes.default.any.isRequired
};

const AddTeamProjectPopContainer = function AddTeamProjectPopContainer(props) {
  return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
    return _react.default.createElement(AddTeamProjectPop, _extends({
      myProjects: currentUser.projects
    }, props));
  });
};

var _default = AddTeamProjectPopContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/add-team-user-pop.jsx":
/*!********************************************************!*\
  !*** ./src/presenters/pop-overs/add-team-user-pop.jsx ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _debounce2 = _interopRequireDefault(__webpack_require__(/*! lodash/debounce */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/debounce.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _axios = _interopRequireDefault(__webpack_require__(/*! axios */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/axios/0.18.0/node_modules/axios/index.js"));

var _emailAddresses = __webpack_require__(/*! email-addresses */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/email-addresses/3.0.3/node_modules/email-addresses/lib/email-addresses.js");

var _sentry = __webpack_require__(/*! ../../utils/sentry */ "./src/utils/sentry.js");

var _devToggles = _interopRequireDefault(__webpack_require__(/*! ../includes/dev-toggles */ "./src/presenters/includes/dev-toggles.jsx"));

var _loader = _interopRequireDefault(__webpack_require__(/*! ../includes/loader */ "./src/presenters/includes/loader.jsx"));

var _userResultItem = _interopRequireWildcard(__webpack_require__(/*! ../includes/user-result-item */ "./src/presenters/includes/user-result-item.jsx"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const getDomain = function getDomain(query) {
  const email = (0, _emailAddresses.parseOneAddress)(query.replace('@', 'test@'));

  if (email && email.domain.includes('.')) {
    return email.domain.toLowerCase();
  }

  return null;
};

const rankSearchResult = function rankSearchResult(result, query) {
  //example result:

  /*
  login: "judeallred"
  name: "Jude Allred"
  */
  const lowerQuery = query.toLowerCase();
  let points = 0;
  const login = result.login || "";
  const lowerLogin = login.toLowerCase();
  const name = result.name || "";
  const lowerName = name.toLowerCase(); //Big point items -- exact matches:

  if (lowerLogin === lowerQuery) {
    points += 9000; // exact match on login name :over nine thousand!:
  }

  if (lowerName === lowerQuery) {
    points += 50; // Exact match on name, case insensitive.

    if (name === query) {
      points += 10; // Bonus case-sensitive match
    }
  } // Points for matching either of login or name.
  // Bonus if startsWith.


  [lowerLogin, lowerName].forEach(function (lowerField) {
    if (lowerField.includes(lowerQuery)) {
      points += 10;

      if (lowerField.startsWith(lowerQuery)) {
        points += 5;
      }
    }
  });
  return points;
};

class AddTeamUserPop extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      //The actual search text
      maybeRequest: null,
      //The active request promise
      maybeResults: null,
      //Null means still waiting vs empty
      validDomains: {} //Null means loading that domain

    };
    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.debouncedSearch = (0, _debounce2.default)(this.debouncedSearch.bind(this), 300);
  }

  handleChange(evt) {
    const query = evt.currentTarget.value.trimStart();
    this.setState({
      query
    });

    if (query) {
      this.debouncedSearch();
    } else {
      this.clearSearch();
    }
  }

  clearSearch() {
    this.setState({
      maybeRequest: null,
      maybeResults: null
    });
  }

  debouncedSearch() {
    const query = this.state.query.trim();

    if (!query) {
      this.clearSearch();
      return;
    }

    this.startSearch(query);
    this.validateDomain(query);
  }

  async startSearch(query) {
    var _this = this;

    const request = this.props.api.get(`users/search?q=${query}`);
    this.setState({
      maybeRequest: request
    });
    const {
      data
    } = await request;
    const nonMemberResults = data.filter(function (user) {
      return !_this.props.members.includes(user.id);
    });
    const rankedResults = nonMemberResults.sort(function (a, b) {
      return rankSearchResult(b, query) - rankSearchResult(a, query);
    });
    this.setState(function ({
      maybeRequest
    }) {
      return request === maybeRequest ? {
        maybeRequest: null,
        maybeResults: rankedResults
      } : {};
    });
  }

  async validateDomain(query) {
    const domain = getDomain(query);

    if (!domain || this.state.validDomains[domain] !== undefined) {
      return;
    }

    this.setState(function (prevState) {
      return {
        validDomains: Object.assign({}, prevState.validDomains, {
          [domain]: null
        })
      };
    });
    let valid = !['gmail.com', 'yahoo.com'].includes(domain); // Used if we can't reach freemail

    try {
      const {
        data
      } = await _axios.default.get(`https://freemail.glitch.me/${domain}`);
      valid = !data.free;
    } catch (error) {
      (0, _sentry.captureException)(error);
    }

    this.setState(function (prevState) {
      return {
        validDomains: Object.assign({}, prevState.validDomains, {
          [domain]: valid
        })
      };
    });
  }

  render() {
    const {
      inviteEmail,
      inviteUser,
      setWhitelistedDomain
    } = this.props;
    const {
      maybeRequest,
      maybeResults,
      query
    } = this.state;
    const isLoading = !!maybeRequest || !maybeResults;
    const results = [];
    const email = (0, _emailAddresses.parseOneAddress)(query);

    if (email && this.props.enabledToggles.includes("Email Invites")) {
      results.push({
        key: 'invite-by-email',
        item: _react.default.createElement(_userResultItem.InviteByEmail, {
          email: email.address,
          onClick: function onClick() {
            return inviteEmail(email.address);
          }
        })
      });
    }

    if (setWhitelistedDomain) {
      const domain = getDomain(query);
      const prevDomain = this.props.whitelistedDomain;

      if (domain && prevDomain !== domain && this.state.validDomains[domain]) {
        results.push({
          key: 'whitelist-email-domain',
          item: _react.default.createElement(_userResultItem.WhitelistEmailDomain, {
            domain: domain,
            prevDomain: prevDomain,
            onClick: function onClick() {
              return setWhitelistedDomain(domain);
            }
          })
        });
      }
    } // now add the actual search results


    if (maybeResults) {
      results.push(...maybeResults.map(function (user) {
        return {
          key: user.id,
          item: _react.default.createElement(_userResultItem.default, {
            user: user,
            action: function action() {
              return inviteUser(user);
            }
          })
        };
      }));
    }

    return _react.default.createElement("dialog", {
      className: "pop-over add-team-user-pop"
    }, _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("input", {
      id: "team-user-search",
      autoFocus: true // eslint-disable-line jsx-a11y/no-autofocus
      ,
      value: query,
      onChange: this.handleChange,
      className: "pop-over-input search-input pop-over-search",
      placeholder: "Search for a user"
    })), !!query && _react.default.createElement(Results, {
      isLoading: isLoading,
      results: results
    }), !query && setWhitelistedDomain && _react.default.createElement("aside", {
      className: "pop-over-info"
    }, "You can also whitelist with @example.com"));
  }

}

AddTeamUserPop.propTypes = {
  api: _propTypes.default.func.isRequired,
  inviteEmail: _propTypes.default.func.isRequired,
  inviteUser: _propTypes.default.func.isRequired,
  members: _propTypes.default.arrayOf(_propTypes.default.number.isRequired).isRequired,
  setWhitelistedDomain: _propTypes.default.func,
  whitelistedDomain: _propTypes.default.string,
  enabledToggles: _propTypes.default.array.isRequired
};

const Results = function Results({
  results,
  isLoading
}) {
  if (isLoading) {
    return _react.default.createElement("section", {
      className: "pop-over-actions last-section"
    }, _react.default.createElement(_loader.default, null));
  }

  if (results.length === 0) {
    return _react.default.createElement("section", {
      className: "pop-over-actions last-section"
    }, "Nothing found ", _react.default.createElement("span", {
      role: "img",
      "aria-label": ""
    }, "\uD83D\uDCAB"));
  }

  return _react.default.createElement("section", {
    className: "pop-over-actions last-section results-list"
  }, _react.default.createElement("ul", {
    className: "results"
  }, results.map(function ({
    key,
    item
  }) {
    return _react.default.createElement("li", {
      key: key
    }, item);
  })));
};

Results.propTypes = {
  results: _propTypes.default.array.isRequired,
  isLoading: _propTypes.default.bool.isRequired
};

const AddTeamUserPopWithDevToggles = function AddTeamUserPopWithDevToggles(props) {
  return _react.default.createElement(_devToggles.default, null, function (enabledToggles) {
    return _react.default.createElement(AddTeamUserPop, _extends({}, props, {
      enabledToggles: enabledToggles
    }));
  });
};

var _default = AddTeamUserPopWithDevToggles;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/collection-options-pop.jsx":
/*!*************************************************************!*\
  !*** ./src/presenters/pop-overs/collection-options-pop.jsx ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = CollectionOptions;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ./popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

var _popoverButton = _interopRequireDefault(__webpack_require__(/*! ./popover-button */ "./src/presenters/pop-overs/popover-button.jsx"));

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Collection Options Pop
const CollectionOptionsPop = function CollectionOptionsPop(props) {
  function animate(event, className, func) {
    const collectionContainer = event.target.closest('li');
    collectionContainer.addEventListener('animationend', func, {
      once: true
    });
    collectionContainer.classList.add(className);
  }

  function animateThenDeleteCollection(event) {
    if (!window.confirm(`Are you sure you want to delete your collection?`)) {
      return;
    }

    animate(event, 'slide-down', function () {
      return props.deleteCollection(props.collection.id);
    });
  }

  return _react.default.createElement("dialog", {
    className: "pop-over collection-options-pop"
  }, _react.default.createElement("section", {
    className: "pop-over-actions danger-zone last-section"
  }, props.deleteCollection && _react.default.createElement(_popoverButton.default, {
    onClick: animateThenDeleteCollection,
    text: "Delete Collection ",
    emoji: "bomb"
  })));
};

CollectionOptionsPop.propTypes = {
  deleteCollection: _propTypes.default.func
}; // Collection Options Container

function CollectionOptions({
  deleteCollection,
  collection
}) {
  if (!deleteCollection) {
    return null;
  }

  return _react.default.createElement(_popoverWithButton.default, {
    buttonText: _react.default.createElement("div", {
      className: "down-arrow",
      "aria-label": "options"
    }),
    containerClass: "collection-options-pop-btn",
    buttonClass: "collection-options button-borderless opens-pop-over"
  }, _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (user) {
    return _react.default.createElement(CollectionOptionsPop, {
      collection: collection,
      deleteCollection: deleteCollection,
      currentUser: user
    });
  }));
}

CollectionOptions.propTypes = {
  collection: _propTypes.default.object.isRequired,
  deleteCollection: _propTypes.default.func
};

/***/ }),

/***/ "./src/presenters/pop-overs/create-collection-pop.jsx":
/*!************************************************************!*\
  !*** ./src/presenters/pop-overs/create-collection-pop.jsx ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _orderBy2 = _interopRequireDefault(__webpack_require__(/*! lodash/orderBy */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/orderBy.js"));

var _kebabCase2 = _interopRequireDefault(__webpack_require__(/*! lodash/kebabCase */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/kebabCase.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _randomcolor = _interopRequireDefault(__webpack_require__(/*! randomcolor */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/randomcolor/0.5.3/node_modules/randomcolor/randomColor.js"));

var _sentry = __webpack_require__(/*! ../../utils/sentry */ "./src/utils/sentry.js");

var _avatar = __webpack_require__(/*! ../includes/avatar.jsx */ "./src/presenters/includes/avatar.jsx");

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _collection = __webpack_require__(/*! ../../models/collection */ "./src/models/collection.js");

var _popoverNested = __webpack_require__(/*! ./popover-nested.jsx */ "./src/presenters/pop-overs/popover-nested.jsx");

var _dropdown = _interopRequireDefault(__webpack_require__(/*! ./dropdown.jsx */ "./src/presenters/pop-overs/dropdown.jsx"));

var _editableField = __webpack_require__(/*! ../includes/editable-field.jsx */ "./src/presenters/includes/editable-field.jsx");

var _loader = _interopRequireDefault(__webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create-collection-pop.jsx -> add a project to a new user or team collection
class CreateNewCollectionPop extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      working: false,
      query: '',
      //The entered collection name
      teamId: undefined // by default, create a collection for a user, but if team is selected from dropdown, set to teamID,

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setTeamId = this.setTeamId.bind(this);
  }

  handleChange(newValue) {
    this.setState({
      query: newValue,
      error: null
    });
  }

  setTeamId(buttonContents) {
    const teamId = buttonContents.props.id;
    this.setState({
      teamId: teamId
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({
      working: true
    }); // get text from input field

    const newCollectionName = this.state.query; // create a new collection

    try {
      const name = newCollectionName;
      const url = (0, _kebabCase2.default)(newCollectionName);
      const avatarUrl = _collection.defaultAvatar;
      const coverColor = (0, _randomcolor.default)({
        luminosity: 'light'
      });
      const teamId = this.state.teamId;
      const {
        data
      } = await this.props.api.post('collections', {
        name,
        url,
        avatarUrl,
        coverColor,
        teamId
      }); // add the selected project to the collection

      await this.props.api.patch(`collections/${data.id}/add/${this.props.project.id}`); // redirect to that collection

      if (data && data.url) {
        if (this.state.teamId) {
          const {
            data: team
          } = await this.props.api.get(`/teams/${this.state.teamId}`);
          data.team = team;
        } else {
          data.user = this.props.currentUser;
        }

        const newCollectionUrl = (0, _collection.getLink)(data);
        this.setState({
          newCollectionUrl
        });
      }
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.message) {
        this.setState({
          error: error.response.data.message
        });
      } else {
        (0, _sentry.captureException)(error);
      }
    }
  }

  render() {
    var _this = this;

    const {
      error,
      query
    } = this.state;
    const {
      collections
    } = this.props;
    let queryError = error;
    let submitEnabled = this.state.query.length > 0;
    let nameTakenError = "You already have a collection with this url";
    let placeholder = "New Collection Name";
    const teams = this.props.currentUser.teams;

    const currentUserMenuItem = _react.default.createElement("span", null, "myself ", _react.default.createElement(_avatar.UserAvatar, {
      user: this.props.currentUser,
      isStatic: true
    }));

    function getTeamMenuContents() {
      const orderedTeams = (0, _orderBy2.default)(teams, function (team) {
        return team.name.toLowerCase();
      });
      const menuContents = [];
      menuContents.push(currentUserMenuItem); // add user as first option

      orderedTeams.map(function (team) {
        let content = _react.default.createElement("span", {
          id: team.id
        }, team.name, " ", _react.default.createElement(_avatar.TeamAvatar, {
          team: team,
          className: "user"
        }));

        menuContents.push(content);
      });
      return menuContents;
    } // filter collections based on selected owner from dropdown


    const selectedOwnerCollections = this.state.teamId ? collections.filter(function ({
      teamId
    }) {
      return teamId == _this.state.teamId;
    }) : collections.filter(function ({
      userId
    }) {
      return userId == _this.props.currentUser.id;
    });

    if (!!collections && selectedOwnerCollections.some(function (c) {
      return c.url === (0, _kebabCase2.default)(query);
    })) {
      queryError = nameTakenError;
    }

    if (this.state.newCollectionUrl) {
      return _react.default.createElement(_reactRouterDom.Redirect, {
        to: this.state.newCollectionUrl
      });
    }

    return _react.default.createElement("dialog", {
      className: "pop-over create-collection-pop wide-pop"
    }, _react.default.createElement(_popoverNested.NestedPopoverTitle, null, "Add ", this.props.project.domain, " to a new collection"), _react.default.createElement("section", {
      className: "pop-over-actions"
    }, _react.default.createElement("form", {
      onSubmit: this.handleSubmit
    }, _react.default.createElement(_editableField.PureEditableField, {
      id: "collection-name",
      className: "pop-over-input create-input",
      value: query,
      update: this.handleChange,
      placeholder: placeholder,
      error: error || queryError
    }), this.props.currentUser.teams.length > 0 && _react.default.createElement("div", null, "for ", _react.default.createElement(_dropdown.default, {
      buttonContents: currentUserMenuItem,
      menuContents: getTeamMenuContents(),
      onUpdate: this.setTeamId
    })), !this.state.working ? _react.default.createElement(_analytics.TrackClick, {
      name: "Create Collection clicked",
      properties: function properties(inherited) {
        return Object.assign({}, inherited, {
          origin: `${inherited.origin} project`
        });
      }
    }, _react.default.createElement("div", {
      className: "button-wrap"
    }, _react.default.createElement("button", {
      type: "submit",
      className: "create-collection button-small",
      disabled: !!queryError || !submitEnabled
    }, "Create"))) : _react.default.createElement(_loader.default, null))));
  }

}

CreateNewCollectionPop.propTypes = {
  api: _propTypes.default.func.isRequired,
  currentUser: _propTypes.default.object,
  project: _propTypes.default.object.isRequired,
  fromProject: _propTypes.default.bool
};
var _default = CreateNewCollectionPop;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/create-team-pop.jsx":
/*!******************************************************!*\
  !*** ./src/presenters/pop-overs/create-team-pop.jsx ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _kebabCase2 = _interopRequireDefault(__webpack_require__(/*! lodash/kebabCase */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/kebabCase.js"));

var _debounce2 = _interopRequireDefault(__webpack_require__(/*! lodash/debounce */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/debounce.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

var _words = __webpack_require__(/*! ../../models/words */ "./src/models/words.js");

var _team = __webpack_require__(/*! ../../models/team */ "./src/models/team.js");

var _loader = _interopRequireDefault(__webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx"));

var _popoverNested = __webpack_require__(/*! ../pop-overs/popover-nested.jsx */ "./src/presenters/pop-overs/popover-nested.jsx");

var _editableField = __webpack_require__(/*! ../includes/editable-field.jsx */ "./src/presenters/includes/editable-field.jsx");

var _signInPop = __webpack_require__(/*! ./sign-in-pop.jsx */ "./src/presenters/pop-overs/sign-in-pop.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create Team 🌿
class CreateTeamPopBase extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: '',
      isLoading: false,
      error: ''
    };
    this.debouncedValidate = (0, _debounce2.default)(this.validate.bind(this), 200);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    try {
      const teamName = await (0, _words.getTeamPair)();
      this.setState(function (prevState) {
        return !prevState.teamName ? {
          teamName
        } : {};
      });
    } catch (error) {// If something goes wrong just leave the field empty
    }

    this.validate();
  }

  async validate() {
    const name = this.state.teamName;

    if (name) {
      const url = (0, _kebabCase2.default)(name);
      let error = null;

      try {
        const {
          data
        } = await this.props.api.get(`userId/byLogin/${url}`);

        if (data !== 'NOT FOUND') {
          error = 'Name in use, try another';
        }
      } catch (error) {
        if (!(error.response && error.response.status === 404)) {
          throw error;
        }
      }

      try {
        const {
          data
        } = await this.props.api.get(`teams/byUrl/${url}`);

        if (data) {
          error = 'Team already exists, try another';
        }
      } catch (error) {
        if (!(error.response && error.response.status === 404)) {
          throw error;
        }
      }

      if (error) {
        this.setState(function ({
          teamName
        }) {
          return name === teamName ? {
            error
          } : {};
        });
      }
    }
  }

  async handleChange(newValue) {
    this.setState({
      teamName: newValue,
      error: ''
    });
    this.debouncedValidate();
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({
      isLoading: true
    });

    try {
      let description = 'A team that makes things';

      try {
        const predicates = await (0, _words.getPredicates)();
        description = `A ${predicates[0]} team that makes ${predicates[1]} things`;
      } catch (error) {// Just use the plain description
      }

      const {
        data
      } = await this.props.api.post('teams', {
        name: this.state.teamName,
        url: (0, _kebabCase2.default)(this.state.teamName),
        hasAvatarImage: false,
        coverColor: '',
        location: '',
        description,
        backgroundColor: '',
        hasCoverImage: false,
        isVerified: false
      });
      this.props.history.push((0, _team.getLink)(data));
    } catch (error) {
      const message = error && error.response && error.response.data && error.response.data.message;
      this.setState({
        isLoading: false,
        error: message || 'Something went wrong'
      });
    }
  }

  render() {
    const placeholder = 'Your Team Name';
    return _react.default.createElement("dialog", {
      className: "pop-over create-team-pop"
    }, _react.default.createElement(_popoverNested.NestedPopoverTitle, null, "Create Team ", _react.default.createElement("span", {
      className: "emoji herb"
    })), _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("p", {
      className: "info-description"
    }, "Showcase your projects in one place, manage collaborators, and view analytics")), _react.default.createElement("section", {
      className: "pop-over-actions"
    }, _react.default.createElement("form", {
      onSubmit: this.handleSubmit
    }, _react.default.createElement(_editableField.PureEditableField, {
      value: this.state.teamName,
      update: this.handleChange,
      placeholder: placeholder,
      error: this.state.error
    }), _react.default.createElement("p", {
      className: "action-description team-url-preview"
    }, "/@", (0, _kebabCase2.default)(this.state.teamName || placeholder)), this.state.isLoading ? _react.default.createElement(_loader.default, null) : _react.default.createElement(_analytics.TrackClick, {
      name: "Create Team submitted"
    }, _react.default.createElement("button", {
      type: "submit",
      className: "button-small has-emoji"
    }, "Create Team ", _react.default.createElement("span", {
      className: "emoji thumbs_up"
    }))))), _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("p", {
      className: "info-description"
    }, "You can change this later")));
  }

}

CreateTeamPopBase.propTypes = {
  api: _propTypes.default.func.isRequired
};
const CreateTeamPop = (0, _reactRouterDom.withRouter)(CreateTeamPopBase);

const CreateTeamPopOrSignIn = function CreateTeamPopOrSignIn({
  api
}) {
  return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (user) {
    return user && user.login ? _react.default.createElement(CreateTeamPop, {
      api: api
    }) : _react.default.createElement(_signInPop.SignInPop, {
      api: api,
      hash: "create-team",
      header: _react.default.createElement(_popoverNested.NestedPopoverTitle, null, "Sign In"),
      prompt: _react.default.createElement("p", {
        className: "action-description"
      }, "You'll need to sign in to create a team")
    });
  });
};

var _default = CreateTeamPopOrSignIn;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/delete-team-pop.jsx":
/*!******************************************************!*\
  !*** ./src/presenters/pop-overs/delete-team-pop.jsx ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.DeleteTeamPop = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _loader = _interopRequireDefault(__webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx"));

var _notifications = _interopRequireDefault(__webpack_require__(/*! ../notifications.jsx */ "./src/presenters/notifications.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class DeleteTeamPopBase extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamIsDeleting: false
    };
    this.deleteTeam = this.deleteTeam.bind(this);
  }

  async deleteTeam() {
    if (this.state.teamIsDeleting) {
      return null;
    }

    this.setState({
      teamIsDeleting: true
    });

    try {
      await this.props.api().delete(`teams/${this.props.teamId}`);
      this.props.history.push('/');
    } catch (error) {
      console.error("deleteTeam", error, error.response);
      this.props.createErrorNotification('Something went wrong, try refreshing?');
      this.setState({
        teamIsDeleting: false
      });
    }
  }

  render() {
    let illustration = "https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fdelete-team.svg?1531267699621";
    return _react.default.createElement("dialog", {
      className: "pop-over delete-team-pop",
      open: true
    }, _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("div", {
      className: "pop-title"
    }, "Delete ", this.props.teamName)), _react.default.createElement("section", {
      className: "pop-over-actions"
    }, _react.default.createElement("img", {
      className: "illustration",
      src: illustration,
      "aria-label": "illustration",
      alt: ""
    }), _react.default.createElement("div", {
      className: "action-description"
    }, "Deleting ", this.props.teamName, " will remove this team page. No projects will be deleted, but only current project members will be able to edit them.")), _react.default.createElement("section", {
      className: "pop-over-actions danger-zone"
    }, _react.default.createElement("button", {
      className: "button button-small has-emoji opens-pop-over",
      onClick: this.deleteTeam
    }, _react.default.createElement("span", null, "Delete ", this.props.teamName, " "), _react.default.createElement("span", {
      className: "emoji bomb",
      role: "img",
      "aria-label": "bomb emoji"
    }), this.state.teamIsDeleting && _react.default.createElement(_loader.default, null))));
  }

}

const DeleteTeamPop = (0, _reactRouterDom.withRouter)(function (props) {
  return _react.default.createElement(_notifications.default, null, function (notifyFuncs) {
    return _react.default.createElement(DeleteTeamPopBase, _extends({}, notifyFuncs, props));
  });
});
exports.DeleteTeamPop = DeleteTeamPop;
DeleteTeamPop.propTypes = {
  api: _propTypes.default.func.isRequired,
  teamId: _propTypes.default.number.isRequired,
  teamName: _propTypes.default.string.isRequired,
  users: _propTypes.default.array.isRequired,
  teamAdmins: _propTypes.default.array.isRequired,
  togglePopover: _propTypes.default.func // required but added dynamically

};
var _default = DeleteTeamPop;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/dropdown.jsx":
/*!***********************************************!*\
  !*** ./src/presenters/pop-overs/dropdown.jsx ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ./popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DropdownMenu = function DropdownMenu({
  contents,
  selected,
  updateSelected,
  togglePopover
}) {
  return _react.default.createElement("ul", {
    className: "pop-over mini-pop",
    role: "listbox",
    tabIndex: "-1"
  }, contents.map(function (item, index) {
    return _react.default.createElement("li", {
      className: "mini-pop-action" + (index == selected ? " selected" : ""),
      key: index,
      "aria-selected": index == selected,
      onClick: function onClick() {
        updateSelected(index);
        togglePopover();
      },
      onKeyPress: function onKeyPress() {
        updateSelected(index);
        togglePopover();
      },
      role: "option"
    }, item);
  }));
};

DropdownMenu.propTypes = {
  contents: _propTypes.default.node.isRequired,
  selected: _propTypes.default.number.isRequired,
  updateSelected: _propTypes.default.func.isRequired,
  togglePopover: _propTypes.default.func // added dynamically from PopoverWithButton

};

class Dropdown extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      buttonContents: this.props.buttonContents
    };
    this.updateSelected = this.updateSelected.bind(this);
  }

  componentDidMount() {// set default menu item here
  }

  updateSelected(itemIndex) {
    this.setState({
      selected: itemIndex,
      buttonContents: this.props.menuContents[itemIndex]
    }); // pass selected button back to onUpdate

    this.props.onUpdate(this.props.menuContents[itemIndex]);
  }

  render() {
    return _react.default.createElement(_popoverWithButton.default, {
      buttonClass: "button-small dropdown-btn user-or-team-toggle has-emoji",
      buttonText: this.state.buttonContents,
      containerClass: "dropdown",
      dropdown: true,
      passToggleToPop: true
    }, _react.default.createElement(DropdownMenu, {
      contents: this.props.menuContents,
      selected: this.state.selected,
      updateSelected: this.updateSelected
    }));
  }

}

Dropdown.propTypes = {
  buttonContents: _propTypes.default.node.isRequired,
  menuContents: _propTypes.default.node.isRequired,
  onUpdate: _propTypes.default.func.isRequired
};
var _default = Dropdown;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/edit-collection-color-pop.jsx":
/*!****************************************************************!*\
  !*** ./src/presenters/pop-overs/edit-collection-color-pop.jsx ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _throttle2 = _interopRequireDefault(__webpack_require__(/*! lodash/throttle */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/throttle.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _randomcolor = _interopRequireDefault(__webpack_require__(/*! randomcolor */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/randomcolor/0.5.3/node_modules/randomcolor/randomColor.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validHex = function validHex(hex) {
  var re = /[0-9A-Fa-f]{6}/g;

  if (re.test(hex)) {
    return true;
  }

  return false;
};

class EditCollectionColorPop extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: this.props.initialColor,
      color: this.props.initialColor,
      maybeRequest: null,
      maybeResults: null
    };
    this.onClick = this.onClick.bind(this);
    this.handleChange = this.handleChange.bind(this); // for when user enters in custom hex

    this.keyPress = this.keyPress.bind(this); // handles enter key for custom hex

    this.getRandomColor = this.getRandomColor.bind(this); // gets random color

    this.changeColor = (0, _throttle2.default)(this.changeColor.bind(this), 250); // get update from system color picker

    this.update = this.props.updateColor;
  }

  handleChange(e) {
    let query = e.currentTarget.value.trim();
    const errorMsg = document.getElementsByClassName("editable-field-error-message")[0];
    errorMsg.style.display = "none";
    this.setState({
      query
    });

    if (query && query.length <= 7) {
      if (validHex(query)) {
        if (query[0] !== "#") {
          query = "#" + query;
        }

        this.setState({
          color: query
        });
        this.update(query);
      } else {
        errorMsg.style.display = "inherit";
      }
    } else {
      // user has cleared the input field
      errorMsg.style.display = "inherit";
    }
  }

  keyPress(e) {
    if (e.which == 13 || e.keyCode == 13) {
      // enter key pressed - dismiss pop-over
      this.props.togglePopover();
    } else {
      document.getElementsByClassName("editable-field-error-message")[0].style.display = "none";
    }
  }

  onClick() {
    this.props.togglePopover();
  }

  getRandomColor() {
    let newCoverColor = (0, _randomcolor.default)({
      luminosity: 'light'
    });
    this.setState({
      color: newCoverColor
    });
    this.setState({
      query: newCoverColor
    });
    this.update(newCoverColor);
  }

  changeColor(color) {
    // upate the UI manually to prevent lag
    document.getElementById("color-picker").value = color;
    document.getElementById("color-picker").style.backgroundColor = color;
    this.setState({
      color: color
    });
    this.setState({
      query: color
    });
    this.update(color);
  }

  render() {
    var _this = this;

    return _react.default.createElement("dialog", {
      className: "pop-over edit-collection-color-pop"
    }, _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("input", {
      className: "color-picker",
      type: "color",
      value: this.state.color,
      onChange: function onChange(e) {
        return _this.changeColor(e.target.value);
      },
      style: {
        backgroundColor: this.state.color
      },
      id: "color-picker"
    }), _react.default.createElement("div", {
      className: "custom-color-input"
    }, _react.default.createElement("input", {
      id: "color-picker-hex",
      value: this.state.query,
      onChange: this.handleChange,
      onKeyPress: this.keyPress,
      className: "pop-over-input pop-over-search",
      placeholder: "Custom color hex"
    }), _react.default.createElement("div", {
      className: "editable-field-error-message"
    }, "Invalid Hex"))), _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("button", {
      className: "random-color-btn button-tertiary",
      onClick: this.getRandomColor
    }, "Random ", _react.default.createElement("span", {
      className: "emoji bouquet"
    }))));
  }

}

EditCollectionColorPop.propTypes = {
  updateColor: _propTypes.default.func.isRequired,
  initialColor: _propTypes.default.string.isRequired
};
var _default = EditCollectionColorPop;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/new-project-pop.jsx":
/*!******************************************************!*\
  !*** ./src/presenters/pop-overs/new-project-pop.jsx ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _loader = _interopRequireDefault(__webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx"));

var _projectResultItem = _interopRequireDefault(__webpack_require__(/*! ../includes/project-result-item.jsx */ "./src/presenters/includes/project-result-item.jsx"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ./popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

var _project = __webpack_require__(/*! ../../models/project */ "./src/models/project.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const NewProjectPop = function NewProjectPop({
  projects
}) {
  return _react.default.createElement("div", {
    className: "pop-over new-project-pop"
  }, _react.default.createElement("section", {
    className: "pop-over-actions results-list"
  }, _react.default.createElement("div", {
    className: "results"
  }, projects.length ? projects.map(function (project) {
    return _react.default.createElement(_analytics.TrackedExternalLink, {
      key: project.id,
      to: (0, _project.getRemixUrl)(project.domain),
      name: "New Project Clicked",
      properties: {
        baseDomain: project.domain,
        origin: "community new project pop"
      }
    }, _react.default.createElement(_projectResultItem.default, _extends({}, project, {
      cdnUrl: "https://cdn.glitch.com",
      users: [],
      onClick: function onClick() {}
    })));
  }) : _react.default.createElement(_loader.default, null))));
};

NewProjectPop.propTypes = {
  projects: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    domain: _propTypes.default.string.isRequired
  })).isRequired
};

class NewProjectPopButton extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: []
    };
  }

  async load() {
    const projectIds = ['a0fcd798-9ddf-42e5-8205-17158d4bf5bb', // 'hello-express'
    'cb519589-591c-474f-8986-a513f22dbf88', // 'hello-sqlite'
    '929980a8-32fc-4ae7-a66f-dddb3ae4912c']; // always request against the production API, with no token

    const {
      data
    } = await this.props.api.get(`https://api.glitch.com/projects/byIds?ids=${projectIds.join(',')}`, {
      headers: {
        Authorization: ''
      }
    });
    this.setState({
      projects: data
    });
  }

  componentDidMount() {
    this.load();
  }

  render() {
    return _react.default.createElement(_popoverWithButton.default, {
      buttonClass: "button-small",
      dataTrack: "open new-project pop",
      buttonText: "New Project"
    }, _react.default.createElement(NewProjectPop, {
      projects: this.state.projects
    }));
  }

}

NewProjectPopButton.propTypes = {
  api: _propTypes.default.any.isRequired
};
var _default = NewProjectPopButton;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/popover-button.jsx":
/*!*****************************************************!*\
  !*** ./src/presenters/pop-overs/popover-button.jsx ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PopoverButton = function PopoverButton({
  onClick,
  text,
  emoji
}) {
  return _react.default.createElement("button", {
    className: "button-small has-emoji button-tertiary",
    onClick: onClick
  }, _react.default.createElement("span", null, text, " "), _react.default.createElement("span", {
    className: `emoji ${emoji}`
  }));
};

PopoverButton.propTypes = {
  onClick: _propTypes.default.func.isRequired,
  text: _propTypes.default.node.isRequired,
  emoji: _propTypes.default.string.isRequired
};
var _default = PopoverButton;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/popover-container.jsx":
/*!********************************************************!*\
  !*** ./src/presenters/pop-overs/popover-container.jsx ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactOnclickoutside = _interopRequireDefault(__webpack_require__(/*! react-onclickoutside */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-onclickoutside/6.7.1/node_modules/react-onclickoutside/dist/react-onclickoutside.es.js"));

var _reactIs = __webpack_require__(/*! react-is */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-is/16.7.0/node_modules/react-is/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
A popover is a light, hollow roll made from an egg batter similar to
that of Yorkshire pudding, typically baked in muffin tins or dedicated
popover pans, which have straight-walled sides rather than angled.

...also it's a [Bootstrap UI pattern](https://www.w3schools.com/bootstrap/bootstrap_popover.asp)
*/
const Wrapper = function Wrapper({
  children
}) {
  return children;
};

Wrapper.propTypes = {
  children: _propTypes.default.element
};

class PopoverContainer extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.startOpen
    };
    this.set = this.set.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this); // We need to set up and instantiate an onClickOutside wrapper
    // It's important to instantiate it once and pass though its children,
    // otherwise the diff algorithm won't be able to figure out our hijinks.
    // https://github.com/Pomax/react-onclickoutside
    // We do extra work with disableOnClickOutside and handleClickOutside
    // to prevent event bindings from being created until the popover is opened.

    const _handleClickOutside = this.handleClickOutside.bind(this);

    const clickOutsideConfig = {
      handleClickOutside: function handleClickOutside() {
        return _handleClickOutside;
      },
      excludeScrollbar: true
    };
    this.MonitoredComponent = (0, _reactOnclickoutside.default)(Wrapper, clickOutsideConfig);
  }

  handleClickOutside(event) {
    // On keyup events, only hide the popup if it was the Escape key
    if (event.type === "keyup" && !["Escape", "Esc"].includes(event.key)) {
      return;
    }

    this.setState({
      visible: false
    });
  }

  set(visible) {
    this.setState({
      visible
    });
  }

  toggle() {
    this.setState(function (prevState) {
      return {
        visible: !prevState.visible
      };
    });
  } // show() {
  //   this.setState(() => {
  //     return {visible: true};
  //   });
  // }


  render() {
    const props = {
      visible: this.state.visible,
      togglePopover: this.toggle,
      setVisible: this.set
    };
    const inner = this.props.children(props);

    if ((0, _reactIs.isFragment)(inner)) {
      console.error("PopoverContainer does not support Fragment as the top level item. Please use a different element.");
    }

    const outer = this.props.outer ? this.props.outer(props) : null;
    return _react.default.createElement(_react.default.Fragment, null, outer, _react.default.createElement(this.MonitoredComponent, {
      disableOnClickOutside: !this.state.visible,
      eventTypes: ["mousedown", "touchstart", "keyup"]
    }, inner));
  }

}

exports.default = PopoverContainer;
PopoverContainer.propTypes = {
  children: _propTypes.default.func.isRequired,
  outer: _propTypes.default.func,
  startOpen: _propTypes.default.bool
};
PopoverContainer.defaultProps = {
  startOpen: false
};

/***/ }),

/***/ "./src/presenters/pop-overs/popover-nested.jsx":
/*!*****************************************************!*\
  !*** ./src/presenters/pop-overs/popover-nested.jsx ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.NestedPopoverTitle = exports.NestedPopover = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Provider,
  Consumer
} = _react.default.createContext();

class NestedPopover extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      alternateContentVisible: props.startAlternateVisible
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(function (prevState) {
      return {
        alternateContentVisible: !prevState.alternateContentVisible
      };
    });
  }

  render() {
    // Only use the provider on the sub menu
    // Nested consumers want the back button, not the open menu
    if (this.state.alternateContentVisible) {
      return _react.default.createElement(Provider, {
        value: this.toggle
      }, this.props.alternateContent(this.toggle));
    }

    return this.props.children(this.toggle);
  }

}

exports.NestedPopover = NestedPopover;
NestedPopover.propTypes = {
  children: _propTypes.default.func.isRequired,
  alternateContent: _propTypes.default.func.isRequired,
  startAlternateVisible: _propTypes.default.bool
};
NestedPopover.defaultProps = {
  startAlternateVisible: false
};

const NestedPopoverTitle = function NestedPopoverTitle({
  children
}) {
  return _react.default.createElement(Consumer, null, function (toggle) {
    return _react.default.createElement("button", {
      className: "button-unstyled pop-over-section pop-over-info clickable-label",
      onClick: toggle,
      "aria-label": "go back"
    }, _react.default.createElement("div", {
      className: "back icon"
    }, _react.default.createElement("div", {
      className: "left-arrow icon"
    })), "\xA0", _react.default.createElement("div", {
      className: "pop-title"
    }, children));
  });
};

exports.NestedPopoverTitle = NestedPopoverTitle;
NestedPopoverTitle.propTypes = {
  children: _propTypes.default.node.isRequired
};

/***/ }),

/***/ "./src/presenters/pop-overs/popover-with-button.jsx":
/*!**********************************************************!*\
  !*** ./src/presenters/pop-overs/popover-with-button.jsx ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _popoverContainer = _interopRequireDefault(__webpack_require__(/*! ./popover-container.jsx */ "./src/presenters/pop-overs/popover-container.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PopoverWithButton = function PopoverWithButton(props) {
  return _react.default.createElement(_popoverContainer.default, null, function ({
    visible,
    togglePopover
  }) {
    let childrenToShow = props.children;

    if (props.passToggleToPop) {
      childrenToShow = _react.default.Children.map(props.children, function (child) {
        return _react.default.cloneElement(child, {
          togglePopover: togglePopover
        });
      }); // what's happening here?
    }

    return _react.default.createElement("div", {
      className: "button-wrap " + props.containerClass
    }, _react.default.createElement("button", {
      className: props.buttonClass,
      "data-track": props.dataTrack,
      onClick: togglePopover,
      type: "button",
      "aria-haspopup": "listbox",
      "aria-expanded": visible
    }, props.buttonText, props.dropdown && _react.default.createElement("span", {
      className: "down-arrow icon",
      "aria-label": "options"
    })), visible && childrenToShow);
  });
};

PopoverWithButton.propTypes = {
  buttonClass: _propTypes.default.string,
  containerClass: _propTypes.default.string,
  dataTrack: _propTypes.default.string,
  dropdown: _propTypes.default.bool,
  buttonText: _propTypes.default.node.isRequired,
  children: _propTypes.default.node.isRequired,
  // should be the stuff to show in a popover
  passToggleToPop: _propTypes.default.bool
};
PopoverWithButton.defaultProps = {
  buttonClass: "",
  containerClass: "",
  dataTrack: "",
  passToggleToPop: false
};
var _default = PopoverWithButton;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/project-options-pop.jsx":
/*!**********************************************************!*\
  !*** ./src/presenters/pop-overs/project-options-pop.jsx ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = ProjectOptions;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ./popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

var _popoverNested = __webpack_require__(/*! ./popover-nested */ "./src/presenters/pop-overs/popover-nested.jsx");

var _currentUser = __webpack_require__(/*! ../current-user */ "./src/presenters/current-user.jsx");

var _addProjectToCollectionPop = _interopRequireDefault(__webpack_require__(/*! ../pop-overs/add-project-to-collection-pop */ "./src/presenters/pop-overs/add-project-to-collection-pop.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const PopoverButton = function PopoverButton({
  onClick,
  text,
  emoji
}) {
  return _react.default.createElement("button", {
    className: "button-small has-emoji button-tertiary",
    onClick: onClick
  }, _react.default.createElement("span", null, text, " "), _react.default.createElement("span", {
    className: `emoji ${emoji}`
  }));
}; // Project Options Content


const ProjectOptionsContent = function ProjectOptionsContent(_ref) {
  let {
    addToCollectionPopover
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["addToCollectionPopover"]);

  function animate(event, className, func) {
    const projectContainer = event.target.closest('li');
    projectContainer.addEventListener('animationend', func, {
      once: true
    });
    projectContainer.classList.add(className);
    props.togglePopover();
  }

  function leaveProject(event) {
    const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${props.project.domain}?`;

    if (window.confirm(prompt)) {
      props.leaveProject(props.project.id, event);
    }
  }

  function leaveTeamProject() {
    props.leaveTeamProject(props.project.id, props.currentUser.id);
  }

  function joinTeamProject() {
    props.joinTeamProject(props.project.id, props.currentUser);
  }

  function animateThenAddPin(event) {
    animate(event, 'slide-up', function () {
      return props.addPin(props.project.id);
    });
  }

  function animateThenRemovePin(event) {
    animate(event, 'slide-down', function () {
      return props.removePin(props.project.id);
    });
  }

  function animateThenDeleteProject(event) {
    animate(event, 'slide-down', function () {
      return props.deleteProject(props.project.id);
    });
  }

  return _react.default.createElement("dialog", {
    className: "pop-over project-options-pop"
  }, !!props.addPin && _react.default.createElement("section", {
    className: "pop-over-actions"
  }, _react.default.createElement(_analytics.TrackClick, {
    name: "Project Pinned"
  }, _react.default.createElement(PopoverButton, {
    onClick: animateThenAddPin,
    text: "Pin ",
    emoji: "pushpin"
  }))), !!props.removePin && _react.default.createElement("section", {
    className: "pop-over-actions"
  }, _react.default.createElement(_analytics.TrackClick, {
    name: "Project Un-Pinned"
  }, _react.default.createElement(PopoverButton, {
    onClick: animateThenRemovePin,
    text: "Un-Pin ",
    emoji: "pushpin"
  }))), !!props.addProjectToCollection && _react.default.createElement("section", {
    className: "pop-over-actions"
  }, _react.default.createElement(PopoverButton, _extends({
    onClick: addToCollectionPopover
  }, props, {
    text: "Add to My Collection ",
    emoji: "framed_picture"
  }))), props.joinTeamProject && !props.currentUserIsOnProject && _react.default.createElement("section", {
    className: "pop-over-actions collaborator-actions"
  }, _react.default.createElement(PopoverButton, {
    onClick: joinTeamProject,
    text: "Join Project ",
    emoji: "rainbow"
  })), props.leaveTeamProject && props.currentUserIsOnProject && _react.default.createElement("section", {
    className: "pop-over-actions collaborator-actions"
  }, _react.default.createElement(_analytics.TrackClick, {
    name: "Leave Project clicked"
  }, _react.default.createElement(PopoverButton, {
    onClick: leaveTeamProject,
    text: "Leave Project ",
    emoji: "wave"
  }))), props.leaveProject && props.project.users.length > 1 && props.currentUserIsOnProject && _react.default.createElement("section", {
    className: "pop-over-actions collaborator-actions"
  }, _react.default.createElement(_analytics.TrackClick, {
    name: "Leave Project clicked"
  }, _react.default.createElement(PopoverButton, {
    onClick: leaveProject,
    text: "Leave Project ",
    emoji: "wave"
  }))), (props.currentUserIsOnProject || !!props.removeProjectFromTeam) && !props.removeProjectFromCollection && _react.default.createElement("section", {
    className: "pop-over-actions danger-zone last-section"
  }, !!props.removeProjectFromTeam && _react.default.createElement(PopoverButton, {
    onClick: function onClick() {
      return props.removeProjectFromTeam(props.project.id);
    },
    text: "Remove Project ",
    emoji: "thumbs_down"
  }), props.currentUserIsOnProject && !props.removeProjectFromCollection && _react.default.createElement(_analytics.TrackClick, {
    name: "Delete Project clicked"
  }, _react.default.createElement(PopoverButton, {
    onClick: animateThenDeleteProject,
    text: "Delete Project ",
    emoji: "bomb"
  }))), props.removeProjectFromCollection && _react.default.createElement("section", {
    className: "pop-over-actions danger-zone last-section"
  }, props.removeProjectFromCollection && _react.default.createElement(PopoverButton, {
    onClick: function onClick() {
      return props.removeProjectFromCollection(props.project);
    },
    text: "Remove from Collection",
    emoji: "thumbs_down"
  })));
}; // Project Options Pop


const ProjectOptionsPop = function ProjectOptionsPop(_ref2) {
  let props = Object.assign({}, _ref2);
  return _react.default.createElement(_popoverNested.NestedPopover, {
    alternateContent: function alternateContent() {
      return _react.default.createElement(_addProjectToCollectionPop.default, _extends({}, props, {
        api: props.api,
        togglePopover: props.togglePopover
      }));
    },
    startAlternateVisible: false
  }, function (addToCollectionPopover) {
    return _react.default.createElement(ProjectOptionsContent, _extends({}, props, {
      addToCollectionPopover: addToCollectionPopover
    }));
  });
};

ProjectOptionsPop.propTypes = {
  api: _propTypes.default.any,
  currentUser: _propTypes.default.object,
  project: _propTypes.default.shape({
    users: _propTypes.default.array.isRequired
  }),
  togglePopover: _propTypes.default.func.isRequired,
  addPin: _propTypes.default.func,
  removePin: _propTypes.default.func,
  deleteProject: _propTypes.default.func,
  leaveProject: _propTypes.default.func,
  removeProjectFromTeam: _propTypes.default.func,
  joinTeamProject: _propTypes.default.func,
  leaveTeamProject: _propTypes.default.func,
  currentUserIsOnProject: _propTypes.default.bool.isRequired
};
ProjectOptionsPop.defaultProps = {
  currentUserIsOnProject: false
}; // Project Options Container
// create as stateful react component

function ProjectOptions({
  projectOptions = {},
  project,
  api,
  currentCollectionId
}, _ref3) {
  let props = Object.assign({}, _ref3);

  if (Object.keys(projectOptions).length === 0) {
    return null;
  }

  function currentUserIsOnProject(user) {
    let projectUsers = project.users.map(function (projectUser) {
      return projectUser.id;
    });

    if (projectUsers.includes(user.id)) {
      return true;
    }
  }

  return _react.default.createElement(_popoverWithButton.default, {
    buttonClass: "project-options button-borderless opens-pop-over button-small",
    buttonText: _react.default.createElement("div", {
      className: "down-arrow",
      "aria-label": "options"
    }),
    containerClass: "project-options-pop-btn",
    passToggleToPop: true
  }, _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (user, fetched, funcs, consumerProps) {
    return _react.default.createElement(ProjectOptionsPop, _extends({}, consumerProps, props, projectOptions, {
      project: project,
      currentCollectionId: currentCollectionId,
      api: api,
      currentUser: user,
      currentUserIsOnProject: currentUserIsOnProject(user)
    }));
  }));
}

ProjectOptions.propTypes = {
  api: _propTypes.default.func,
  currentCollectionId: _propTypes.default.number,
  project: _propTypes.default.object.isRequired
};

/***/ }),

/***/ "./src/presenters/pop-overs/report-abuse-pop.jsx":
/*!*******************************************************!*\
  !*** ./src/presenters/pop-overs/report-abuse-pop.jsx ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _trimStart2 = _interopRequireDefault(__webpack_require__(/*! lodash/trimStart */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/trimStart.js"));

var _debounce2 = _interopRequireDefault(__webpack_require__(/*! lodash/debounce */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/debounce.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ./popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

var _editableField = __webpack_require__(/*! ../includes/editable-field.jsx */ "./src/presenters/includes/editable-field.jsx");

var _emailAddresses = __webpack_require__(/*! email-addresses */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/email-addresses/3.0.3/node_modules/email-addresses/lib/email-addresses.js");

var _axios = _interopRequireDefault(__webpack_require__(/*! axios */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/axios/0.18.0/node_modules/axios/index.js"));

var _sentry = __webpack_require__(/*! ../../utils/sentry */ "./src/utils/sentry.js");

var _abuseReporting = __webpack_require__(/*! ../../utils/abuse-reporting.js */ "./src/utils/abuse-reporting.js");

var _loader = _interopRequireDefault(__webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx"));

var _currentUser = __webpack_require__(/*! ../current-user.jsx */ "./src/presenters/current-user.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class ReportAbusePop extends _react.default.Component {
  constructor(props) {
    var _this;

    _this = super(props);

    if (this.props.reportedType == "user") {
      this.defaultReason = `This user profile doesn't seem appropriate for Glitch because...`;
    } else if (this.props.reportedType == "home") {
      this.defaultReason = `[Something here] doesn't seem appropriate for Glitch because...`;
    } else {
      this.defaultReason = `This ${props.reportedType} doesn't seem appropriate for Glitch because...`;
    }

    this.state = {
      reason: this.defaultReason,
      email: "",
      emailError: "",
      reasonError: "",
      submitted: false,
      loading: false
    };
    this.submitReport = this.submitReport.bind(this);
    this.reasonOnChange = this.reasonOnChange.bind(this);
    this.formatRaw = this.formatRaw.bind(this);
    this.getUserInfoSection = this.getUserInfoSection.bind(this);
    this.emailOnChange = this.emailOnChange.bind(this);
    this.validateNotEmpty = this.validateNotEmpty.bind(this);
    this.validateReason = this.validateReason.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.renderSuccess = this.renderSuccess.bind(this);
    this.renderFailure = this.renderFailure.bind(this);
    this.pickFormBody = this.pickFormBody.bind(this);
    this.debouncedValidateEmail = (0, _debounce2.default)(function () {
      return _this.validateEmail();
    }, 200);
    this.debouncedValidateReason = (0, _debounce2.default)(function () {
      return _this.validateReason();
    }, 200);
  }

  formatRaw() {
    return (0, _abuseReporting.getAbuseReportBody)(this.props.currentUser, this.state.email, this.props.reportedType, this.props.reportedModel, this.state.reason);
  }

  async submitReport() {
    try {
      const emailErrors = this.validateEmail();
      const reasonErrors = this.validateReason();

      if (emailErrors.emailError != "" || reasonErrors.reasonError != "") {
        return;
      }

      this.setState({
        loading: true
      });
      await _axios.default.post("https://support-poster.glitch.me/post", {
        raw: this.formatRaw(),
        title: (0, _abuseReporting.getAbuseReportTitle)(this.props.reportedModel, this.props.reportedType)
      });
      this.setState({
        submitted: true,
        submitSuccess: true,
        loading: false
      });
    } catch (error) {
      (0, _sentry.captureException)(error);
      this.setState({
        submitted: true,
        submitSuccess: false,
        loading: false
      });
    }
  }

  validateNotEmpty(stateField, errorField, fieldDescription) {
    let errorObj;

    if (this.state[stateField] === "") {
      errorObj = {
        [errorField]: `${fieldDescription} is required`
      };
    } else {
      errorObj = {
        [errorField]: ""
      };
    }

    this.setState(errorObj);
    return errorObj;
  }

  validateReason() {
    let errorObj = this.validateNotEmpty("reason", "reasonError", "A description of the issue");

    if (errorObj.reasonError == "" && this.state.reason === this.defaultReason) {
      errorObj = {
        reasonError: "Reason is required"
      };
      this.setState(errorObj);
    }

    return errorObj;
  }

  validateEmail() {
    if (this.props.currentUser.login) {
      return {
        emailError: ""
      };
    }

    let errors = this.validateNotEmpty("email", "emailError", "Email");

    if (errors.emailError != "") {
      return errors;
    }

    const email = (0, _emailAddresses.parseOneAddress)(this.state.email);

    if (!email) {
      errors = {
        emailError: "Please enter a valid email"
      };
    } else {
      errors = {
        emailError: ""
      };
    }

    this.setState(errors);
    return errors;
  }

  reasonOnChange(value) {
    this.setState({
      reason: value
    });
    this.debouncedValidateReason();
  }

  emailOnChange(value) {
    this.setState({
      email: value
    });
    this.debouncedValidateEmail();
  }

  getUserInfoSection() {
    var _this2 = this;

    if (this.props.currentUser.login) {
      return _react.default.createElement("section", {
        className: "pop-over-info"
      }, _react.default.createElement("p", {
        className: "info-description right"
      }, "from ", _react.default.createElement("strong", null, this.props.currentUser.login)));
    }

    return _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement(_editableField.PureEditableField, {
      value: this.state.email,
      update: this.emailOnChange,
      blur: function blur() {
        return _this2.debouncedValidateEmail();
      },
      placeholder: "your@email.com",
      error: this.state.emailError,
      inputType: "email"
    }));
  }

  renderForm() {
    var _this3 = this;

    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("h1", {
      className: "pop-title"
    }, "Report Abuse")), _react.default.createElement("section", {
      className: "pop-over-actions"
    }, _react.default.createElement(_editableField.PureEditableTextArea, {
      value: this.state.reason,
      update: this.reasonOnChange,
      blur: function blur() {
        return _this3.debouncedValidateReason();
      },
      autoFocus: true // eslint-disable-line jsx-a11y/no-autofocus
      ,
      placeholder: "",
      error: this.state.reasonError
    })), this.getUserInfoSection(), _react.default.createElement("section", {
      className: "pop-over-actions"
    }, this.state.loading ? _react.default.createElement(_loader.default, null) : _react.default.createElement("button", {
      className: "button button-small",
      onClick: this.submitReport
    }, "Submit Report")));
  }

  renderSuccess() {
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("h1", {
      className: "pop-title"
    }, "Report Abuse")), _react.default.createElement("section", {
      className: "pop-over-actions"
    }, _react.default.createElement("div", {
      className: "notification notifySuccess"
    }, "Report Sent"), _react.default.createElement("p", {
      className: "pop-description tight-line"
    }, "Thanks for helping to keep Glitch a safe, friendly community", " ", _react.default.createElement("span", {
      className: "emoji park",
      role: "img",
      "aria-label": ""
    }))));
  }

  renderFailure() {
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("h1", {
      className: "pop-title"
    }, "Failed to Send", " ", _react.default.createElement("span", {
      className: "emoji sick",
      role: "img",
      "aria-label": ""
    }))), _react.default.createElement("section", {
      className: "pop-over-info"
    }, _react.default.createElement("p", {
      className: "info-description"
    }, "But you can still send us your message by emailing the details below to ", _react.default.createElement("b", null, "support@glitch.com"))), _react.default.createElement("section", {
      className: "pop-over-actions"
    }, _react.default.createElement("textarea", {
      className: "content-editable tall-text traditional",
      value: (0, _trimStart2.default)(this.formatRaw()),
      readOnly: true
    })));
  }

  pickFormBody() {
    if (this.state.submitted) {
      if (!this.state.submitSuccess) {
        return this.renderFailure();
      }

      return this.renderSuccess();
    }

    return this.renderForm();
  }

  render() {
    return _react.default.createElement("dialog", {
      className: "pop-over wide-pop top-right report-abuse-pop"
    }, this.pickFormBody());
  }

}

ReportAbusePop.propTypes = {
  reportedType: _propTypes.default.string.isRequired,
  // 'project', 'collection', 'user', 'team'
  reportedModel: _propTypes.default.object.isRequired,
  // the actual model
  currentUser: _propTypes.default.object
};

const ReportAbusePopContainer = function ReportAbusePopContainer(props) {
  return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
    return _react.default.createElement(ReportAbusePop, _extends({
      currentUser: currentUser
    }, props));
  });
};

const ReportAbusePopButton = function ReportAbusePopButton(props) {
  return _react.default.createElement(_popoverWithButton.default, {
    buttonClass: "button-small button-tertiary margin",
    buttonText: "Report Abuse"
  }, _react.default.createElement(ReportAbusePopContainer, {
    reportedType: props.reportedType,
    reportedModel: props.reportedModel
  }));
};

ReportAbusePopButton.propTypes = {
  reportedType: _propTypes.default.string.isRequired,
  // 'project', 'collection', 'user', 'team'
  reportedModel: _propTypes.default.object // the actual model, or null if no model (like for the home page)

};
var _default = ReportAbusePopButton;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/sign-in-pop.jsx":
/*!**************************************************!*\
  !*** ./src/presenters/pop-overs/sign-in-pop.jsx ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = SignInPopContainer;
exports.SignInPop = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _reactRouterDom = __webpack_require__(/*! react-router-dom */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react-router-dom/4.3.1/node_modules/react-router-dom/es/index.js");

var _dayjs = _interopRequireDefault(__webpack_require__(/*! dayjs */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/dayjs/1.8.0/node_modules/dayjs/dayjs.min.js"));

var _link = _interopRequireDefault(__webpack_require__(/*! ../includes/link */ "./src/presenters/includes/link.jsx"));

var _localStorage = _interopRequireDefault(__webpack_require__(/*! ../includes/local-storage */ "./src/presenters/includes/local-storage.jsx"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ./popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

var _sentry = __webpack_require__(/*! ../../utils/sentry */ "./src/utils/sentry.js");

var _currentUser = __webpack_require__(/*! ../current-user */ "./src/presenters/current-user.jsx");

var _popoverNested = __webpack_require__(/*! ./popover-nested.jsx */ "./src/presenters/pop-overs/popover-nested.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/* global GITHUB_CLIENT_ID, FACEBOOK_CLIENT_ID, APP_URL */
function githubAuthLink() {
  const params = new URLSearchParams();
  params.append('client_id', GITHUB_CLIENT_ID);
  params.append('scope', 'user:email');
  params.append('redirect_uri', `${APP_URL}/login/github`);
  return `https://github.com/login/oauth/authorize?${params}`;
}

function facebookAuthLink() {
  const params = new URLSearchParams();
  params.append('client_id', FACEBOOK_CLIENT_ID);
  params.append('scope', 'email');
  params.append('redirect_uri', `${APP_URL}/login/facebook`);
  return `https://www.facebook.com/v2.9/dialog/oauth?${params}`;
}

const SignInPopButton = function SignInPopButton(props) {
  return _react.default.createElement(_link.default, {
    className: "button button-small button-link has-emoji",
    to: props.href,
    onClick: props.onClick
  }, "Sign in with ", props.company, " ", _react.default.createElement("span", {
    className: `emoji ${props.emoji}`
  }));
};

class EmailHandler extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      done: false,
      error: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    this.setState({
      done: true
    });

    try {
      await this.props.api.post('/email/sendLoginEmail', {
        emailAddress: this.state.email
      });
      this.setState({
        error: false
      });
    } catch (error) {
      (0, _sentry.captureException)(error);
      this.setState({
        error: true
      });
    }
  }

  render() {
    var _this = this;

    const isEnabled = this.state.email.length > 0;
    return _react.default.createElement(_popoverNested.NestedPopover, {
      alternateContent: function alternateContent() {
        return _react.default.createElement(SignInWithConsumer, _this.props);
      },
      startAlternateVisible: false
    }, function (showCodeLogin) {
      return _react.default.createElement("dialog", {
        className: "pop-over sign-in-pop"
      }, _react.default.createElement(_popoverNested.NestedPopoverTitle, null, "Email Sign In ", _react.default.createElement("span", {
        className: "emoji email"
      })), _react.default.createElement("section", {
        className: "pop-over-actions first-section"
      }, !_this.state.done && _react.default.createElement("form", {
        onSubmit: _this.onSubmit,
        style: {
          marginBottom: 0
        }
      }, _react.default.createElement("input", {
        value: _this.state.email,
        onChange: _this.onChange,
        className: "pop-over-input",
        type: "email",
        placeholder: "new@user.com"
      }), _react.default.createElement("button", {
        style: {
          marginTop: 10
        },
        className: "button-small button-link",
        disabled: !isEnabled
      }, "Send Link")), _this.state.done && !_this.state.error && _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
        className: "notification notifyPersistent notifySuccess"
      }, "Almost Done"), _react.default.createElement("div", null, "Finish signing in from the email sent to ", _this.state.email, ".")), _this.state.done && _this.state.error && _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
        className: "notification notifyPersistent notifyError"
      }, "Error"), _react.default.createElement("div", null, "Something went wrong, email not sent."))), _this.state.done && !_this.state.error && _react.default.createElement(SignInCodeSection, {
        onClick: function onClick() {
          showCodeLogin(_this.props.api);
        }
      }));
    });
  }

}

class SignInCodeHandler extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      done: false,
      error: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      code: e.target.value
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    this.setState({
      done: true
    });

    try {
      const {
        data
      } = await this.props.api.post('/auth/email/' + this.state.code);
      this.props.setUser(data);
      this.setState({
        error: false
      });
    } catch (error) {
      (0, _sentry.captureException)(error);
      this.setState({
        error: true
      });
    }
  }

  render() {
    const isEnabled = this.state.code.length > 0;
    return _react.default.createElement("dialog", {
      className: "pop-over sign-in-pop"
    }, _react.default.createElement(_popoverNested.NestedPopoverTitle, null, "Use a sign in code"), _react.default.createElement("section", {
      className: "pop-over-actions first-section"
    }, !this.state.done && _react.default.createElement("form", {
      onSubmit: this.onSubmit,
      style: {
        marginBottom: 0
      }
    }, "Paste your temporary sign in code below", _react.default.createElement("input", {
      value: this.state.code,
      onChange: this.onChange,
      className: "pop-over-input",
      type: "text",
      placeholder: "cute-unique-cosmos"
    }), _react.default.createElement("button", {
      style: {
        marginTop: 10
      },
      className: "button-small button-link",
      disabled: !isEnabled
    }, "Sign In")), this.state.done && !this.state.error && _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
      className: "notification notifyPersistent notifySuccess"
    }, "Success!")), this.state.done && this.state.error && _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
      className: "notification notifyPersistent notifyError"
    }, "Error"), _react.default.createElement("div", null, "Code not found or already used. Try signing in with email."))));
  }

}

const SignInWithConsumer = function SignInWithConsumer(props) {
  return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser, fetched, {
    login
  }) {
    return _react.default.createElement(SignInCodeHandler, _extends({
      setUser: login
    }, props));
  });
};

const EmailSignInButton = function EmailSignInButton({
  onClick: _onClick
}) {
  return _react.default.createElement("button", {
    className: "button button-small button-link has-emoji",
    onClick: function onClick() {
      _onClick();
    }
  }, "Sign in with Email ", _react.default.createElement("span", {
    className: "emoji email"
  }));
};

EmailSignInButton.propTypes = {
  onClick: _propTypes.default.func.isRequired
};

const SignInCodeSection = function SignInCodeSection({
  onClick
}) {
  return _react.default.createElement("section", {
    className: "pop-over-actions last-section pop-over-info"
  }, _react.default.createElement("button", {
    className: "button-small button-tertiary button-on-secondary-background",
    onClick: onClick
  }, _react.default.createElement("span", null, "Use a sign in code")));
};

SignInCodeSection.propTypes = {
  onClick: _propTypes.default.func.isRequired
};

const SignInPopWithoutRouter = function SignInPopWithoutRouter(props) {
  return _react.default.createElement(_localStorage.default, {
    name: "destinationAfterAuth"
  }, function (destination, setDestination) {
    const _onClick2 = function onClick() {
      return setDestination({
        expires: (0, _dayjs.default)().add(10, 'minutes').toISOString(),
        to: {
          pathname: location.pathname,
          search: location.search,
          hash: hash
        }
      });
    };

    const {
      header,
      prompt,
      api,
      location,
      hash
    } = props;
    return _react.default.createElement(_popoverNested.NestedPopover, {
      alternateContent: function alternateContent() {
        return _react.default.createElement(EmailHandler, props);
      },
      startAlternateVisible: false
    }, function (showEmailLogin) {
      return _react.default.createElement(_popoverNested.NestedPopover, {
        alternateContent: function alternateContent() {
          return _react.default.createElement(SignInWithConsumer, props);
        },
        startAlternateVisible: false
      }, function (showCodeLogin) {
        return _react.default.createElement("div", {
          className: "pop-over sign-in-pop"
        }, header, _react.default.createElement("section", {
          className: "pop-over-actions first-section"
        }, prompt, _react.default.createElement(SignInPopButton, {
          href: facebookAuthLink(),
          company: "Facebook",
          emoji: "facebook",
          onClick: _onClick2
        }), _react.default.createElement(SignInPopButton, {
          href: githubAuthLink(),
          company: "GitHub",
          emoji: "octocat",
          onClick: _onClick2
        }), _react.default.createElement(EmailSignInButton, {
          onClick: function onClick() {
            _onClick2();

            showEmailLogin(api);
          }
        })), _react.default.createElement(SignInCodeSection, {
          onClick: function onClick() {
            _onClick2();

            showCodeLogin(api);
          }
        }));
      });
    });
  });
};

const SignInPop = (0, _reactRouterDom.withRouter)(SignInPopWithoutRouter);
exports.SignInPop = SignInPop;
SignInPop.propTypes = {
  api: _propTypes.default.func.isRequired,
  header: _propTypes.default.node,
  prompt: _propTypes.default.node,
  hash: _propTypes.default.string
};

function SignInPopContainer(props) {
  return _react.default.createElement(_popoverWithButton.default, {
    buttonClass: "button button-small",
    buttonText: "Sign in",
    passToggleToPop: true
  }, _react.default.createElement(SignInPop, props));
}

/***/ }),

/***/ "./src/presenters/pop-overs/team-analytics-project-pop.jsx":
/*!*****************************************************************!*\
  !*** ./src/presenters/pop-overs/team-analytics-project-pop.jsx ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _projectResultItem = _interopRequireDefault(__webpack_require__(/*! ../includes/project-result-item.jsx */ "./src/presenters/includes/project-result-item.jsx"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ./popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const AllProjectsItem = function AllProjectsItem({
  currentProjectDomain,
  action
}) {
  const BENTO_BOX = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png?1502469566743';
  let resultsClass = "button-unstyled result";

  if (!currentProjectDomain) {
    resultsClass += " active";
  }

  return _react.default.createElement("button", {
    className: resultsClass,
    onClick: action
  }, _react.default.createElement("img", {
    className: "avatar",
    src: BENTO_BOX,
    alt: "Bento emoji"
  }), _react.default.createElement("div", {
    className: "result-name",
    title: "All Projects"
  }, "All Projects"));
};

AllProjectsItem.propTypes = {
  currentProjectDomain: _propTypes.default.string.isRequired,
  action: _propTypes.default.func.isRequired
};

const isActive = function isActive(currentProjectDomain, project) {
  if (currentProjectDomain === project.domain) {
    return true;
  }
};

const PopOver = function PopOver({
  projects,
  togglePopover,
  setFilter,
  filter,
  updateProjectDomain,
  currentProjectDomain
}) {
  const _onClick = function onClick(domain) {
    togglePopover();
    updateProjectDomain(domain);
    setFilter("");
  };

  const filteredProjects = projects.filter(function ({
    domain
  }) {
    return domain.toLowerCase().includes(filter.toLowerCase());
  });
  return _react.default.createElement("dialog", {
    className: "pop-over analytics-projects-pop wide-pop"
  }, _react.default.createElement("section", {
    className: "pop-over-info"
  }, _react.default.createElement("input", {
    autoFocus: true // eslint-disable-line jsx-a11y/no-autofocus
    ,
    onChange: function onChange(event) {
      setFilter(event.target.value);
    },
    id: "analytics-project-filter",
    className: "pop-over-input search-input pop-over-search",
    placeholder: "Filter projects",
    value: filter
  })), _react.default.createElement("section", {
    className: "pop-over-actions results-list"
  }, _react.default.createElement("ul", {
    className: "results"
  }, _react.default.createElement("li", {
    className: "button-unstyled"
  }, _react.default.createElement(AllProjectsItem, {
    currentProjectDomain: currentProjectDomain,
    action: function action() {
      return _onClick('');
    }
  })), filteredProjects.map(function (project) {
    return _react.default.createElement("li", {
      key: project.id,
      className: "button-unstyled"
    }, _react.default.createElement(_projectResultItem.default, _extends({}, project, {
      onClick: function onClick() {
        return _onClick(project.domain);
      },
      isActive: isActive(currentProjectDomain, project)
    })));
  }))));
};

PopOver.propTypes = {
  projects: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    domain: _propTypes.default.string.isRequired,
    description: _propTypes.default.string.isRequired
  })).isRequired,
  togglePopover: _propTypes.default.func,
  // required but added dynamically
  setFilter: _propTypes.default.func.isRequired,
  filter: _propTypes.default.string.isRequired,
  updateProjectDomain: _propTypes.default.func.isRequired,
  currentProjectDomain: _propTypes.default.string.isRequired
};

class TeamAnalyticsProjectPop extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: ""
    };
    this.setFilter = this.setFilter.bind(this);
  }

  setFilter(query) {
    this.setState({
      filter: query
    });
  }

  render() {
    const {
      updateProjectDomain,
      currentProjectDomain,
      projects
    } = this.props;
    return _react.default.createElement(_popoverWithButton.default, {
      buttonClass: "button-small button-tertiary",
      buttonText: `Filter: ${currentProjectDomain || 'All Projects'}`,
      passToggleToPop: true
    }, _react.default.createElement(PopOver, {
      projects: projects,
      updateProjectDomain: updateProjectDomain,
      currentProjectDomain: currentProjectDomain,
      setFilter: this.setFilter,
      filter: this.state.filter
    }));
  }

}

TeamAnalyticsProjectPop.propTypes = {
  updateProjectDomain: _propTypes.default.func.isRequired,
  currentProjectDomain: _propTypes.default.string.isRequired
};
var _default = TeamAnalyticsProjectPop;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/team-analytics-time-pop.jsx":
/*!**************************************************************!*\
  !*** ./src/presenters/pop-overs/team-analytics-time-pop.jsx ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _popoverWithButton = _interopRequireDefault(__webpack_require__(/*! ./popover-with-button */ "./src/presenters/pop-overs/popover-with-button.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TimeFrameItem = function TimeFrameItem({
  selectTimeFrame,
  isActive,
  timeFrame
}) {
  let resultClass = "result button-unstyled";

  if (isActive) {
    resultClass += " active";
  }

  return _react.default.createElement("button", {
    className: resultClass,
    onClick: selectTimeFrame
  }, _react.default.createElement("div", {
    className: "result-container"
  }, _react.default.createElement("div", {
    className: "result-name"
  }, timeFrame)));
};

TimeFrameItem.propTypes = {
  selectTimeFrame: _propTypes.default.func.isRequired,
  isActive: _propTypes.default.bool.isRequired,
  timeFrame: _propTypes.default.string.isRequired
};
const timeFrames = ["Last 4 Weeks", "Last 2 Weeks", "Last 24 Hours"];

const TeamAnalyticsTimePop = function TeamAnalyticsTimePop(props) {
  const selectTimeFrame = function selectTimeFrame(timeFrame) {
    return function () {
      props.updateTimeFrame(timeFrame);
      props.togglePopover();
    };
  };

  return _react.default.createElement("dialog", {
    className: "pop-over analytics-time-pop"
  }, _react.default.createElement("section", {
    className: "pop-over-actions last-section results-list"
  }, _react.default.createElement("div", {
    className: "results"
  }, timeFrames.map(function (timeFrame) {
    return _react.default.createElement(TimeFrameItem, {
      key: timeFrame,
      selectTimeFrame: selectTimeFrame(timeFrame),
      isActive: props.currentTimeFrame === timeFrame,
      timeFrame: timeFrame
    });
  }))));
};

TeamAnalyticsTimePop.propTypes = {
  updateTimeFrame: _propTypes.default.func.isRequired,
  currentTimeFrame: _propTypes.default.string.isRequired
};

const TeamAnalyticsTimePopButton = function TeamAnalyticsTimePopButton({
  updateTimeFrame,
  currentTimeFrame
}) {
  return _react.default.createElement(_popoverWithButton.default, {
    buttonClass: "button-small button-tertiary button-select",
    buttonText: _react.default.createElement("span", null, currentTimeFrame),
    passToggleToPop: true
  }, _react.default.createElement(TeamAnalyticsTimePop, {
    updateTimeFrame: updateTimeFrame,
    currentTimeFrame: currentTimeFrame
  }));
};

TeamAnalyticsTimePopButton.propTypes = {
  updateTimeFrame: _propTypes.default.func.isRequired,
  currentTimeFrame: _propTypes.default.string.isRequired
};
var _default = TeamAnalyticsTimePopButton;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/team-user-info-pop.jsx":
/*!*********************************************************!*\
  !*** ./src/presenters/pop-overs/team-user-info-pop.jsx ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _user = __webpack_require__(/*! ../../models/user */ "./src/models/user.js");

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _popoverNested = __webpack_require__(/*! ./popover-nested.jsx */ "./src/presenters/pop-overs/popover-nested.jsx");

var _link = __webpack_require__(/*! ../includes/link.jsx */ "./src/presenters/includes/link.jsx");

var _thanks = _interopRequireDefault(__webpack_require__(/*! ../includes/thanks.jsx */ "./src/presenters/includes/thanks.jsx"));

var _teamUserRemovePop = _interopRequireDefault(__webpack_require__(/*! ./team-user-remove-pop.jsx */ "./src/presenters/pop-overs/team-user-remove-pop.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30; // Remove from Team 👋

const RemoveFromTeam = function RemoveFromTeam(props) {
  return _react.default.createElement("section", {
    className: "pop-over-actions danger-zone"
  }, _react.default.createElement(_analytics.TrackClick, {
    name: "Remove from Team clicked"
  }, _react.default.createElement("button", _extends({
    className: "button-small has-emoji button-tertiary button-on-secondary-background"
  }, props), "Remove from Team ", _react.default.createElement("span", {
    className: "emoji wave",
    role: "img",
    "aria-label": ""
  }))));
}; // Admin Actions Section ⏫⏬


const AdminActions = function AdminActions({
  user,
  userIsTeamAdmin,
  updateUserPermissions
}) {
  return _react.default.createElement("section", {
    className: "pop-over-actions admin-actions"
  }, _react.default.createElement("p", {
    className: "action-description"
  }, "Admins can update team info, billing, and remove users"), userIsTeamAdmin ? _react.default.createElement(_analytics.TrackClick, {
    name: "Remove Admin Status clicked"
  }, _react.default.createElement("button", {
    className: "button-small button-tertiary has-emoji",
    onClick: function onClick() {
      return updateUserPermissions(user.id, MEMBER_ACCESS_LEVEL);
    }
  }, "Remove Admin Status ", _react.default.createElement("span", {
    className: "emoji fast-down"
  }))) : _react.default.createElement(_analytics.TrackClick, {
    name: "Make an Admin clicked"
  }, _react.default.createElement("button", {
    className: "button-small button-tertiary has-emoji",
    onClick: function onClick() {
      return updateUserPermissions(user.id, ADMIN_ACCESS_LEVEL);
    }
  }, "Make an Admin ", _react.default.createElement("span", {
    className: "emoji fast-up"
  }))));
};

AdminActions.propTypes = {
  user: _propTypes.default.shape({
    id: _propTypes.default.number.isRequired
  }).isRequired,
  userIsTeamAdmin: _propTypes.default.bool.isRequired,
  updateUserPermissions: _propTypes.default.func.isRequired
}; // Thanks 💖

const ThanksCount = function ThanksCount({
  count
}) {
  return _react.default.createElement("section", {
    className: "pop-over-info"
  }, _react.default.createElement(_thanks.default, {
    count: count
  }));
}; // Team User Info 😍


const TeamUserInfo = function TeamUserInfo(_ref) {
  let {
    currentUser,
    showRemove
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["currentUser", "showRemove"]);

  const userAvatarStyle = {
    backgroundColor: props.user.color
  };
  const canRemoveUser = props.currentUserIsTeamAdmin || currentUser && currentUser.id === props.user.id;
  return _react.default.createElement("dialog", {
    className: "pop-over team-user-info-pop"
  }, _react.default.createElement("section", {
    className: "pop-over-info user-info"
  }, _react.default.createElement(_link.UserLink, {
    user: props.user
  }, _react.default.createElement("img", {
    className: "avatar",
    src: (0, _user.getAvatarThumbnailUrl)(props.user),
    alt: props.user.login,
    style: userAvatarStyle
  })), _react.default.createElement("div", {
    className: "info-container"
  }, _react.default.createElement("p", {
    className: "name",
    title: props.user.name
  }, props.user.name || "Anonymous"), props.user.login && _react.default.createElement("p", {
    className: "user-login",
    title: props.user.login
  }, "@", props.user.login), props.userIsTeamAdmin && _react.default.createElement("div", {
    className: "status-badge"
  }, _react.default.createElement("span", {
    className: "status admin",
    "data-tooltip": "Can edit team info and billing"
  }, "Team Admin")))), props.user.thanksCount > 0 && _react.default.createElement(ThanksCount, {
    count: props.user.thanksCount
  }), props.currentUserIsTeamAdmin && _react.default.createElement(AdminActions, {
    user: props.user,
    userIsTeamAdmin: props.userIsTeamAdmin,
    updateUserPermissions: props.updateUserPermissions
  }), canRemoveUser && !props.userIsTheOnlyMember && _react.default.createElement(RemoveFromTeam, {
    onClick: showRemove
  }));
}; // Team User Remove 💣
// Team User Info or Remove
// uses removeTeamUserVisible state to toggle between showing user info and remove views


const TeamUserInfoAndRemovePop = function TeamUserInfoAndRemovePop(props) {
  return _react.default.createElement(_popoverNested.NestedPopover, {
    alternateContent: function alternateContent() {
      return _react.default.createElement(_teamUserRemovePop.default, props);
    }
  }, function (showRemove) {
    return _react.default.createElement(TeamUserInfo, _extends({}, props, {
      showRemove: showRemove
    }));
  });
};

TeamUserInfoAndRemovePop.propTypes = {
  user: _propTypes.default.shape({
    name: _propTypes.default.string,
    login: _propTypes.default.string,
    thanksCount: _propTypes.default.number.isRequired,
    color: _propTypes.default.string
  }).isRequired,
  currentUserIsOnTeam: _propTypes.default.bool.isRequired,
  currentUserIsTeamAdmin: _propTypes.default.bool.isRequired,
  removeUserFromTeam: _propTypes.default.func.isRequired,
  userIsTeamAdmin: _propTypes.default.bool.isRequired,
  userIsTheOnlyMember: _propTypes.default.bool.isRequired,
  api: _propTypes.default.func.isRequired,
  teamId: _propTypes.default.number.isRequired,
  updateUserPermissions: _propTypes.default.func.isRequired,
  team: _propTypes.default.shape({
    projects: _propTypes.default.array.isRequired
  })
};
TeamUserInfoAndRemovePop.defaultProps = {
  currentUserIsOnTeam: false
};
var _default = TeamUserInfoAndRemovePop;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/team-user-remove-pop.jsx":
/*!***********************************************************!*\
  !*** ./src/presenters/pop-overs/team-user-remove-pop.jsx ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.TeamUserRemovePop = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _loader = _interopRequireDefault(__webpack_require__(/*! ../includes/loader.jsx */ "./src/presenters/includes/loader.jsx"));

var _notifications = _interopRequireDefault(__webpack_require__(/*! ../notifications.jsx */ "./src/presenters/notifications.jsx"));

var _popoverNested = __webpack_require__(/*! ./popover-nested.jsx */ "./src/presenters/pop-overs/popover-nested.jsx");

var _user = __webpack_require__(/*! ../../models/user */ "./src/models/user.js");

var _project = __webpack_require__(/*! ../../models/project */ "./src/models/project.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class TeamUserRemovePopBase extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      gettingUser: true,
      userTeamProjects: [],
      selectedProjects: new Set()
    };
    this.selectAllProjects = this.selectAllProjects.bind(this);
    this.unselectAllProjects = this.unselectAllProjects.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  removeUser() {
    this.props.togglePopover();
    this.props.createNotification(`${(0, _user.getDisplayName)(this.props.user)} removed from Team`);
    this.props.removeUserFromTeam(this.props.user.id, Array.from(this.state.selectedProjects));
  }

  selectAllProjects() {
    this.setState(function ({
      userTeamProjects
    }) {
      return {
        selectedProjects: new Set(userTeamProjects.map(function (p) {
          return p.id;
        }))
      };
    });
  }

  unselectAllProjects() {
    this.setState({
      selectedProjects: new Set()
    });
  }

  handleCheckboxChange(evt) {
    const {
      checked,
      value
    } = evt.target;
    this.setState(function ({
      selectedProjects
    }) {
      selectedProjects = new Set(selectedProjects);

      if (checked) {
        selectedProjects.add(value);
      } else {
        selectedProjects.delete(value);
      }

      return {
        selectedProjects
      };
    });
  }

  async getUserWithProjects() {
    var _this = this;

    const {
      data
    } = await this.props.api.get(`users/${this.props.user.id}`);
    this.setState({
      userTeamProjects: data.projects.filter(function (userProj) {
        return _this.props.team.projects.some(function (teamProj) {
          return teamProj.id === userProj.id;
        });
      }),
      gettingUser: false
    });
  }

  componentDidMount() {
    this.getUserWithProjects();
  }

  render() {
    var _this2 = this;

    const allProjectsSelected = this.state.userTeamProjects.every(function (p) {
      return _this2.state.selectedProjects.has(p.id);
    });
    const userAvatarStyle = {
      backgroundColor: this.props.user.color
    };
    let projects = null;

    if (this.state.gettingUser) {
      projects = _react.default.createElement(_loader.default, null);
    } else if (this.state.userTeamProjects.length > 0) {
      projects = _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("p", {
        className: "action-description"
      }, "Also remove them from these projects"), _react.default.createElement("div", {
        className: "projects-list"
      }, this.state.userTeamProjects.map(function (project) {
        return _react.default.createElement("label", {
          key: project.id,
          htmlFor: `remove-user-project-${project.id}`
        }, _react.default.createElement("input", {
          className: "checkbox-project",
          type: "checkbox",
          id: `remove-user-project-${project.id}`,
          checked: _this2.state.selectedProjects.has(project.id),
          value: project.id,
          onChange: _this2.handleCheckboxChange
        }), _react.default.createElement("img", {
          className: "avatar",
          src: (0, _project.getAvatarUrl)(project.id),
          alt: ""
        }), project.domain);
      })), this.state.userTeamProjects.length > 1 && _react.default.createElement("button", {
        className: "button-small",
        onClick: allProjectsSelected ? this.unselectAllProjects : this.selectAllProjects
      }, allProjectsSelected ? 'Unselect All' : 'Select All'));
    }

    return _react.default.createElement("dialog", {
      className: "pop-over team-user-info-pop team-user-remove-pop"
    }, _react.default.createElement(_popoverNested.NestedPopoverTitle, null, "Remove ", (0, _user.getDisplayName)(this.props.user)), _react.default.createElement("section", {
      className: "pop-over-actions",
      id: "user-team-projects"
    }, projects || _react.default.createElement("p", {
      className: "action-description"
    }, (0, _user.getDisplayName)(this.props.user), " is not a member of any projects")), _react.default.createElement("section", {
      className: "pop-over-actions danger-zone"
    }, _react.default.createElement(_analytics.TrackClick, {
      name: "Remove from Team submitted"
    }, _react.default.createElement("button", {
      className: "button-small has-emoji",
      onClick: this.removeUser
    }, "Remove ", _react.default.createElement("img", {
      className: "emoji avatar",
      src: (0, _user.getAvatarThumbnailUrl)(this.props.user),
      alt: this.props.user.login,
      style: userAvatarStyle
    })))));
  }

}

TeamUserRemovePopBase.propTypes = {
  api: _propTypes.default.func.isRequired,
  user: _propTypes.default.shape({
    name: _propTypes.default.string,
    login: _propTypes.default.string,
    thanksCount: _propTypes.default.number.isRequired,
    isOnTeam: _propTypes.default.bool,
    color: _propTypes.default.string
  }).isRequired,
  team: _propTypes.default.shape({
    projects: _propTypes.default.array.isRequired
  }),
  removeUserFromTeam: _propTypes.default.func.isRequired,
  createNotification: _propTypes.default.func.isRequired
};

const TeamUserRemovePop = function TeamUserRemovePop(props) {
  return _react.default.createElement(_notifications.default, null, function (notifyFuncs) {
    return _react.default.createElement(TeamUserRemovePopBase, _extends({}, notifyFuncs, props));
  });
};

exports.TeamUserRemovePop = TeamUserRemovePop;
var _default = TeamUserRemovePop;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/pop-overs/user-options-pop.jsx":
/*!*******************************************************!*\
  !*** ./src/presenters/pop-overs/user-options-pop.jsx ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = UserOptionsAndCreateTeamPopContainer;

var _orderBy2 = _interopRequireDefault(__webpack_require__(/*! lodash/orderBy */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/orderBy.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _team = __webpack_require__(/*! ../../models/team */ "./src/models/team.js");

var _user = __webpack_require__(/*! ../../models/user */ "./src/models/user.js");

var _analytics = __webpack_require__(/*! ../analytics */ "./src/presenters/analytics.jsx");

var _link = __webpack_require__(/*! ../includes/link.jsx */ "./src/presenters/includes/link.jsx");

var _popoverContainer = _interopRequireDefault(__webpack_require__(/*! ./popover-container.jsx */ "./src/presenters/pop-overs/popover-container.jsx"));

var _popoverNested = __webpack_require__(/*! ./popover-nested.jsx */ "./src/presenters/pop-overs/popover-nested.jsx");

var _createTeamPop = _interopRequireDefault(__webpack_require__(/*! ./create-team-pop.jsx */ "./src/presenters/pop-overs/create-team-pop.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Create Team button
const CreateTeamButton = function CreateTeamButton({
  showCreateTeam,
  userIsAnon
}) {
  if (userIsAnon) {
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("p", {
      className: "description action-description"
    }, _react.default.createElement("button", {
      onClick: showCreateTeam,
      className: "button-unstyled link"
    }, "Sign in"), " to create teams"), _react.default.createElement("button", {
      className: "button button-small has-emoji",
      disabled: true
    }, "Create Team ", _react.default.createElement("span", {
      className: "emoji herb"
    })));
  }

  return _react.default.createElement(_analytics.TrackClick, {
    name: "Create Team clicked"
  }, _react.default.createElement("button", {
    onClick: showCreateTeam,
    className: "button button-small has-emoji"
  }, "Create Team ", _react.default.createElement("span", {
    className: "emoji herb"
  })));
};

CreateTeamButton.propTypes = {
  showCreateTeam: _propTypes.default.func.isRequired,
  userIsAnon: _propTypes.default.bool.isRequired
}; // Team List

const TeamList = function TeamList({
  teams,
  showCreateTeam,
  userIsAnon
}) {
  const orderedTeams = (0, _orderBy2.default)(teams, function (team) {
    return team.name.toLowerCase();
  });
  return _react.default.createElement("section", {
    className: "pop-over-actions"
  }, orderedTeams.map(function (team) {
    return _react.default.createElement("div", {
      className: "button-wrap",
      key: team.id
    }, _react.default.createElement(_link.TeamLink, {
      key: team.id,
      team: team,
      className: "button button-small has-emoji button-tertiary"
    }, team.name, "\xA0", _react.default.createElement("img", {
      className: "emoji avatar",
      src: (0, _team.getAvatarUrl)(Object.assign({}, team, {
        size: 'small'
      })),
      alt: "",
      width: "16px",
      height: "16px"
    })));
  }), _react.default.createElement(CreateTeamButton, {
    showCreateTeam: showCreateTeam,
    userIsAnon: userIsAnon
  }));
};

TeamList.propTypes = {
  teams: _propTypes.default.arrayOf(_propTypes.default.shape({
    hasAvatarImage: _propTypes.default.bool.isRequired,
    id: _propTypes.default.number.isRequired,
    name: _propTypes.default.string.isRequired,
    url: _propTypes.default.string.isRequired
  })),
  showCreateTeam: _propTypes.default.func.isRequired,
  userIsAnon: _propTypes.default.bool.isRequired
}; // User Options 🧕

const UserOptionsPop = function UserOptionsPop({
  togglePopover,
  showCreateTeam,
  user,
  signOut,
  showNewStuffOverlay
}) {
  const clickNewStuff = function clickNewStuff(event) {
    togglePopover();
    showNewStuffOverlay();
    event.stopPropagation();
  };

  const clickSignout = function clickSignout() {
    if (!user.login) {
      if (!window.confirm(`You won't be able to sign back in under this same anonymous account.
Are you sure you want to sign out?`)) {
        return;
      }
    }

    togglePopover();
    /* global analytics */

    analytics.track("Logout");
    analytics.reset();
    signOut();
  };

  const userName = user.name || "Anonymous";
  const userAvatarStyle = {
    backgroundColor: user.color
  };
  return _react.default.createElement("dialog", {
    className: "pop-over user-options-pop"
  }, _react.default.createElement(_link.UserLink, {
    user: user,
    className: "user-info"
  }, _react.default.createElement("section", {
    className: "pop-over-actions user-info"
  }, _react.default.createElement("img", {
    className: "avatar",
    src: (0, _user.getAvatarThumbnailUrl)(user),
    alt: "Your avatar",
    style: userAvatarStyle
  }), _react.default.createElement("div", {
    className: "info-container"
  }, _react.default.createElement("p", {
    className: "name",
    title: userName
  }, userName), user.login && _react.default.createElement("p", {
    className: "user-login",
    title: user.login
  }, "@", user.login)))), _react.default.createElement(TeamList, {
    teams: user.teams,
    showCreateTeam: showCreateTeam,
    userIsAnon: !user.login
  }), _react.default.createElement("section", {
    className: "pop-over-info"
  }, _react.default.createElement("button", {
    onClick: clickNewStuff,
    className: "button-small has-emoji button-tertiary button-on-secondary-background"
  }, "New Stuff ", _react.default.createElement("span", {
    className: "emoji dog-face"
  })), _react.default.createElement(_link.Link, {
    to: "https://support.glitch.com",
    className: "button button-small has-emoji button-tertiary button-on-secondary-background"
  }, "Support ", _react.default.createElement("span", {
    className: "emoji ambulance"
  })), _react.default.createElement("button", {
    onClick: clickSignout,
    className: "button-small has-emoji button-tertiary button-on-secondary-background"
  }, "Sign Out ", _react.default.createElement("span", {
    className: "emoji balloon"
  }))));
};

UserOptionsPop.propTypes = {
  togglePopover: _propTypes.default.func.isRequired,
  showCreateTeam: _propTypes.default.func.isRequired,
  user: _propTypes.default.object.isRequired,
  signOut: _propTypes.default.func.isRequired,
  showNewStuffOverlay: _propTypes.default.func.isRequired
};

class CheckForCreateTeamHash extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: window.location.hash === '#create-team'
    };
  }

  componentDidMount() {
    this.setState({
      active: false
    });
  }

  render() {
    return this.props.children(this.state.active);
  }

} // Header button and init pop


function UserOptionsAndCreateTeamPopContainer(props) {
  const avatarUrl = (0, _user.getAvatarThumbnailUrl)(props.user);
  const avatarStyle = {
    backgroundColor: props.user.color
  };
  return _react.default.createElement(CheckForCreateTeamHash, null, function (createTeamOpen) {
    return _react.default.createElement(_popoverContainer.default, {
      startOpen: createTeamOpen
    }, function ({
      togglePopover,
      visible
    }) {
      return _react.default.createElement("div", {
        className: "button user-options-pop-button",
        "data-tooltip": "User options",
        "data-tooltip-right": "true"
      }, _react.default.createElement("button", {
        className: "user",
        onClick: togglePopover,
        disabled: !props.user.id
      }, _react.default.createElement("img", {
        className: "user-avatar",
        src: avatarUrl,
        style: avatarStyle,
        width: "30px",
        height: "30px",
        alt: "User options"
      }), _react.default.createElement("span", {
        className: "down-arrow icon"
      })), visible && _react.default.createElement(_popoverNested.NestedPopover, {
        alternateContent: function alternateContent() {
          return _react.default.createElement(_createTeamPop.default, props);
        },
        startAlternateVisible: createTeamOpen
      }, function (showCreateTeam) {
        return _react.default.createElement(UserOptionsPop, _extends({}, props, {
          togglePopover,
          showCreateTeam
        }));
      }));
    });
  });
}

UserOptionsAndCreateTeamPopContainer.propTypes = {
  user: _propTypes.default.shape({
    avatarThumbnailUrl: _propTypes.default.string,
    color: _propTypes.default.string.isRequired,
    id: _propTypes.default.number.isRequired,
    login: _propTypes.default.string,
    teams: _propTypes.default.array.isRequired
  }).isRequired,
  api: _propTypes.default.func.isRequired
};

/***/ }),

/***/ "./src/presenters/project-editor.jsx":
/*!*******************************************!*\
  !*** ./src/presenters/project-editor.jsx ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _currentUser = __webpack_require__(/*! ./current-user.jsx */ "./src/presenters/current-user.jsx");

var _errorHandlers = _interopRequireDefault(__webpack_require__(/*! ./error-handlers.jsx */ "./src/presenters/error-handlers.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class ProjectEditor extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.initialProject);
  }

  userIsMember() {
    if (!this.props.currentUser) return false;
    const currentUserId = this.props.currentUser.id;
    return this.state.users.some(function ({
      id
    }) {
      return currentUserId === id;
    });
  }

  async updateFields(changes) {
    await this.props.api.patch(`projects/${this.state.id}`, changes);
    this.setState(changes);
  }

  async addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  render() {
    var _this = this;

    const {
      handleError,
      handleErrorForInput
    } = this.props;
    const funcs = {
      addProjectToCollection: function addProjectToCollection(project, collection) {
        return _this.addProjectToCollection(project, collection).catch(handleError);
      },
      updateDomain: function updateDomain(domain) {
        return _this.updateFields({
          domain
        }).catch(handleErrorForInput);
      },
      updateDescription: function updateDescription(description) {
        return _this.updateFields({
          description
        }).catch(handleError);
      },
      updatePrivate: function updatePrivate(isPrivate) {
        return _this.updateFields({
          private: isPrivate
        }).catch(handleError);
      }
    };
    return this.props.children(this.state, funcs, this.userIsMember());
  }

}

ProjectEditor.propTypes = {
  api: _propTypes.default.any.isRequired,
  children: _propTypes.default.func.isRequired,
  currentUser: _propTypes.default.object,
  handleError: _propTypes.default.func.isRequired,
  handleErrorForInput: _propTypes.default.func.isRequired,
  initialProject: _propTypes.default.object.isRequired
};

const ProjectEditorContainer = function ProjectEditorContainer({
  api,
  children,
  initialProject
}) {
  return _react.default.createElement(_errorHandlers.default, null, function (wrapErrors) {
    return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
      return _react.default.createElement(ProjectEditor, _extends({
        api: api,
        currentUser: currentUser,
        initialProject: initialProject
      }, wrapErrors), children);
    });
  });
};

ProjectEditorContainer.propTypes = {
  api: _propTypes.default.any.isRequired,
  children: _propTypes.default.func.isRequired,
  initialProject: _propTypes.default.object.isRequired
};
var _default = ProjectEditorContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/project-item.jsx":
/*!*****************************************!*\
  !*** ./src/presenters/project-item.jsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.ProjectItem = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _project = __webpack_require__(/*! ../models/project.js */ "./src/models/project.js");

var _link = __webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx");

var _markdown = __webpack_require__(/*! ./includes/markdown.jsx */ "./src/presenters/includes/markdown.jsx");

var _projectOptionsPop = _interopRequireDefault(__webpack_require__(/*! ./pop-overs/project-options-pop.jsx */ "./src/presenters/pop-overs/project-options-pop.jsx"));

var _usersList = _interopRequireDefault(__webpack_require__(/*! ./users-list.jsx */ "./src/presenters/users-list.jsx"));

var _collection = __webpack_require__(/*! ../models/collection.js */ "./src/models/collection.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const ProjectItem = function ProjectItem(_ref) {
  let {
    api,
    project,
    collectionColor,
    homepageCollection
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["api", "project", "collectionColor", "homepageCollection"]);

  return _react.default.createElement("li", null, _react.default.createElement(_usersList.default, {
    glitchTeam: project.showAsGlitchTeam,
    users: project.users,
    extraClass: "single-line",
    teams: project.teams
  }), _react.default.createElement(_projectOptionsPop.default, _extends({
    project,
    api
  }, props)), _react.default.createElement(_link.ProjectLink, {
    project: project,
    className: "button-area"
  }, _react.default.createElement("div", {
    className: ['project', project.private ? 'private-project' : ''].join(' '),
    style: project.private ? {} : {
      backgroundColor: collectionColor,
      borderBottomColor: collectionColor
    },
    "data-track": "project",
    "data-track-label": project.domain
  }, _react.default.createElement("div", {
    className: "project-container"
  }, _react.default.createElement("img", {
    className: "avatar",
    src: (0, _project.getAvatarUrl)(project.id),
    alt: `${project.domain} avatar`
  }), _react.default.createElement("div", {
    className: "button"
  }, _react.default.createElement("span", {
    className: "project-badge private-project-badge",
    "aria-label": "private"
  }), _react.default.createElement("div", {
    className: "project-name"
  }, project.domain)), homepageCollection ? _react.default.createElement("div", {
    className: "description"
  }, _react.default.createElement(_markdown.TruncatedMarkdown, {
    length: 80
  }, project.description)) : _react.default.createElement("div", {
    className: "description",
    style: project.private ? {} : {
      color: props.category ? "black" : collectionColor ? (0, _collection.getContrastTextColor)(collectionColor) : "black"
    }
  }, _react.default.createElement(_markdown.TruncatedMarkdown, {
    length: 80
  }, project.description)), _react.default.createElement("div", {
    className: "overflow-mask",
    style: project.private ? {} : {
      backgroundColor: collectionColor
    }
  })))));
};

exports.ProjectItem = ProjectItem;
ProjectItem.propTypes = {
  api: _propTypes.default.func,
  category: _propTypes.default.bool,
  currentUser: _propTypes.default.object,
  project: _propTypes.default.shape({
    description: _propTypes.default.string.isRequired,
    domain: _propTypes.default.string.isRequired,
    id: _propTypes.default.string.isRequired,
    private: _propTypes.default.bool.isRequired,
    showAsGlitchTeam: _propTypes.default.bool.isRequired,
    users: _propTypes.default.array.isRequired,
    teams: _propTypes.default.array
  }).isRequired,
  collectionColor: _propTypes.default.string,
  homepageCollection: _propTypes.default.bool,
  projectOptions: _propTypes.default.object
};
var _default = ProjectItem;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/projects-list.jsx":
/*!******************************************!*\
  !*** ./src/presenters/projects-list.jsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.ProjectsUL = exports.ProjectsList = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _projectItem = _interopRequireDefault(__webpack_require__(/*! ./project-item.jsx */ "./src/presenters/project-item.jsx"));

var _link = _interopRequireDefault(__webpack_require__(/*! ./includes/link */ "./src/presenters/includes/link.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const ProjectsList = function ProjectsList(_ref) {
  let {
    title,
    placeholder
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["title", "placeholder"]);

  return _react.default.createElement("article", {
    className: "projects"
  }, _react.default.createElement("h2", null, title), !!(placeholder && !props.projects.length) && _react.default.createElement("div", {
    className: "placeholder"
  }, placeholder), _react.default.createElement(ExpandyProjects, props));
};

exports.ProjectsList = ProjectsList;
ProjectsList.propTypes = {
  api: _propTypes.default.any,
  projects: _propTypes.default.array.isRequired,
  title: _propTypes.default.node.isRequired,
  placeholder: _propTypes.default.node
};

class ExpandyProjects extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      expanded: true
    });
  }

  render() {
    const maxProjects = this.props.maxCollapsedProjects;
    const totalProjects = this.props.projects.length;
    const hiddenProjects = totalProjects - maxProjects;

    let _this$props = this.props,
        {
      projects
    } = _this$props,
        props = _objectWithoutPropertiesLoose(_this$props, ["projects"]);

    let shouldShowButton = false;

    if (!this.state.expanded) {
      shouldShowButton = hiddenProjects > 0;
      projects = projects.slice(0, maxProjects);
    }

    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(ProjectsUL, _extends({
      projects: projects
    }, props)), shouldShowButton && _react.default.createElement("button", {
      className: "button-tertiary",
      onClick: this.handleClick
    }, "Show ", hiddenProjects, " More"));
  }

}

ExpandyProjects.propTypes = {
  projects: _propTypes.default.array.isRequired,
  maxCollapsedProjects: _propTypes.default.number
};
ExpandyProjects.defaultProps = {
  maxCollapsedProjects: 12
};

const ProjectsUL = function ProjectsUL(_ref2) {
  let {
    projectCount,
    collectionUrl
  } = _ref2,
      props = _objectWithoutPropertiesLoose(_ref2, ["projectCount", "collectionUrl"]);

  return _react.default.createElement("ul", {
    className: "projects-container"
  }, props.projects.map(function (project) {
    return _react.default.createElement(_projectItem.default, _extends({
      key: project.id
    }, {
      project
    }, props));
  }), props.homepageCollection && _react.default.createElement(_link.default, {
    to: collectionUrl,
    className: "collection-view-all"
  }, "View all ", projectCount, " projects \u2192"));
};

exports.ProjectsUL = ProjectsUL;
ProjectsUL.propTypes = {
  projects: _propTypes.default.array.isRequired,
  homepageCollection: _propTypes.default.bool,
  collectionUrl: _propTypes.default.string,
  projectCount: _propTypes.default.number
};
var _default = ProjectsList;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/projects-loader.jsx":
/*!********************************************!*\
  !*** ./src/presenters/projects-loader.jsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _chunk2 = _interopRequireDefault(__webpack_require__(/*! lodash/chunk */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/chunk.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _currentUser = __webpack_require__(/*! ./current-user.jsx */ "./src/presenters/current-user.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function listToObject(list, val) {
  return list.reduce(function (data, key) {
    return Object.assign({}, data, {
      [key]: val
    });
  }, {});
}

function keyByVal(list, key) {
  return list.reduce(function (data, val) {
    return Object.assign({}, data, {
      [val[key]]: val
    });
  }, {});
}

class ProjectsLoader extends _react.default.Component {
  constructor(props) {
    super(props); // state is { [project id]: project|null|undefined }
    // undefined means we haven't seen that project yet
    // null means the project is still getting loaded

    this.state = {};
  }

  async loadProjects(...ids) {
    if (!ids.length) return;
    const {
      data
    } = await this.props.api.get(`projects/byIds?ids=${ids.join(',')}`);
    this.setState(keyByVal(data, 'id'));
  }

  ensureProjects(projects) {
    var _this = this;

    const ids = projects.map(function ({
      id
    }) {
      return id;
    });
    const discardedProjects = Object.keys(this.state).filter(function (id) {
      return _this.state[id] && !ids.includes(id);
    });

    if (discardedProjects.length) {
      this.setState(listToObject(discardedProjects, undefined));
    }

    const unloadedProjects = ids.filter(function (id) {
      return _this.state[id] === undefined;
    });

    if (unloadedProjects.length) {
      this.setState(listToObject(unloadedProjects, null));
      (0, _chunk2.default)(unloadedProjects, 100).forEach(function (chunk) {
        return _this.loadProjects(...chunk);
      });
    }
  }

  componentDidMount() {
    this.ensureProjects(this.props.projects);
  }

  componentDidUpdate() {
    this.ensureProjects(this.props.projects);
  }

  render() {
    var _this2 = this;

    const {
      children,
      projects
    } = this.props;
    const loadedProjects = projects.map(function (project) {
      return _this2.state[project.id] || project;
    });
    return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser) {
      return children((0, _currentUser.normalizeProjects)(loadedProjects, currentUser), _this2.loadProjects.bind(_this2));
    });
  }

}

ProjectsLoader.propTypes = {
  api: _propTypes.default.any.isRequired,
  children: _propTypes.default.func.isRequired,
  projects: _propTypes.default.array.isRequired
};
var _default = ProjectsLoader;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/question-item.jsx":
/*!******************************************!*\
  !*** ./src/presenters/question-item.jsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _project = __webpack_require__(/*! ../models/project */ "./src/models/project.js");

var _link = _interopRequireDefault(__webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const iconHelp = 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fask-for-help.svg?1494954687906';

function truncateQuestion(question) {
  const max = 140;

  if (question.length > max) {
    return question.substring(0, max - 1) + '…';
  }

  return question;
}

function truncateTag(tag) {
  const max = 15;
  return tag.substring(0, max);
}

const QuestionItem = function QuestionItem({
  colorOuter,
  colorInner,
  domain,
  question,
  tags,
  userAvatar,
  userColor,
  userLogin,
  path,
  line,
  character
}) {
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("img", {
    className: "help-icon",
    src: iconHelp,
    alt: ""
  }), _react.default.createElement(_link.default, {
    to: (0, _project.getEditorUrl)(domain, path, line, character),
    "data-track": "question",
    "data-track-label": domain
  }, _react.default.createElement("div", {
    className: "project",
    style: {
      backgroundColor: colorOuter
    }
  }, _react.default.createElement("div", {
    className: "project-container",
    style: {
      backgroundColor: colorInner
    }
  }, _react.default.createElement("img", {
    className: "avatar",
    src: userAvatar,
    style: {
      backgroundColor: userColor
    },
    alt: ""
  }), _react.default.createElement("div", {
    className: "button"
  }, "Help ", userLogin), _react.default.createElement("div", {
    className: "description question",
    title: question
  }, truncateQuestion(question)), _react.default.createElement("div", {
    className: "description tags"
  }, tags.map(function (tag) {
    return _react.default.createElement("div", {
      key: tag,
      className: "tag",
      title: tag
    }, truncateTag(tag));
  }))))));
};

QuestionItem.propTypes = {
  colorOuter: _propTypes.default.string.isRequired,
  colorInner: _propTypes.default.string.isRequired,
  domain: _propTypes.default.string.isRequired,
  question: _propTypes.default.string.isRequired,
  tags: _propTypes.default.arrayOf(_propTypes.default.string.isRequired).isRequired,
  userAvatar: _propTypes.default.string.isRequired,
  userColor: _propTypes.default.string.isRequired,
  userLogin: _propTypes.default.string.isRequired,
  path: _propTypes.default.string,
  line: _propTypes.default.number,
  character: _propTypes.default.number
};
var _default = QuestionItem;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/questions.jsx":
/*!**************************************!*\
  !*** ./src/presenters/questions.jsx ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _sample2 = _interopRequireDefault(__webpack_require__(/*! lodash/sample */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/sample.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _randomcolor = _interopRequireDefault(__webpack_require__(/*! randomcolor */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/randomcolor/0.5.3/node_modules/randomcolor/randomColor.js"));

var _errorBoundary = _interopRequireDefault(__webpack_require__(/*! ./includes/error-boundary.jsx */ "./src/presenters/includes/error-boundary.jsx"));

var _link = _interopRequireDefault(__webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx"));

var _questionItem = _interopRequireDefault(__webpack_require__(/*! ./question-item.jsx */ "./src/presenters/question-item.jsx"));

var _sentry = __webpack_require__(/*! ../utils/sentry */ "./src/utils/sentry.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const kaomojis = ['八(＾□＾*)', '(ノ^_^)ノ', 'ヽ(*ﾟｰﾟ*)ﾉ', '♪(┌・。・)┌', 'ヽ(๏∀๏ )ﾉ', 'ヽ(^。^)丿'];

const QuestionTimer = function QuestionTimer({
  animating,
  callback
}) {
  return _react.default.createElement("div", {
    className: "loader-pie",
    title: "Looking for more questions..."
  }, _react.default.createElement("div", {
    className: "left-side"
  }, _react.default.createElement("div", {
    className: `slice ${animating ? 'animated' : ''}`,
    onAnimationEnd: callback
  })), _react.default.createElement("div", {
    className: "right-side"
  }, _react.default.createElement("div", {
    className: `slice ${animating ? 'animated' : ''}`
  })));
};

QuestionTimer.propTypes = {
  animating: _propTypes.default.bool.isRequired,
  callback: _propTypes.default.func.isRequired
};

class Questions extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      kaomoji: '',
      loading: true,
      questions: []
    };
  }

  async load() {
    this.setState({
      loading: true
    });

    try {
      const {
        data
      } = await this.props.api.get('projects/questions');
      const questions = data.map(function (q) {
        return JSON.parse(q.details);
      }).filter(function (q) {
        return !!q;
      }).slice(0, this.props.max).map(function (question) {
        const [colorInner, colorOuter] = (0, _randomcolor.default)({
          luminosity: 'light',
          count: 2
        });
        return Object.assign({
          colorInner,
          colorOuter
        }, question);
      });
      this.setState({
        kaomoji: (0, _sample2.default)(kaomojis),
        questions
      });
    } catch (error) {
      console.error(error);
      (0, _sentry.captureException)(error);
    }

    this.setState({
      loading: false
    });
  }

  componentDidMount() {
    this.load();
  }

  render() {
    var _this = this;

    const {
      kaomoji,
      loading,
      questions
    } = this.state;
    return _react.default.createElement("section", {
      className: "questions"
    }, _react.default.createElement("h2", null, _react.default.createElement(_link.default, {
      to: "/questions"
    }, "Help Others, Get Thanks \u2192"), ' ', _react.default.createElement(QuestionTimer, {
      animating: !loading,
      callback: function callback() {
        return _this.load();
      }
    })), _react.default.createElement("article", {
      className: "projects"
    }, questions.length ? _react.default.createElement(_errorBoundary.default, null, _react.default.createElement("ul", {
      className: "projects-container"
    }, questions.map(function (question) {
      return _react.default.createElement("li", {
        key: question.questionId
      }, _react.default.createElement(_questionItem.default, question));
    }))) : _react.default.createElement(_react.default.Fragment, null, kaomoji, " Looks like nobody is asking for help right now.", ' ', _react.default.createElement(_link.default, {
      className: "general-link",
      to: "/help/how-can-i-get-help-with-code-in-my-project/"
    }, "Learn about helping"))));
  }

}

Questions.propTypes = {
  api: _propTypes.default.any.isRequired,
  max: _propTypes.default.number
};
Questions.defaultProps = {
  max: 3
};
var _default = Questions;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/random-categories.jsx":
/*!**********************************************!*\
  !*** ./src/presenters/random-categories.jsx ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _sampleSize2 = _interopRequireDefault(__webpack_require__(/*! lodash/sampleSize */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/lodash/4.17.11/node_modules/lodash/sampleSize.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _link = _interopRequireDefault(__webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx"));

var _projectsList = __webpack_require__(/*! ./projects-list.jsx */ "./src/presenters/projects-list.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Category = function Category({
  category,
  projectCount
}) {
  const ulProps = {
    projects: category.projects || [],
    categoryColor: category.color,
    homepageCollection: true,
    collectionUrl: category.url
  };
  return _react.default.createElement("article", {
    className: "projects",
    style: {
      backgroundColor: category.backgroundColor
    }
  }, _react.default.createElement("header", {
    className: "category"
  }, _react.default.createElement(_link.default, {
    className: "category-name",
    to: category.url
  }, _react.default.createElement("h2", null, category.name)), _react.default.createElement("span", {
    className: "category-image-container"
  }, _react.default.createElement(_link.default, {
    className: "category-image",
    to: category.url
  }, _react.default.createElement("img", {
    height: "80px",
    width: "120px",
    src: category.avatarUrl,
    alt: category.name
  }))), _react.default.createElement("p", {
    className: "category-description"
  }, category.description)), _react.default.createElement(_projectsList.ProjectsUL, _extends({}, ulProps, {
    projectCount: projectCount,
    collectionColor: category.color
  })));
};

Category.propTypes = {
  category: _propTypes.default.shape({
    avatarUrl: _propTypes.default.string.isRequired,
    backgroundColor: _propTypes.default.string.isRequired,
    description: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired,
    url: _propTypes.default.string.isRequired
  }).isRequired
};

class CategoryLoader extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      categoriesProjectCount: {}
    };
  }

  async componentDidMount() {
    var _this = this;

    // The API gives us a json blob with all of the categories, but only
    // the 'projects' field on 3 of them.  If the field is present,
    // then it's an array of projects.
    const {
      data
    } = await this.props.api.get('categories/random?numCategories=3');
    const categoriesWithProjects = data.filter(function (category) {
      return !!category.projects;
    });
    const categories = (0, _sampleSize2.default)(categoriesWithProjects, 3);
    this.setState({
      categories
    }); // Now load each category to see how many projects it has

    categories.forEach(async function ({
      id
    }) {
      const {
        data
      } = await _this.props.api.get(`categories/${id}`);

      _this.setState(function (prevState) {
        return {
          categoriesProjectCount: Object.assign({}, prevState.categoriesProjectCount, {
            [id]: data.projects.length
          })
        };
      });
    });
  }

  render() {
    var _this2 = this;

    return this.state.categories.map(function (category) {
      return _react.default.createElement(Category, {
        key: category.id,
        category: category,
        projectCount: _this2.state.categoriesProjectCount[category.id]
      });
    });
  }

}

CategoryLoader.propTypes = {
  api: _propTypes.default.any.isRequired
};
var _default = CategoryLoader;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/recent-projects.jsx":
/*!********************************************!*\
  !*** ./src/presenters/recent-projects.jsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _user = __webpack_require__(/*! ../models/user */ "./src/models/user.js");

var _currentUser = __webpack_require__(/*! ./current-user.jsx */ "./src/presenters/current-user.jsx");

var _link = __webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx");

var _profile = __webpack_require__(/*! ./includes/profile.jsx */ "./src/presenters/includes/profile.jsx");

var _loader = _interopRequireDefault(__webpack_require__(/*! ./includes/loader.jsx */ "./src/presenters/includes/loader.jsx"));

var _projectsLoader = _interopRequireDefault(__webpack_require__(/*! ./projects-loader.jsx */ "./src/presenters/projects-loader.jsx"));

var _projectsList = __webpack_require__(/*! ./projects-list.jsx */ "./src/presenters/projects-list.jsx");

var _signInPop = _interopRequireDefault(__webpack_require__(/*! ./pop-overs/sign-in-pop.jsx */ "./src/presenters/pop-overs/sign-in-pop.jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RecentProjectsContainer = function RecentProjectsContainer({
  children,
  user,
  api
}) {
  return _react.default.createElement("section", {
    className: "profile recent-projects"
  }, _react.default.createElement("h2", null, _react.default.createElement(_link.UserLink, {
    user: user
  }, "Your Projects \u2192")), _react.default.createElement(_profile.CoverContainer, {
    style: (0, _user.getProfileStyle)(user)
  }, _react.default.createElement("div", {
    className: "profile-avatar"
  }, _react.default.createElement("div", {
    className: "user-avatar-container"
  }, _react.default.createElement(_link.UserLink, {
    user: user
  }, _react.default.createElement("div", {
    className: `user-avatar ${!user.login ? 'anon-user-avatar' : ''}`,
    style: (0, _user.getAvatarStyle)(user),
    alt: ""
  })), !user.login && _react.default.createElement("div", {
    className: "anon-user-sign-up"
  }, _react.default.createElement(_signInPop.default, {
    api: api
  })))), _react.default.createElement("article", {
    className: "projects"
  }, children)));
};

RecentProjectsContainer.propTypes = {
  children: _propTypes.default.node.isRequired,
  user: _propTypes.default.shape({
    avatarUrl: _propTypes.default.string,
    color: _propTypes.default.string.isRequired,
    coverColor: _propTypes.default.string,
    hasCoverImage: _propTypes.default.bool.isRequired,
    id: _propTypes.default.number.isRequired,
    login: _propTypes.default.string
  }).isRequired
};

const RecentProjects = function RecentProjects({
  api
}) {
  return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (user, fetched) {
    return _react.default.createElement(RecentProjectsContainer, {
      user: user,
      api: api
    }, fetched ? _react.default.createElement(_projectsLoader.default, {
      api: api,
      projects: user.projects.slice(0, 3)
    }, function (projects) {
      return _react.default.createElement(_projectsList.ProjectsUL, {
        projects: projects
      });
    }) : _react.default.createElement(_loader.default, null));
  });
};

RecentProjects.propTypes = {
  api: _propTypes.default.any.isRequired
};
var _default = RecentProjects;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/team-editor.jsx":
/*!****************************************!*\
  !*** ./src/presenters/team-editor.jsx ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var assets = _interopRequireWildcard(__webpack_require__(/*! ../utils/assets */ "./src/utils/assets.js"));

var _currentUser = __webpack_require__(/*! ./current-user.jsx */ "./src/presenters/current-user.jsx");

var _errorHandlers = _interopRequireDefault(__webpack_require__(/*! ./error-handlers.jsx */ "./src/presenters/error-handlers.jsx"));

var _uploader = _interopRequireDefault(__webpack_require__(/*! ./includes/uploader.jsx */ "./src/presenters/includes/uploader.jsx"));

var _notifications = _interopRequireDefault(__webpack_require__(/*! ./notifications.jsx */ "./src/presenters/notifications.jsx"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

class TeamEditor extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.initialTeam, {
      _cacheAvatar: Date.now(),
      _cacheCover: Date.now()
    });
  }

  currentUserIsOnTeam() {
    if (!this.props.currentUser) return false;
    const currentUserId = this.props.currentUser.id;
    return this.state.users.some(function ({
      id
    }) {
      return currentUserId === id;
    });
  }

  async updateFields(changes) {
    var _this = this;

    const {
      data
    } = await this.props.api.patch(`teams/${this.state.id}`, changes);
    this.setState(data);

    if (this.props.currentUser) {
      const teamIndex = this.props.currentUser.teams.findIndex(function ({
        id
      }) {
        return id === _this.state.id;
      });

      if (teamIndex >= 0) {
        const teams = [...this.props.currentUser.teams];
        teams[teamIndex] = this.state;
        this.props.updateCurrentUser({
          teams
        });
      }
    }
  }

  async uploadAvatar(blob) {
    const {
      data: policy
    } = await assets.getTeamAvatarImagePolicy(this.props.api, this.state.id);
    await this.props.uploadAssetSizes(blob, policy, assets.AVATAR_SIZES);
    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      hasAvatarImage: true,
      backgroundColor: color
    });
    this.setState({
      _cacheAvatar: Date.now()
    });
  }

  async uploadCover(blob) {
    const {
      data: policy
    } = await assets.getTeamCoverImagePolicy(this.props.api, this.state.id);
    await this.props.uploadAssetSizes(blob, policy, assets.COVER_SIZES);
    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      hasCoverImage: true,
      coverColor: color
    });
    this.setState({
      _cacheCover: Date.now()
    });
  }

  async joinTeam() {
    var _this2 = this;

    await this.props.api.post(`teams/${this.state.id}/join`);
    this.setState(function ({
      users
    }) {
      return {
        users: [...users, _this2.props.currentUser]
      };
    });

    if (this.props.currentUser) {
      const teams = this.props.currentUser.teams;
      this.props.updateCurrentUser({
        teams: [...teams, this.state]
      });
    }
  }

  async inviteEmail(emailAddress) {
    console.log('💣 inviteEmail', emailAddress);
    await this.props.api.post(`teams/${this.state.id}/sendJoinTeamEmail`, {
      emailAddress
    });
  }

  async inviteUser(user) {
    console.log('💣 inviteUser', user);
    await this.props.api.post(`teams/${this.state.id}/sendJoinTeamEmail`, {
      userId: user.id
    });
  }

  async removeUserFromTeam(id, projectIds) {
    var _this3 = this;

    // Kick them out of every project at once, and wait until it's all done
    await Promise.all(projectIds.map(function (projectId) {
      return _this3.props.api.delete(`projects/${projectId}/authorization`, {
        data: {
          targetUserId: id
        }
      });
    })); // Now remove them from the team. Remove them last so if something goes wrong you can do this over again

    await this.props.api.delete(`teams/${this.state.id}/users/${id}`);
    this.removeUserAdmin(id);
    this.setState(function ({
      users
    }) {
      return {
        users: users.filter(function (u) {
          return u.id !== id;
        })
      };
    });

    if (this.props.currentUser && this.props.currentUser.id === id) {
      const teams = this.props.currentUser.teams.filter(function ({
        id
      }) {
        return id !== _this3.state.id;
      });
      this.props.updateCurrentUser({
        teams
      });
    }
  }

  removeUserAdmin(id) {
    let index = this.state.adminIds.indexOf(id);

    if (index !== -1) {
      this.setState(function (prevState) {
        return {
          counter: prevState.adminIds.splice(index, 1)
        };
      });
    }
  }

  async updateUserPermissions(id, accessLevel) {
    if (accessLevel === MEMBER_ACCESS_LEVEL && this.state.adminIds.length <= 1) {
      this.props.createErrorNotification('A team must have at least one admin');
      return false;
    }

    await this.props.api.patch(`teams/${this.state.id}/users/${id}`, {
      access_level: accessLevel
    });

    if (accessLevel === ADMIN_ACCESS_LEVEL) {
      this.setState(function (prevState) {
        return {
          counter: prevState.adminIds.push(id)
        };
      });
    } else {
      this.removeUserAdmin(id);
    }
  }

  async addProject(project) {
    await this.props.api.post(`teams/${this.state.id}/projects/${project.id}`);
    this.setState(function ({
      projects
    }) {
      return {
        projects: [project, ...projects]
      };
    });
  }

  async removeProject(id) {
    await this.props.api.delete(`teams/${this.state.id}/projects/${id}`);
    this.setState(function ({
      projects
    }) {
      return {
        projects: projects.filter(function (p) {
          return p.id !== id;
        })
      };
    });
  }

  async deleteProject(id) {
    await this.props.api.delete(`/projects/${id}`);
    this.setState(function ({
      projects
    }) {
      return {
        projects: projects.filter(function (p) {
          return p.id !== id;
        })
      };
    });
  }

  async addPin(id) {
    await this.props.api.post(`teams/${this.state.id}/pinned-projects/${id}`);
    this.setState(function ({
      teamPins
    }) {
      return {
        teamPins: [...teamPins, {
          projectId: id
        }]
      };
    });
  }

  async removePin(id) {
    await this.props.api.delete(`teams/${this.state.id}/pinned-projects/${id}`);
    this.setState(function ({
      teamPins
    }) {
      return {
        teamPins: teamPins.filter(function (p) {
          return p.projectId !== id;
        })
      };
    });
  }

  async joinTeamProject(projectId) {
    await this.props.api.post(`/teams/${this.state.id}/projects/${projectId}/join`);
  }

  async leaveTeamProject(projectId) {
    await this.props.api.delete(`/projects/${projectId}/authorization`, {
      data: {
        targetUserId: this.props.currentUser.id
      }
    });
  }

  currentUserIsTeamAdmin() {
    if (!this.props.currentUser) return false;
    const currentUserId = this.props.currentUser.id;

    if (this.state.adminIds.includes(currentUserId)) {
      return true;
    }

    return false;
  }

  render() {
    var _this4 = this;

    const {
      handleError,
      handleErrorForInput
    } = this.props;
    const funcs = {
      updateName: function updateName(name) {
        return _this4.updateFields({
          name
        }).catch(handleErrorForInput);
      },
      updateUrl: function updateUrl(url) {
        return _this4.updateFields({
          url
        }).catch(handleErrorForInput);
      },
      updateDescription: function updateDescription(description) {
        return _this4.updateFields({
          description
        }).catch(handleError);
      },
      joinTeam: function joinTeam() {
        return _this4.joinTeam().catch(handleError);
      },
      inviteEmail: function inviteEmail(email) {
        return _this4.inviteEmail(email).catch(handleError);
      },
      inviteUser: function inviteUser(id) {
        return _this4.inviteUser(id).catch(handleError);
      },
      removeUserFromTeam: function removeUserFromTeam(id, projectIds) {
        return _this4.removeUserFromTeam(id, projectIds).catch(handleError);
      },
      uploadAvatar: function uploadAvatar() {
        return assets.requestFile(function (blob) {
          return _this4.uploadAvatar(blob).catch(handleError);
        });
      },
      uploadCover: function uploadCover() {
        return assets.requestFile(function (blob) {
          return _this4.uploadCover(blob).catch(handleError);
        });
      },
      clearCover: function clearCover() {
        return _this4.updateFields({
          hasCoverImage: false
        }).catch(handleError);
      },
      addProject: function addProject(project) {
        return _this4.addProject(project).catch(handleError);
      },
      removeProject: function removeProject(id) {
        return _this4.removeProject(id).catch(handleError);
      },
      deleteProject: function deleteProject(id) {
        return _this4.deleteProject(id).catch(handleError);
      },
      addPin: function addPin(id) {
        return _this4.addPin(id).catch(handleError);
      },
      removePin: function removePin(id) {
        return _this4.removePin(id).catch(handleError);
      },
      updateWhitelistedDomain: function updateWhitelistedDomain(whitelistedDomain) {
        return _this4.updateFields({
          whitelistedDomain
        }).catch(handleError);
      },
      updateUserPermissions: function updateUserPermissions(id, accessLevel) {
        return _this4.updateUserPermissions(id, accessLevel).catch(handleError);
      },
      joinTeamProject: function joinTeamProject(projectId) {
        return _this4.joinTeamProject(projectId).catch(handleError);
      },
      leaveTeamProject: function leaveTeamProject(projectId) {
        return _this4.leaveTeamProject(projectId).catch(handleError);
      }
    };
    return this.props.children(this.state, funcs, this.currentUserIsOnTeam(), this.currentUserIsTeamAdmin());
  }

}

TeamEditor.propTypes = {
  api: _propTypes.default.any.isRequired,
  children: _propTypes.default.func.isRequired,
  currentUser: _propTypes.default.object,
  updateCurrentUser: _propTypes.default.func.isRequired,
  handleError: _propTypes.default.func.isRequired,
  initialTeam: _propTypes.default.object.isRequired,
  uploadAssetSizes: _propTypes.default.func.isRequired
};

const TeamEditorContainer = function TeamEditorContainer({
  api,
  children,
  initialTeam
}) {
  return _react.default.createElement(_errorHandlers.default, null, function (errorFuncs) {
    return _react.default.createElement(_uploader.default, null, function (uploadFuncs) {
      return _react.default.createElement(_notifications.default, null, function (notificationFuncs) {
        return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser, fetched, {
          update
        }) {
          return _react.default.createElement(TeamEditor, _extends({
            api,
            currentUser,
            initialTeam
          }, {
            updateCurrentUser: update
          }, uploadFuncs, errorFuncs, notificationFuncs), children);
        });
      });
    });
  });
};

TeamEditorContainer.propTypes = {
  api: _propTypes.default.any.isRequired,
  children: _propTypes.default.func.isRequired,
  initialTeam: _propTypes.default.object.isRequired
};
var _default = TeamEditorContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/team-item.jsx":
/*!**************************************!*\
  !*** ./src/presenters/team-item.jsx ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = TeamItem;

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _team = __webpack_require__(/*! ../models/team */ "./src/models/team.js");

var _link = __webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx");

var _markdown = __webpack_require__(/*! ./includes/markdown.jsx */ "./src/presenters/includes/markdown.jsx");

var _thanks = _interopRequireDefault(__webpack_require__(/*! ./includes/thanks.jsx */ "./src/presenters/includes/thanks.jsx"));

var _usersList = _interopRequireDefault(__webpack_require__(/*! ./users-list.jsx */ "./src/presenters/users-list.jsx"));

var _wrappingLink = _interopRequireDefault(__webpack_require__(/*! ./includes/wrapping-link.jsx */ "./src/presenters/includes/wrapping-link.jsx"));

var _teamElements = __webpack_require__(/*! ./includes/team-elements.jsx */ "./src/presenters/includes/team-elements.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TeamItem({
  team
}) {
  const style = (0, _team.getProfileStyle)(Object.assign({}, team, {
    size: 'medium'
  }));
  const thanksCount = team.users.reduce(function (total, {
    thanksCount
  }) {
    return total + thanksCount;
  }, 0);
  return _react.default.createElement(_wrappingLink.default, {
    href: (0, _team.getLink)(team),
    className: "item button-area",
    style: style
  }, _react.default.createElement("div", {
    className: "content"
  }, _react.default.createElement("img", {
    className: "avatar",
    src: (0, _team.getAvatarUrl)(team),
    alt: ""
  }), _react.default.createElement("div", {
    className: "information"
  }, _react.default.createElement(_link.TeamLink, {
    team: team,
    className: "button"
  }, team.name), !!team.isVerified && _react.default.createElement(_teamElements.VerifiedBadge, null), _react.default.createElement(_usersList.default, {
    users: team.users
  }), thanksCount > 0 && _react.default.createElement(_thanks.default, {
    count: thanksCount
  }), !!team.description && _react.default.createElement("p", {
    className: "description"
  }, _react.default.createElement(_markdown.TruncatedMarkdown, {
    length: 96
  }, team.description)))));
}

TeamItem.propTypes = {
  team: _propTypes.default.shape({
    id: _propTypes.default.number.isRequired,
    coverColor: _propTypes.default.string.isRequired,
    description: _propTypes.default.string.isRequired,
    hasAvatarImage: _propTypes.default.bool.isRequired,
    hasCoverImage: _propTypes.default.bool.isRequired,
    isVerified: _propTypes.default.bool.isRequired,
    name: _propTypes.default.string.isRequired,
    users: _propTypes.default.array.isRequired,
    url: _propTypes.default.string.isRequired
  })
};

/***/ }),

/***/ "./src/presenters/teams-list.jsx":
/*!***************************************!*\
  !*** ./src/presenters/teams-list.jsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.TeamsList = exports.TeamTile = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _link = __webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx");

var _avatar = __webpack_require__(/*! ./includes/avatar.jsx */ "./src/presenters/includes/avatar.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TeamTile = function TeamTile({
  team
}) {
  return _react.default.createElement(_link.TeamLink, {
    team: team,
    className: "user"
  }, _react.default.createElement(_avatar.TeamAvatar, {
    team: team
  }));
};

exports.TeamTile = TeamTile;
TeamTile.propTypes = {
  team: _propTypes.default.shape({
    id: _propTypes.default.number.isRequired,
    name: _propTypes.default.string.isRequired,
    url: _propTypes.default.string.isRequired
  }).isRequired
};

const TeamsList = function TeamsList({
  teams
}) {
  return _react.default.createElement("ul", {
    className: "users teams-information"
  }, teams.map(function (team) {
    return _react.default.createElement("li", {
      key: team.id
    }, _react.default.createElement(TeamTile, {
      team: team
    }));
  }));
};

exports.TeamsList = TeamsList;
TeamsList.propTypes = {
  teams: _propTypes.default.array.isRequired
};
var _default = TeamsList;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/user-editor.jsx":
/*!****************************************!*\
  !*** ./src/presenters/user-editor.jsx ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var assets = _interopRequireWildcard(__webpack_require__(/*! ../utils/assets */ "./src/utils/assets.js"));

var _currentUser = __webpack_require__(/*! ./current-user.jsx */ "./src/presenters/current-user.jsx");

var _errorHandlers = _interopRequireDefault(__webpack_require__(/*! ./error-handlers.jsx */ "./src/presenters/error-handlers.jsx"));

var _uploader = _interopRequireDefault(__webpack_require__(/*! ./includes/uploader.jsx */ "./src/presenters/includes/uploader.jsx"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

class UserEditor extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.initialUser, {
      _deletedProjects: [],
      _cacheCover: Date.now()
    });
  }

  isCurrentUser() {
    return !!this.props.currentUser && this.state.id === this.props.currentUser.id;
  }

  async updateFields(changes) {
    const {
      data
    } = await this.props.api.patch(`users/${this.state.id}`, changes);
    this.setState(data);

    if (this.isCurrentUser()) {
      this.props.updateCurrentUser(data);
    }
  }

  async uploadAvatar(blob) {
    const {
      data: policy
    } = await assets.getUserCoverImagePolicy(this.props.api, this.state.id);
    const url = await this.props.uploadAsset(blob, policy, 'temporary-user-avatar');
    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      avatarUrl: url,
      color: color
    });
  }

  async uploadCover(blob) {
    const {
      data: policy
    } = await assets.getUserCoverImagePolicy(this.props.api, this.state.id);
    await this.props.uploadAssetSizes(blob, policy, assets.COVER_SIZES);
    const image = await assets.blobToImage(blob);
    const color = assets.getDominantColor(image);
    await this.updateFields({
      hasCoverImage: true,
      coverColor: color
    });
    this.setState({
      _cacheCover: Date.now()
    });
  }

  async addPin(id) {
    await this.props.api.post(`users/${this.state.id}/pinned-projects/${id}`);
    this.setState(function ({
      pins
    }) {
      return {
        pins: [...pins, {
          projectId: id
        }]
      };
    });
  }

  async removePin(id) {
    await this.props.api.delete(`users/${this.state.id}/pinned-projects/${id}`);
    this.setState(function ({
      pins
    }) {
      return {
        pins: pins.filter(function (p) {
          return p.projectId !== id;
        })
      };
    });
  }

  async leaveProject(id) {
    await this.props.api.delete(`/projects/${id}/authorization`, {
      data: {
        targetUserId: this.state.id
      }
    });
    this.setState(function ({
      projects
    }) {
      return {
        projects: projects.filter(function (p) {
          return p.id !== id;
        })
      };
    });
  }

  async deleteProject(id) {
    await this.props.api.delete(`/projects/${id}`);
    const {
      data
    } = await this.props.api.get(`projects/${id}?showDeleted=true`);
    this.setState(function ({
      projects,
      _deletedProjects
    }) {
      return {
        projects: projects.filter(function (p) {
          return p.id !== id;
        }),
        _deletedProjects: [data, ..._deletedProjects]
      };
    });
  }

  async undeleteProject(id) {
    await this.props.api.post(`/projects/${id}/undelete`);
    const {
      data
    } = await this.props.api.get(`projects/${id}`);

    if (data.domain.endsWith('-deleted')) {
      try {
        const newDomain = data.domain.replace(/-deleted$/, '');
        await this.props.api.patch(`/projects/${id}`, {
          domain: newDomain
        });
        data.domain = newDomain;
      } catch (e) {
        console.warn('failed to rename project on undelete', e);
      }
    }

    this.setState(function ({
      projects,
      _deletedProjects
    }) {
      return {
        projects: [...projects, data],
        _deletedProjects: _deletedProjects.filter(function (p) {
          return p.id !== id;
        })
      };
    });
  }

  async addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
    this.loadCollections();
  }

  async loadCollections() {
    const {
      data
    } = await this.props.api.get(`collections?userId=${this.state.id}`);
    this.setState({
      collections: data
    });
  }

  componentDidMount() {
    this.loadCollections();
  }

  render() {
    var _this = this;

    const {
      handleError,
      handleErrorForInput
    } = this.props;
    const funcs = {
      updateName: function updateName(name) {
        return _this.updateFields({
          name
        }).catch(handleErrorForInput);
      },
      updateLogin: function updateLogin(login) {
        return _this.updateFields({
          login
        }).catch(handleErrorForInput);
      },
      updateDescription: function updateDescription(description) {
        return _this.updateFields({
          description
        }).catch(handleError);
      },
      uploadAvatar: function uploadAvatar() {
        return assets.requestFile(function (blob) {
          return _this.uploadAvatar(blob).catch(handleError);
        });
      },
      uploadCover: function uploadCover() {
        return assets.requestFile(function (blob) {
          return _this.uploadCover(blob).catch(handleError);
        });
      },
      clearCover: function clearCover() {
        return _this.updateFields({
          hasCoverImage: false
        }).catch(handleError);
      },
      addPin: function addPin(id) {
        return _this.addPin(id).catch(handleError);
      },
      removePin: function removePin(id) {
        return _this.removePin(id).catch(handleError);
      },
      leaveProject: function leaveProject(id) {
        return _this.leaveProject(id).catch(handleError);
      },
      deleteProject: function deleteProject(id) {
        return _this.deleteProject(id).catch(handleError);
      },
      undeleteProject: function undeleteProject(id) {
        return _this.undeleteProject(id).catch(handleError);
      },
      setDeletedProjects: function setDeletedProjects(_deletedProjects) {
        return _this.setState({
          _deletedProjects
        });
      },
      addProjectToCollection: function addProjectToCollection(project, collection) {
        return _this.addProjectToCollection(project, collection).catch(handleError);
      }
    };
    return this.props.children(this.state, funcs, this.isCurrentUser());
  }

}

UserEditor.propTypes = {
  api: _propTypes.default.any.isRequired,
  children: _propTypes.default.func.isRequired,
  currentUser: _propTypes.default.object,
  updateCurrentUser: _propTypes.default.func.isRequired,
  handleError: _propTypes.default.func.isRequired,
  handleErrorForInput: _propTypes.default.func.isRequired,
  initialUser: _propTypes.default.shape({
    id: _propTypes.default.number.isRequired
  }).isRequired,
  uploadAsset: _propTypes.default.func.isRequired,
  uploadAssetSizes: _propTypes.default.func.isRequired
};

const UserEditorContainer = function UserEditorContainer({
  api,
  children,
  initialUser
}) {
  return _react.default.createElement(_errorHandlers.default, null, function (errorFuncs) {
    return _react.default.createElement(_uploader.default, null, function (uploadFuncs) {
      return _react.default.createElement(_currentUser.CurrentUserConsumer, null, function (currentUser, fetched, {
        update
      }) {
        return _react.default.createElement(UserEditor, _extends({
          api,
          currentUser,
          initialUser
        }, {
          updateCurrentUser: update
        }, uploadFuncs, errorFuncs), children);
      });
    });
  });
};

UserEditorContainer.propTypes = {
  api: _propTypes.default.any.isRequired,
  children: _propTypes.default.func.isRequired,
  initialUser: _propTypes.default.object.isRequired
};
var _default = UserEditorContainer;
exports.default = _default;

/***/ }),

/***/ "./src/presenters/user-item.jsx":
/*!**************************************!*\
  !*** ./src/presenters/user-item.jsx ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = UserItem;

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _link = __webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx");

var _markdown = __webpack_require__(/*! ./includes/markdown.jsx */ "./src/presenters/includes/markdown.jsx");

var _thanks = _interopRequireDefault(__webpack_require__(/*! ./includes/thanks.jsx */ "./src/presenters/includes/thanks.jsx"));

var _user = __webpack_require__(/*! ../models/user.js */ "./src/models/user.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addDefaultSrc(event) {
  event.target.src = _user.ANON_AVATAR_URL;
}

function UserItem({
  user
}) {
  const style = (0, _user.getProfileStyle)(Object.assign({}, user, {
    size: 'medium'
  }));
  return _react.default.createElement(_link.UserLink, {
    user: user,
    className: "button-area"
  }, _react.default.createElement("div", {
    className: "item",
    style: style
  }, _react.default.createElement("div", {
    className: "content"
  }, _react.default.createElement("img", {
    onError: addDefaultSrc,
    className: "avatar",
    src: (0, _user.getAvatarUrl)(user),
    alt: ""
  }), _react.default.createElement("div", {
    className: "information"
  }, !!user.name && _react.default.createElement("h3", {
    className: "name"
  }, user.name), _react.default.createElement("div", {
    className: "button"
  }, "@", user.login), user.thanksCount > 0 && _react.default.createElement(_thanks.default, {
    count: user.thanksCount
  }), !!user.description && _react.default.createElement("p", {
    className: "description"
  }, _react.default.createElement(_markdown.TruncatedMarkdown, {
    length: 96
  }, user.description))))));
}

UserItem.propTypes = {
  user: _propTypes.default.shape({
    avatarUrl: _propTypes.default.string,
    coverColor: _propTypes.default.string,
    description: _propTypes.default.string,
    hasCoverImage: _propTypes.default.bool.isRequired,
    id: _propTypes.default.number.isRequired,
    login: _propTypes.default.string.isRequired,
    name: _propTypes.default.string,
    thanksCount: _propTypes.default.number.isRequired
  })
};

/***/ }),

/***/ "./src/presenters/users-list.jsx":
/*!***************************************!*\
  !*** ./src/presenters/users-list.jsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = exports.UserTile = exports.StaticUsersList = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/react/16.7.0/node_modules/react/index.js"));

var _propTypes = _interopRequireDefault(__webpack_require__(/*! prop-types */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/prop-types/15.6.2/node_modules/prop-types/index.js"));

var _link = __webpack_require__(/*! ./includes/link.jsx */ "./src/presenters/includes/link.jsx");

var _avatar = __webpack_require__(/*! ./includes/avatar.jsx */ "./src/presenters/includes/avatar.jsx");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// StaticUsersList
const StaticUsersList = function StaticUsersList({
  users,
  extraClass = ""
}) {
  return _react.default.createElement("ul", {
    className: `users ${extraClass}`
  }, users.map(function (user) {
    return _react.default.createElement("li", {
      key: user.id
    }, _react.default.createElement("span", {
      className: "user"
    }, _react.default.createElement(_avatar.UserAvatar, {
      user: user
    })));
  }));
};

exports.StaticUsersList = StaticUsersList;
StaticUsersList.propTypes = {
  users: _propTypes.default.array.isRequired,
  extraClass: _propTypes.default.string
}; // UserTile

const UserTile = function UserTile(user) {
  return _react.default.createElement(_link.UserLink, {
    user: user,
    className: "user"
  }, _react.default.createElement(_avatar.UserAvatar, {
    user: user
  }));
};

exports.UserTile = UserTile;
UserTile.propTypes = {
  id: _propTypes.default.number.isRequired,
  login: _propTypes.default.string,
  name: _propTypes.default.string,
  avatarThumbnailUrl: _propTypes.default.string,
  color: _propTypes.default.string.isRequired
}; // PopulatedUsersList

const PopulatedUsersList = function PopulatedUsersList({
  users,
  extraClass = "",
  teams = []
}) {
  if (users.length) {
    return _react.default.createElement("ul", {
      className: `users ${extraClass}`
    }, users.map(function (user) {
      return _react.default.createElement("li", {
        key: user.id
      }, _react.default.createElement(_link.UserLink, {
        user: user,
        className: "user"
      }, _react.default.createElement(_avatar.UserAvatar, {
        user: user
      })));
    }));
  }

  return _react.default.createElement("ul", {
    className: `users ${extraClass}`
  }, teams.map(function (team) {
    return _react.default.createElement("li", {
      key: team.id
    }, _react.default.createElement(_link.TeamLink, {
      team: team,
      className: "team"
    }, _react.default.createElement(_avatar.TeamAvatar, {
      team: team
    })));
  }));
};

PopulatedUsersList.propTypes = {
  users: _propTypes.default.array.isRequired,
  extraClass: _propTypes.default.string,
  teams: _propTypes.default.array
};

const GlitchTeamUsersList = function GlitchTeamUsersList({
  extraClass = ''
}) {
  const GLITCH_TEAM_AVATAR = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267";
  return _react.default.createElement("ul", {
    className: `users ${extraClass}`
  }, _react.default.createElement("li", null, _react.default.createElement("span", {
    className: "user made-by-glitch"
  }, _react.default.createElement(_avatar.Avatar, {
    name: "Glitch Team",
    src: GLITCH_TEAM_AVATAR,
    color: "#74ecfc"
  }))));
};

const UsersList = function UsersList({
  glitchTeam = false,
  users,
  extraClass,
  teams
}) {
  if (glitchTeam) {
    return _react.default.createElement(GlitchTeamUsersList, {
      extraClass: extraClass
    });
  }

  return _react.default.createElement(PopulatedUsersList, {
    users: users,
    extraClass: extraClass,
    teams: teams
  });
};

UsersList.propTypes = {
  glitchTeam: _propTypes.default.bool
};
var _default = UsersList;
exports.default = _default;

/***/ }),

/***/ "./src/utils/abuse-reporting.js":
/*!**************************************!*\
  !*** ./src/utils/abuse-reporting.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getAbuseReportBody = exports.getAbuseReportTitle = void 0;

var _models = __webpack_require__(/*! ./models.js */ "./src/utils/models.js");

var _user = __webpack_require__(/*! ../models/user.js */ "./src/models/user.js");

/* global APP_URL */
const getAbuseReportTitle = function getAbuseReportTitle(model, modelType) {
  if (modelType == "home") {
    return `Abuse Report for Glitch Homepage`;
  }

  return `Abuse Report for ${modelType} ${(0, _models.getDisplayNameForModel)(model, modelType)}`;
};
/*
* mega-method to compose the body of an abuse report
*/


exports.getAbuseReportTitle = getAbuseReportTitle;

const getAbuseReportBody = function getAbuseReportBody(currentUser, submitterEmail, reportedType, reportedModel, message) {
  let thingIdentifiers;

  if (reportedType == "home") {
    thingIdentifiers = `- [Glitch Home Page](${APP_URL})`;
  } else {
    const glitchLink = APP_URL + (0, _models.getUrlForModel)(reportedModel, reportedType);
    const capitalizedReportedType = capitalize(reportedType);
    thingIdentifiers = `
- ${capitalizedReportedType} Name: [${(0, _models.getDisplayNameForModel)(reportedModel, reportedType)}](${glitchLink})

- ${capitalizedReportedType} Id: ${reportedModel.id}`;
  }

  return `${thingIdentifiers}

- Submitted by: [${(0, _user.getDisplayName)(currentUser)}](${APP_URL}${(0, _user.getLink)(currentUser)})

- Contact: ${pickEmailForReport(currentUser, submitterEmail)}

- Message: ${message}`;
};

exports.getAbuseReportBody = getAbuseReportBody;

const capitalize = function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const pickEmailForReport = function pickEmailForReport(currentUser, submitterEmail) {
  if (submitterEmail) {
    return submitterEmail;
  }

  const emailObj = Array.isArray(currentUser.emails) && currentUser.emails.find(function (email) {
    return email.primary;
  });
  return emailObj.email;
};

/***/ }),

/***/ "./src/utils/assets.js":
/*!*****************************!*\
  !*** ./src/utils/assets.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.resizeImage = resizeImage;
exports.getDominantColor = getDominantColor;
exports.requestFile = requestFile;
exports.getUserCoverImagePolicy = getUserCoverImagePolicy;
exports.getTeamAvatarImagePolicy = getTeamAvatarImagePolicy;
exports.getTeamCoverImagePolicy = getTeamCoverImagePolicy;
exports.uploadAsset = uploadAsset;
exports.uploadAssetSizes = uploadAssetSizes;
exports.blobToImage = exports.AVATAR_SIZES = exports.COVER_SIZES = void 0;

var _s3Uploader = _interopRequireDefault(__webpack_require__(/*! ./s3-uploader */ "./src/utils/s3-uploader.js"));

var _quantize = _interopRequireDefault(__webpack_require__(/*! quantize */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/quantize/1.0.2/node_modules/quantize/quantize.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 💭 based on frontend/utils/assets in the editor
const COVER_SIZES = {
  large: 1000,
  medium: 700,
  small: 450
};
exports.COVER_SIZES = COVER_SIZES;
const AVATAR_SIZES = {
  large: 300,
  medium: 150,
  small: 60
};
exports.AVATAR_SIZES = AVATAR_SIZES;

const blobToImage = function blobToImage(file) {
  return new Promise(function (resolve, reject) {
    const image = new Image();

    image.onload = function () {
      return resolve(image);
    };

    image.onerror = reject;
    return image.src = URL.createObjectURL(file);
  });
}; // Reduces the width/height and draws a new image until it reaches
// the final size. It loops by waiting for the onload to fire on the updated
// image and exits as soon as the new width/height are less than or equal to the
// final size.


exports.blobToImage = blobToImage;

const drawCanvasThumbnail = function drawCanvasThumbnail(image, type, max) {
  let {
    width,
    height
  } = image;
  const quality = 0.92;
  let sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = width;
  sourceCanvas.height = height;
  const sourceContext = sourceCanvas.getContext('2d');
  sourceContext.drawImage(image, 0, 0, width, height);

  while (width > max && height > max) {
    width *= 0.75;
    height *= 0.75;
    const targetCanvas = document.createElement('canvas');
    const targetContext = targetCanvas.getContext('2d');
    targetCanvas.width = width;
    targetCanvas.height = height;
    targetContext.drawImage(sourceCanvas, 0, 0, width, height);
    sourceCanvas = targetCanvas;
  }

  return new Promise(function (resolve) {
    return sourceCanvas.toBlob(function (blob) {
      blob.width = width;
      blob.height = height;
      return resolve(blob);
    }, type, quality);
  });
}; // Takes an HTML5 File and returns a promise for an HTML5 Blob that is fulfilled
// with a thumbnail for the image. If the image is small enough the original
// blob is returned. Width and height metadata are added to the blob.


function resizeImage(file, max) {
  return blobToImage(file).then(function (image) {
    file.width = image.width;
    file.height = image.height;

    if (image.width < max && image.height < max) {
      return file;
    }

    return drawCanvasThumbnail(image, file.type, max);
  });
}

function getDominantColor(image) {
  const {
    width,
    height
  } = image;
  const PIXELS_FROM_EDGE = 11;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, width, height);
  let transparentPixels = false;
  let colors = [];
  const outlyingColors = [];
  const outlyingColorsList = JSON.stringify([[255, 255, 255], [0, 0, 0]]);
  /*
  Iterate through edge pixels and get the average color, then conditionally
  handle edge colors and transparent images
  */

  for (let x = 0; x < PIXELS_FROM_EDGE; x++) {
    for (let y = 0; y < PIXELS_FROM_EDGE; y++) {
      const pixelData = context.getImageData(x, y, 1, 1).data;
      const color = [pixelData[0], // r
      pixelData[1], // g
      pixelData[2]];
      const colorRegExObject = new RegExp(`(${color})`, 'g');

      if (pixelData[3] < 255) {
        // alpha pixels
        transparentPixels = true;
        break;
      }

      if (outlyingColorsList.match(colorRegExObject)) {
        outlyingColors.push(color);
      } else {
        colors.push(color);
      }
    }
  }

  if (outlyingColors.length > colors.length) {
    colors = outlyingColors;
  }

  if (transparentPixels) {
    return null;
  }

  const colorMap = (0, _quantize.default)(colors, 5);
  const [r, g, b] = Array.from(colorMap.palette()[0]);
  return `rgb(${r},${g},${b})`;
}

function requestFile(callback) {
  const input = document.createElement("input");
  input.type = 'file';
  input.accept = "image/*";

  input.onchange = function (event) {
    const file = event.target.files[0];
    console.log('☔️☔️☔️ input onchange', file);
    callback(file);
  };

  input.click();
  console.log('input created: ', input);
}

function getUserCoverImagePolicy(api, id) {
  return api.get(`users/${id}/cover/policy`);
}

function getTeamAvatarImagePolicy(api, id) {
  return api.get(`teams/${id}/avatar/policy`);
}

function getTeamCoverImagePolicy(api, id) {
  return api.get(`teams/${id}/cover/policy`);
}

function uploadAsset(blob, policy, key) {
  return (0, _s3Uploader.default)(policy).upload({
    key,
    blob
  });
}

function uploadAssetSizes(blob, policy, sizes, progressHandler) {
  const upload = uploadAsset(blob, policy, 'original');
  upload.progress(progressHandler);
  const scaledUploads = Object.keys(sizes).map(function (tag) {
    return resizeImage(blob, sizes[tag]).then(function (resized) {
      return uploadAsset(resized, policy, tag);
    });
  });
  return Promise.all([upload, ...scaledUploads]);
}

/***/ }),

/***/ "./src/utils/models.js":
/*!*****************************!*\
  !*** ./src/utils/models.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getDisplayNameForModel = exports.getUrlForModel = void 0;

var _collection = __webpack_require__(/*! ../models/collection */ "./src/models/collection.js");

var _project = __webpack_require__(/*! ../models/project */ "./src/models/project.js");

var _team = __webpack_require__(/*! ../models/team */ "./src/models/team.js");

var _user = __webpack_require__(/*! ../models/user */ "./src/models/user.js");

const getUrlForModel = function getUrlForModel(model, modelType) {
  switch (modelType) {
    case "project":
      return (0, _project.getLink)(model);

    case "collection":
      return (0, _collection.getLink)(model);

    case "team":
      return (0, _team.getLink)(model);

    case "user":
      return (0, _user.getLink)(model);
  }
};

exports.getUrlForModel = getUrlForModel;

const getDisplayNameForModel = function getDisplayNameForModel(model, modelType) {
  let thingName;

  switch (modelType) {
    case "project":
      thingName = model.domain;
      break;

    case "user":
      thingName = model.login;
      break;

    case "collection":
    case "team":
      thingName = model.name;
      break;
  }

  return thingName;
};

exports.getDisplayNameForModel = getDisplayNameForModel;

/***/ }),

/***/ "./src/utils/progress-promise.js":
/*!***************************************!*\
  !*** ./src/utils/progress-promise.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;
var _default = ProgressPromise; // Extend promises with `finally`
// From: https://github.com/domenic/promises-unwrapping/issues/18

exports.default = _default;

if (Promise.prototype.finally == null) {
  Promise.prototype.finally = function (callback) {
    // We don’t invoke the callback in here,
    // because we want then() to handle its exceptions
    return this.then( // Callback fulfills: pass on predecessor settlement
    // Callback rejects: pass on rejection (=omit 2nd arg.)
    function (value) {
      return Promise.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return Promise.resolve(callback()).then(function () {
        throw reason;
      });
    });
  };
}

if (Promise.prototype._notify == null) {
  Promise.prototype._notify = function (event) {
    return this._progressHandlers.forEach(function (handler) {
      try {
        return handler(event);
      } catch (error) {// empty
      }
    });
  };
}

if (Promise.prototype.progress == null) {
  Promise.prototype.progress = function (handler) {
    if (this._progressHandlers == null) {
      this._progressHandlers = [];
    }

    this._progressHandlers.push(handler);

    return this;
  };
}

function ProgressPromise(fn) {
  var p = new Promise(function (resolve, reject) {
    const notify = function notify() {
      return p._progressHandlers != null ? p._progressHandlers.forEach(function (handler) {
        try {
          return handler(event);
        } catch (error) {//empty
        }
      }) : undefined;
    };

    return fn(resolve, reject, notify);
  });

  p.then = function (onFulfilled, onRejected) {
    const result = Promise.prototype.then.call(p, onFulfilled, onRejected); // Pass progress through

    p.progress(result._notify.bind(result));
    return result;
  };

  return p;
}

/***/ }),

/***/ "./src/utils/s3-uploader.js":
/*!**********************************!*\
  !*** ./src/utils/s3-uploader.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = _default;

var _progressPromise = _interopRequireDefault(__webpack_require__(/*! ./progress-promise */ "./src/utils/progress-promise.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */

/*
S3 Uploader
===========

Upload data directly to S3 from the client.

Usage
-----

>     uploader = S3.uploader(JSON.parse(localStorage.S3Policy))
>     uploader.upload
>       key: "myfile.text"
>       blob: new Blob ["radical"]
>       cacheControl: 60 # default 0


The uploader automatically prefixes the key with the namespace specified in the
policy.

A promise is returned that is fulfilled with the url of the uploaded resource.

>     .then (url) -> # "https://s3.amazonaws.com/trinket/18894/myfile.txt"

The promise is rejected with an error if the upload fails.

A progress event is fired with the percentage of the upload that has completed.

The policy is a JSON object with the following keys:

- `accessKey`
- `policy`
- `signature`

Since these are all needed to create and sign the policy we keep them all
together.

Giving this object to the uploader method creates an uploader capable of
asynchronously uploading files to the bucket specified in the policy.

Notes
-----

The policy must specify a `Cache-Control` header because we always try to set it.

License
-------

The MIT License (MIT)

Copyright (c) 2014

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
function _default(credentials) {
  const {
    policy,
    signature,
    accessKeyId
  } = credentials;
  const {
    acl,
    bucket,
    namespace
  } = extractPolicyData(policy);
  const bucketUrl = `https://s3.amazonaws.com/${bucket}`;

  const urlFor = function urlFor(key) {
    const namespacedKey = `${namespace}${key}`;
    return `${bucketUrl}/${namespacedKey}`;
  };

  return {
    urlFor,

    upload({
      key,
      blob,
      cacheControl
    }) {
      console.log('upload called', key); // 2, based on user id

      console.log('using namespace', namespace); // user-cover/2, not sure what it's based on

      const namespacedKey = `${namespace}${key}`;
      const url = urlFor(key);
      return sendForm(bucketUrl, objectToForm({
        key: namespacedKey,
        "Content-Type": blob.type || 'binary/octet-stream',
        "Cache-Control": `max-age=${cacheControl || 31536000}`,
        AWSAccessKeyId: accessKeyId,
        "x-amz-security-token": credentials.sessionToken,
        acl,
        policy,
        signature,
        file: blob
      })).then(function () {
        return `${bucketUrl}/${encodeURIComponent(namespacedKey)}`;
      });
    }

  };
}

;

const getKey = function getKey(conditions, key) {
  const results = conditions.filter(function (condition) {
    return typeof condition === "object";
  }).map(function (object) {
    return object[key];
  }).filter(function (value) {
    return value;
  });
  return results[0];
};

const getNamespaceFromPolicyConditions = function getNamespaceFromPolicyConditions(conditions) {
  return conditions.filter(function (condition) {
    if (Array.isArray(condition)) {
      const [a, b, c] = Array.from(condition);
      return b === "$key" && (a === "starts-with" || a === "eq");
    }
  })[0][2];
};

var extractPolicyData = function extractPolicyData(policy) {
  const policyObject = JSON.parse(atob(policy));
  const {
    conditions
  } = policyObject;
  return {
    acl: getKey(conditions, "acl"),
    bucket: getKey(conditions, "bucket"),
    namespace: getNamespaceFromPolicyConditions(conditions)
  };
};

const isSuccess = function isSuccess(request) {
  return request.status.toString()[0] === "2";
};

var sendForm = function sendForm(url, formData) {
  return new _progressPromise.default(function (resolve, reject, notify) {
    const request = new XMLHttpRequest();
    request.open("POST", url, true);

    if (request.upload != null) {
      request.upload.onprogress = notify;
    }

    request.onreadystatechange = function (e) {
      if (request.readyState === 4) {
        if (isSuccess(request)) {
          return resolve(request);
        }

        return reject(request);
      }
    };

    return request.send(formData);
  });
};

var objectToForm = function objectToForm(data) {
  let formData;
  return formData = Object.keys(data).reduce(function (formData, key) {
    const value = data[key];

    if (value) {
      formData.append(key, value);
    }

    return formData;
  }, new FormData());
};

/***/ }),

/***/ "./src/utils/sentry.js":
/*!*****************************!*\
  !*** ./src/utils/sentry.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var Sentry = _interopRequireWildcard(__webpack_require__(/*! @sentry/browser */ "../rbd/pnpm-volume/3ca6e845-56fb-42e2-990f-be379f35e87c/node_modules/.registry.npmjs.org/@sentry/browser/4.4.1/node_modules/@sentry/browser/dist/index.js"));

Object.keys(Sentry).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  exports[key] = Sentry[key];
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/* globals ENVIRONMENT, PROJECT_DOMAIN */
//
// This utility wraps the Sentry library so that we can guarantee
// Sentry is initialized before its called.
//
// Only this file shoud import from '@sentry/browser',
// all other users of Sentry should import this file instead.
//
try {
  Sentry.init({
    dsn: 'https://4f1a68242b6944738df12eecc34d377c@sentry.io/1246508',
    environment: ENVIRONMENT,

    beforeSend(event) {
      const tokens = ['facebookToken', 'githubToken', 'persistentToken'];
      let json = JSON.stringify(event);
      tokens.forEach(function (token) {
        const regexp = new RegExp(`"${token}":"[^"]+"`, 'g');
        json = json.replace(regexp, `"${token}":"****"`);
      });
      return JSON.parse(json);
    }

  });
  Sentry.configureScope(function (scope) {
    scope.setTag("PROJECT_DOMAIN", PROJECT_DOMAIN);
  }); // Expose for use on the developer console:

  window.Sentry = Sentry;
} catch (error) {
  console.warn("Error initializing Sentry", error);
}

/***/ })

/******/ });
//# sourceMappingURL=client.js.map