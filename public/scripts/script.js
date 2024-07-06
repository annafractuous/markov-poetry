(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
throttle = require('lodash.throttle');
var MuseMachina = /*#__PURE__*/function () {
  function MuseMachina() {
    _classCallCheck(this, MuseMachina);
    this.saveSelectors();
    this.saveListenerCallbacks();
    this.addListeners();
    this.dictionary = dictionary; // JSONP variable loaded via script tag
    this.dictionaryKeys = Object.keys(this.dictionary);
    this.defaultText = this.composition.innerText;
    this.firstWord = true;
    this.dbInitialized = false;
    this.museumLoaded = false;
    this.poemsPerPage = 20;
  }
  return _createClass(MuseMachina, [{
    key: "saveSelectors",
    value: function saveSelectors() {
      this.activePage = document.querySelector('.active-page');
      this.activeNav = document.querySelector('.active-nav-item');
      this.suggestionEls = document.getElementsByClassName('suggestion-field');
      this.composition = document.getElementById('composition-field');
      this.input = document.getElementById('initial-input');
      this.startBtn = this.suggestionEls[1];
      this.restartBtn = document.getElementById('restart-btn');
      this.backBtn = document.getElementById('back-btn');
      this.saveBtn = document.getElementById('save-btn');
      this.shareBtn = document.getElementById('share-btn');
      this.fbBtn = document.getElementById('share-fb-btn');
      this.twitterBtn = document.getElementById('share-twitter-btn');
      this.shareBtns = document.getElementById('share-btns');
      this.dbSaveBtn = document.getElementById('db-save-btn');
      this.museumEntries = document.getElementById('museum-entries');
    }
  }, {
    key: "saveListenerCallbacks",
    value: function saveListenerCallbacks() {
      var _this = this;
      this.startCallback = function () {
        return _this.start();
      };
      this.selectionCallback = function (e) {
        return _this.updateComposition(e);
      };
      this.museumScrollCallback = throttle(function () {
        return _this.museumLoadMore();
      }, 1000);
    }
  }, {
    key: "addListeners",
    value: function addListeners() {
      this.overlayListener();
      this.navListener();
      this.activeListener();
      this.inactiveListener();
      this.typingListener();
      this.startListener(true);
      this.backspaceListener();
      this.buttonListeners();
    }

    /* LISTENERS /------- */
  }, {
    key: "overlayListener",
    value: function overlayListener() {
      var _this2 = this;
      var overlay = document.querySelector('.save-poem-overlay');
      overlay.addEventListener('click', function () {
        return _this2.toggleSaveDialogue();
      });
    }
  }, {
    key: "navListener",
    value: function navListener() {
      var _this3 = this;
      var navItems = document.querySelectorAll('.nav-list-item');
      navItems.forEach(function (el) {
        el.addEventListener('click', function (e) {
          return _this3.clickNavItem(e);
        });
      });
    }
  }, {
    key: "activeListener",
    value: function activeListener() {
      var _this4 = this;
      this.input.addEventListener('click', function () {
        return _this4.clearDefaultText();
      });
    }
  }, {
    key: "inactiveListener",
    value: function inactiveListener() {
      var _this5 = this;
      window.addEventListener('click', function (e) {
        return _this5.replaceDefaultText(e);
      });
    }
  }, {
    key: "typingListener",
    value: function typingListener() {
      var _this6 = this;
      this.input.addEventListener('input', function (e) {
        return _this6.type(e);
      });
    }
  }, {
    key: "startListener",
    value: function startListener(enabled) {
      enabled ? this.startBtn.addEventListener('click', this.startCallback) : this.startBtn.removeEventListener('click', this.startCallback);
    }
  }, {
    key: "backspaceListener",
    value: function backspaceListener() {
      var _this7 = this;
      window.addEventListener('keyup', function (e) {
        if (e.keyCode === 8 && !_this7.firstWord) {
          _this7.deleteLastWord();
        }
      });
    }
  }, {
    key: "selectionListener",
    value: function selectionListener(enabled) {
      var _this8 = this;
      if (enabled) {
        _toConsumableArray(this.suggestionEls).forEach(function (el) {
          el.addEventListener('click', _this8.selectionCallback);
        });
      } else {
        _toConsumableArray(this.suggestionEls).forEach(function (el) {
          el.removeEventListener('click', _this8.selectionCallback);
        });
      }
    }
  }, {
    key: "scrollListener",
    value: function scrollListener(enabled) {
      enabled ? window.addEventListener('scroll', this.museumScrollCallback) : window.removeEventListener('scroll', this.museumScrollCallback);
    }
  }, {
    key: "buttonListeners",
    value: function buttonListeners() {
      var _this9 = this;
      this.restartBtn.addEventListener('click', function () {
        return _this9.restartComposition();
      });
      this.backBtn.addEventListener('click', function () {
        return _this9.deleteLastWord();
      });
      this.saveBtn.addEventListener('click', function () {
        return _this9.toggleSaveDialogue();
      });
      this.shareBtn.addEventListener('click', function () {
        return _this9.toggleShareButtons();
      });
      this.fbBtn.addEventListener('click', function () {
        return _this9.shareToFB();
      });
      this.twitterBtn.addEventListener('click', function () {
        return _this9.shareToTwitter();
      });
      this.dbSaveBtn.addEventListener('click', function () {
        return _this9.savePoem();
      });
    }

    /* NAVIGATION /------- */
  }, {
    key: "clickNavItem",
    value: function clickNavItem(e) {
      var pageSelection = e.currentTarget.dataset.page;
      var nextPage = document.getElementById(pageSelection);
      if (nextPage !== this.activePage) {
        if (!this.museumLoaded && nextPage.id === 'museum-page') this.loadMuseum();
        this.navigate(nextPage);
        this.updateActiveNav(pageSelection);
      }
    }
  }, {
    key: "navigate",
    value: function navigate(nextPage) {
      var _this10 = this;
      this.activePage.classList.add('slide-out');
      nextPage.classList.add('slide-in');
      setTimeout(function () {
        _this10.activePage.classList.remove('active-page');
        _this10.activePage.classList.remove('slide-out');
        nextPage.classList.add('active-page');
        nextPage.classList.remove('slide-in');
        _this10.activePage = nextPage;
      }, 300); // 300ms = sliding transition speed
    }
  }, {
    key: "updateActiveNav",
    value: function updateActiveNav(pageSelection) {
      var nextNav = document.querySelector('[data-page=' + pageSelection);
      this.activeNav.classList.remove('active-nav-item');
      nextNav.classList.add('active-nav-item');
      this.activeNav = nextNav;
    }

    /* INPUT /------- */
  }, {
    key: "type",
    value: function type(e) {
      var word;
      word = e.target.value;
      word = word.split(' ')[0];
      word = word.trim().toLowerCase();
      this.composition.innerText = word;
      this.showStart(!!word.length);
    }
  }, {
    key: "showStart",
    value: function showStart(show) {
      show ? this.startBtn.classList.add('start-btn') : this.startBtn.classList.remove('start-btn');
    }
  }, {
    key: "start",
    value: function start() {
      this.showStart(false);
      this.startListener(false);
      this.selectionListener(true);
      this.disableInput();
      this.readInput();
    }
  }, {
    key: "readInput",
    value: function readInput() {
      var word = this.composition.innerText;
      this.showSuggestions(word);
      this.toggleButtonsState(true);
    }
  }, {
    key: "disableInput",
    value: function disableInput() {
      this.input.disabled = true;
      this.firstWord = false;
    }
  }, {
    key: "enableInput",
    value: function enableInput() {
      this.input.disabled = false;
      this.input.value = '';
      this.input.focus();
      this.firstWord = true;
    }

    /* COMPOSITION /------- */
  }, {
    key: "updateComposition",
    value: function updateComposition(e) {
      var word = e.target.innerText;
      if (word) {
        this.addNextWord(word);
        this.showSuggestions(word);
      }
    }
  }, {
    key: "addNextWord",
    value: function addNextWord(word) {
      this.composition.innerText += ' ' + word;
    }
  }, {
    key: "deleteLastWord",
    value: function deleteLastWord() {
      var words = this.composition.innerText.split(' ');
      words.pop();
      if (words.length) {
        this.composition.innerText = words.join(' ');
        this.refreshSuggestions();
      } else {
        this.restartComposition();
      }
    }
  }, {
    key: "getLastWord",
    value: function getLastWord() {
      var words = this.composition.innerText.split(' ');
      var lastIdx = words.length - 1;
      return words[lastIdx];
    }
  }, {
    key: "restartComposition",
    value: function restartComposition() {
      this.composition.innerText = '';
      this.enableInput();
      this.clearSuggestions();
      this.toggleButtonsState(false);
      this.startListener(true);
    }

    /* SUGGESTIONS /------- */
  }, {
    key: "showSuggestions",
    value: function showSuggestions(word) {
      var suggestions = this.getSuggestions(word);
      this.returnSuggestions(suggestions);
    }
  }, {
    key: "getSuggestions",
    value: function getSuggestions(word) {
      var possibilities = this.dictionary[word];
      var uniquePossibilities = this.makeUnique(possibilities);
      var suggestions = [];
      if (uniquePossibilities.length < 3) {
        var defaultsNeeded = 3 - uniquePossibilities.length;
        var defaults = this.getDefaults(defaultsNeeded);
        suggestions = [].concat(_toConsumableArray(uniquePossibilities), _toConsumableArray(defaults));
      } else if (uniquePossibilities.length === 3) {
        suggestions = uniquePossibilities;
      } else {
        while (suggestions.length < 3) {
          var suggestion = this.getRandomEl(possibilities);
          if (!suggestions.includes(suggestion)) suggestions.push(suggestion);
        }
      }
      return suggestions;
    }
  }, {
    key: "getDefaults",
    value: function getDefaults(defaultsNeeded) {
      var defaults = this.getSuggestions('the');
      return defaults.slice(0, defaultsNeeded);
    }
  }, {
    key: "returnSuggestions",
    value: function returnSuggestions(suggestions) {
      for (var i = 0, l = 3; i < l; i++) {
        this.suggestionEls[i].innerText = suggestions[i];
      }
    }
  }, {
    key: "refreshSuggestions",
    value: function refreshSuggestions() {
      var lastWord = this.getLastWord();
      this.showSuggestions(lastWord);
    }
  }, {
    key: "clearSuggestions",
    value: function clearSuggestions() {
      _toConsumableArray(this.suggestionEls).forEach(function (suggestion) {
        suggestion.innerText = '';
      });
    }

    /* MUSEUM /------- */
  }, {
    key: "loadMuseum",
    value: function loadMuseum() {
      if (!this.dbInitialized) this.initializeFirebase();
      this.fetchPoems(true);
      this.scrollListener(true);
      this.museumLoaded = true;
    }
  }, {
    key: "initializeFirebase",
    value: function initializeFirebase() {
      this.db = firebase.database();
      this.poemsDB = this.db.ref('poems');
      debugger;
      this.dbInitialized = true;
    }
  }, {
    key: "fetchPoems",
    value: function fetchPoems(firstPage) {
      var _this11 = this;
      var query = firstPage ? this.poemsDB : this.poemsDB.orderByKey().endAt(this.lastPoem);
      query.limitToLast(this.poemsPerPage + 1).on('value', function (snapshot) {
        _this11.processPoems(snapshot.val(), firstPage);
      }, function (errorObject) {
        console.log('The read failed: ', errorObject);
      });
    }
  }, {
    key: "processPoems",
    value: function processPoems(data) {
      var keys = Object.keys(data);
      var noMorePoems = keys.length < this.poemsPerPage;
      var poems = noMorePoems ? Object.values(data) : Object.values(data).slice(1);
      if (noMorePoems) this.scrollListener(false);
      this.lastPoem = keys[0];
      this.displayPoems(poems);
    }
  }, {
    key: "displayPoems",
    value: function displayPoems(poems) {
      var _this12 = this;
      poems = poems.reverse();
      poems.forEach(function (poem) {
        return _this12.displayPoem(poem);
      });
    }
  }, {
    key: "displayPoem",
    value: function displayPoem(poem) {
      var html = "\n            <div class=\"museum-entry\">\n                <p class=\"poem-text\">".concat(poem.poem, "</p>\n                <p class=\"poem-composer\">").concat(poem.user, "</p>\n            </div>\n        ");
      this.museumEntries.innerHTML += html;
    }
  }, {
    key: "museumLoadMore",
    value: function museumLoadMore() {
      if (this.activePage.id === 'museum-page') {
        var distanceFromBottom = this.museumEntries.getBoundingClientRect().bottom - window.innerHeight;
        if (distanceFromBottom <= window.innerHeight) this.fetchPoems();
      }
    }
  }, {
    key: "savePoem",
    value: function savePoem() {
      var poem = this.composition.innerText;
      var penname = document.getElementById('penname').value;
      if (!this.dbInitialized) this.initializeFirebase();
      this.savePoemToDB(poem, penname);
      this.toggleSaveDialogue();
    }
  }, {
    key: "savePoemToDB",
    value: function savePoemToDB(poem, user) {
      var key = this.poemsDB.push().key;
      var data = {};
      data[key] = {
        poem: poem,
        user: user
      };
      this.poemsDB.update(data);
    }

    /* UI STATES /------- */
  }, {
    key: "toggleButtonsState",
    value: function toggleButtonsState(enabledState) {
      [this.restartBtn, this.backBtn, this.saveBtn, this.shareBtn].forEach(function (btn) {
        enabledState ? btn.classList.remove('disabled') : btn.classList.add('disabled');
      });
    }
  }, {
    key: "toggleSaveDialogue",
    value: function toggleSaveDialogue() {
      document.body.classList.toggle('dialogue-open');
    }
  }, {
    key: "toggleShareButtons",
    value: function toggleShareButtons() {
      this.shareBtns.classList.toggle('expanded');
    }
  }, {
    key: "clearDefaultText",
    value: function clearDefaultText() {
      if (this.input.value === '') {
        this.composition.innerText = '';
      }
    }
  }, {
    key: "replaceDefaultText",
    value: function replaceDefaultText(e) {
      if (e.target.id !== 'initial-input' && this.input.value === '') {
        this.composition.innerText = this.defaultText;
      }
    }

    /* SHARING /------- */
  }, {
    key: "shareToFB",
    value: function shareToFB() {
      var encodedPoem = encodeURI(this.composition.innerText);
      window.open("https://www.facebook.com/dialog/share?app_id=344145906430055&display=popup&href=https%3A%2F%2Fmusemachina.com&quote=".concat(encodedPoem), '_blank');
      this.toggleShareButtons();
    }
  }, {
    key: "shareToTwitter",
    value: function shareToTwitter() {
      var text = "\"".concat(this.composition.innerText, "\" | composing computer poetry at https://musemachina.com");
      var encoded = encodeURI(text);
      window.open("https://twitter.com/intent/tweet?text=".concat(encoded), '_blank');
      this.toggleShareButtons();
    }

    /* UTILS /------- */
  }, {
    key: "makeUnique",
    value: function makeUnique(array) {
      return _toConsumableArray(new Set(array));
    }
  }, {
    key: "getRandomEl",
    value: function getRandomEl(array) {
      return array[Math.floor(Math.random() * array.length)];
    }
  }]);
}();
document.addEventListener('DOMContentLoaded', function () {
  MuseMachina = new MuseMachina();
});

},{"lodash.throttle":1}]},{},[2]);
