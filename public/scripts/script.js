(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
throttle = require('lodash.throttle')

class App {
    constructor() {
        this.saveSelectors()
        this.saveListenerCallbacks()
        this.addListeners()

        this.dictionary     = dictionary     // JSONP variable loaded via script tag
        this.dictionaryKeys = Object.keys(this.dictionary)
        this.defaultText    = this.composition.innerText
        this.firstWord      = true
        this.dbInitialized  = false
        this.museumLoaded   = false
        this.poemsPerPage   = 20

        console.log(dictionary)
    }

    saveSelectors() {
        this.activePage    = document.querySelector('.active-page')
        this.activeNav     = document.querySelector('.active-nav-item')
        this.suggestionEls = document.getElementsByClassName('suggestion-field')
        this.composition   = document.getElementById('composition-field')
        this.input         = document.getElementById('initial-input')
        this.startBtn      = this.suggestionEls[1]
        this.restartBtn    = document.getElementById('restart-btn')
        this.backBtn       = document.getElementById('back-btn')
        this.saveBtn       = document.getElementById('save-btn')
        this.shareBtn      = document.getElementById('share-btn')
        this.fbBtn         = document.getElementById('share-fb-btn')
        this.twitterBtn    = document.getElementById('share-twitter-btn')
        this.shareBtns     = document.getElementById('share-btns')
        this.dbSaveBtn     = document.getElementById('db-save-btn')
        this.museumEntries = document.getElementById('museum-entries')
    }

    saveListenerCallbacks() {
        this.startCallback = () => this.start()
        this.selectionCallback = (e) => this.updateComposition(e)
        this.museumScrollCallback = throttle(() => this.museumLoadMore(), 1000)
    }

    addListeners() {
        this.overlayListener()
        this.navListener()
        this.activeListener()
        this.inactiveListener()
        this.typingListener()
        this.startListener(true)
        this.backspaceListener()
        this.buttonListeners()
    }

/* LISTENERS /------- */

    overlayListener() {
        const overlay = document.querySelector('.save-poem-overlay')
        overlay.addEventListener('click', () => this.toggleSaveDialogue())
    }

    navListener() {
        const navItems = document.querySelectorAll('.nav-list-item')
        navItems.forEach((el) => {
            el.addEventListener('click', (e) => this.clickNavItem(e))
        })
    }

    activeListener() {
        this.input.addEventListener('click', () => this.clearDefaultText())
    }

    inactiveListener() {
        window.addEventListener('click', (e) => this.replaceDefaultText(e))
    }

    typingListener() {
        this.input.addEventListener('input', (e) => this.type(e))
    }

    startListener(enabled) {
        enabled ? this.startBtn.addEventListener('click', this.startCallback) : this.startBtn.removeEventListener('click', this.startCallback)
    }

    backspaceListener() {
        window.addEventListener('keyup', (e) => {
            if (e.keyCode === 8 && !this.firstWord) {
                this.deleteLastWord()
            }
        })
    }

    selectionListener(enabled) {
        if (enabled) {
            [...this.suggestionEls].forEach((el) => {
                el.addEventListener('click', this.selectionCallback)
            })
        } else {
            [...this.suggestionEls].forEach((el) => {
                el.removeEventListener('click', this.selectionCallback)
            })
        }
    }

    scrollListener(enabled) {
        enabled ? window.addEventListener('scroll', this.museumScrollCallback) : window.removeEventListener('scroll', this.museumScrollCallback)
    }

    buttonListeners() {
        this.restartBtn.addEventListener('click', () => this.restartComposition())
        this.backBtn.addEventListener('click', () => this.deleteLastWord())
        this.saveBtn.addEventListener('click', () => this.toggleSaveDialogue())
        this.shareBtn.addEventListener('click', () => this.toggleShareButtons())
        this.fbBtn.addEventListener('click', () => this.shareToFB())
        this.twitterBtn.addEventListener('click', () => this.shareToTwitter())
        this.dbSaveBtn.addEventListener('click', () => this.savePoem())
    }

/* NAVIGATION /------- */

    clickNavItem(e) {
        const pageSelection = e.currentTarget.dataset.page
        const nextPage = document.getElementById(pageSelection)

        if (nextPage !== this.activePage) {
            if (!this.museumLoaded && nextPage.id === 'museum-page') this.loadMuseum()

            this.navigate(nextPage)
            this.updateActiveNav(pageSelection)
        }
    }

    navigate(nextPage) {
        this.activePage.classList.add('slide-out')
        nextPage.classList.add('slide-in')

        setTimeout(() => {
            this.activePage.classList.remove('active-page')
            this.activePage.classList.remove('slide-out')
            nextPage.classList.add('active-page')
            nextPage.classList.remove('slide-in')

            this.activePage = nextPage
        }, 300)     // 300ms = sliding transition speed
    }

    updateActiveNav(pageSelection) {
        const nextNav = document.querySelector('[data-page=' + pageSelection)

        this.activeNav.classList.remove('active-nav-item')
        nextNav.classList.add('active-nav-item')

        this.activeNav = nextNav
    }

/* INPUT /------- */

    type(e) {
        let word

        word = e.target.value
        word = word.split(' ')[0]
        word = word.trim().toLowerCase()

        this.composition.innerText = word

        this.showStart(!!word.length)
    }

    showStart(show) {
        show ? this.startBtn.classList.add('start-btn') : this.startBtn.classList.remove('start-btn')
    }

    start() {
        this.showStart(false)
        this.startListener(false)
        this.selectionListener(true)
        this.disableInput()
        this.readInput()
    }

    readInput() {
        const word = this.composition.innerText

        this.showSuggestions(word)
        this.toggleButtonsState(true)
    }

    disableInput() {
        this.input.disabled = true
        this.firstWord = false
    }

    enableInput() {
        this.input.disabled = false
        this.input.value = ''
        this.input.focus()

        this.firstWord = true
    }

/* COMPOSITION /------- */

    updateComposition(e) {
        const word = e.target.innerText

        if (word) {
            this.addNextWord(word)
            this.showSuggestions(word)
        }
    }

    addNextWord(word) {
        this.composition.innerText += ' ' + word
    }

    deleteLastWord() {
        const words = this.composition.innerText.split(' ')

        words.pop()

        if (words.length) {
            this.composition.innerText = words.join(' ')
            this.refreshSuggestions()
        } else {
            this.restartComposition()
        }
    }

    getLastWord() {
        const words = this.composition.innerText.split(' ')
        const lastIdx = words.length - 1

        return words[lastIdx]
    }

    restartComposition() {
        this.composition.innerText = ''

        this.enableInput()
        this.clearSuggestions()
        this.toggleButtonsState(false)
        this.startListener(true)
    }

/* SUGGESTIONS /------- */

    showSuggestions(word) {
        const suggestions = this.getSuggestions(word)
        this.returnSuggestions(suggestions)
    }

    getSuggestions(word) {
        const possibilities = this.dictionary[word]
        const uniquePossibilities = this.makeUnique(possibilities)
        
        let suggestions = []

        if (uniquePossibilities.length < 3) {
            const defaultsNeeded = 3 - uniquePossibilities.length
            const defaults = this.getDefaults(defaultsNeeded)
            suggestions = [...uniquePossibilities, ...defaults]
        } else if (uniquePossibilities.length === 3) {
            suggestions = uniquePossibilities
        } else {
            while (suggestions.length < 3) {
                let suggestion = this.getRandomEl(possibilities)
                if (!suggestions.includes(suggestion)) suggestions.push(suggestion)
            }
        }

        return suggestions
    }

    getDefaults(defaultsNeeded) {
        const defaults = this.getSuggestions('the')
        return defaults.slice(0, defaultsNeeded)
    }

    returnSuggestions(suggestions) {
        for (let i = 0, l = 3; i < l; i++) {
            this.suggestionEls[i].innerText = suggestions[i]
        }
    }

    refreshSuggestions() {
        const lastWord = this.getLastWord()
        this.showSuggestions(lastWord)
    }

    clearSuggestions() {
        [...this.suggestionEls].forEach((suggestion) => {
            suggestion.innerText = ''
        })
    }

/* MUSEUM /------- */
    
    loadMuseum() {
        if (!this.dbInitialized) this.initializeFirebase()
        this.fetchPoems(true)
        this.scrollListener(true)

        this.museumLoaded = true
    }

    initializeFirebase() {
        this.db = firebase.database()
        this.poemsDB = this.db.ref('poems')

        this.dbInitialized = true
    }

    fetchPoems(firstPage) {
        const query = firstPage ? this.poemsDB : this.poemsDB.orderByKey().endAt(this.lastPoem)

        query.limitToLast(this.poemsPerPage + 1).on('value', (snapshot) => {
            this.processPoems(snapshot.val(), firstPage)
        }, (errorObject) => {
            console.log('The read failed: ', errorObject)
        })
    }

    processPoems(data) {
        const keys = Object.keys(data)
        const noMorePoems = keys.length < this.poemsPerPage
        const poems = noMorePoems ? Object.values(data) : Object.values(data).slice(1)
        
        if (noMorePoems) this.scrollListener(false)
        this.lastPoem = keys[0]

        this.displayPoems(poems)
    }

    displayPoems(poems) {
        poems = poems.reverse()
        poems.forEach((poem) => this.displayPoem(poem))
    }

    displayPoem(poem) {
        const html = `
            <div class="museum-entry">
                <p class="poem-text">${poem.poem}</p>
                <p class="poem-composer">${poem.user}</p>
            </div>
        `
        this.museumEntries.innerHTML += html
    }

    museumLoadMore() {
        if (this.activePage.id === 'museum-page') {
            const distanceFromBottom = this.museumEntries.getBoundingClientRect().bottom - window.innerHeight
            if (distanceFromBottom <= window.innerHeight) this.fetchPoems()
        }
    }

    savePoem() {
        const poem = this.composition.innerText
        const penname = document.getElementById('penname').value

        if (!this.dbInitialized) this.initializeFirebase()
        this.savePoemToDB(poem, penname)

        this.toggleSaveDialogue()
    }

    savePoemToDB(poem, user) {
        const key = this.poemsDB.push().key
        const data = {}

        data[key] = {
            poem: poem,
            user: user
        }

        this.poemsDB.update(data)
    }

/* UI STATES /------- */

    toggleButtonsState(enabledState) {
        [this.restartBtn, this.backBtn, this.saveBtn, this.shareBtn].forEach((btn) => {
            enabledState ? btn.classList.remove('disabled') : btn.classList.add('disabled')
        })
    }

    toggleSaveDialogue() {
        document.body.classList.toggle('dialogue-open')
    }
    
    toggleShareButtons() {
        this.shareBtns.classList.toggle('expanded')
    }

    clearDefaultText() {
        if (this.input.value == '') {
            this.composition.innerText = ''
        }
    }

    replaceDefaultText(e) {
        if (e.target.id !== 'initial-input' && this.input.value == '') {
            this.composition.innerText = this.defaultText
        }
    }

/* SHARING /------- */

    shareToFB() {
        const encodedPoem = encodeURI(this.composition.innerText)
        window.open(`https://www.facebook.com/dialog/share?app_id=344145906430055&display=popup&href=https%3A%2F%2Fmusemachina.com&quote=${encodedPoem}`, '_blank')

        this.toggleShareButtons()
    }
    
    shareToTwitter() {
        const text = `"${this.composition.innerText}" | composing computer poetry at https://musemachina.com`
        const encoded = encodeURI(text)
        window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank')

        this.toggleShareButtons()
    }

/* UTILS /------- */

    makeUnique(array) {
        return [...new Set(array)]
    }

    getRandomEl(array) {
        return array[Math.floor(Math.random() * array.length)]
    }
}

document.addEventListener('DOMContentLoaded', function() {
    MuseMachina = new App()
})
},{"lodash.throttle":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLnRocm90dGxlL2luZGV4LmpzIiwic2NyaXB0cy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRocm90dGxlZCBmdW5jdGlvbiB0aGF0IG9ubHkgaW52b2tlcyBgZnVuY2AgYXQgbW9zdCBvbmNlIHBlclxuICogZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gVGhlIHRocm90dGxlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGBcbiAqIG1ldGhvZCB0byBjYW5jZWwgZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG9cbiAqIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYFxuICogc2hvdWxkIGJlIGludm9rZWQgb24gdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YFxuICogdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZVxuICogdGhyb3R0bGVkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gcmV0dXJuIHRoZVxuICogcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLnRocm90dGxlYCBhbmQgYF8uZGVib3VuY2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gdGhyb3R0bGUuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhyb3R0bGUgaW52b2NhdGlvbnMgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgdGhyb3R0bGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBleGNlc3NpdmVseSB1cGRhdGluZyB0aGUgcG9zaXRpb24gd2hpbGUgc2Nyb2xsaW5nLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Njcm9sbCcsIF8udGhyb3R0bGUodXBkYXRlUG9zaXRpb24sIDEwMCkpO1xuICpcbiAqIC8vIEludm9rZSBgcmVuZXdUb2tlbmAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGJ1dCBub3QgbW9yZSB0aGFuIG9uY2UgZXZlcnkgNSBtaW51dGVzLlxuICogdmFyIHRocm90dGxlZCA9IF8udGhyb3R0bGUocmVuZXdUb2tlbiwgMzAwMDAwLCB7ICd0cmFpbGluZyc6IGZhbHNlIH0pO1xuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIHRocm90dGxlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyB0aHJvdHRsZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIHRocm90dGxlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsZWFkaW5nID0gdHJ1ZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gJ2xlYWRpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMubGVhZGluZyA6IGxlYWRpbmc7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuICByZXR1cm4gZGVib3VuY2UoZnVuYywgd2FpdCwge1xuICAgICdsZWFkaW5nJzogbGVhZGluZyxcbiAgICAnbWF4V2FpdCc6IHdhaXQsXG4gICAgJ3RyYWlsaW5nJzogdHJhaWxpbmdcbiAgfSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlO1xuIiwidGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKVxuXG5jbGFzcyBBcHAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnNhdmVTZWxlY3RvcnMoKVxuICAgICAgICB0aGlzLnNhdmVMaXN0ZW5lckNhbGxiYWNrcygpXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXJzKClcblxuICAgICAgICB0aGlzLmRpY3Rpb25hcnkgICAgID0gZGljdGlvbmFyeSAgICAgLy8gSlNPTlAgdmFyaWFibGUgbG9hZGVkIHZpYSBzY3JpcHQgdGFnXG4gICAgICAgIHRoaXMuZGljdGlvbmFyeUtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmRpY3Rpb25hcnkpXG4gICAgICAgIHRoaXMuZGVmYXVsdFRleHQgICAgPSB0aGlzLmNvbXBvc2l0aW9uLmlubmVyVGV4dFxuICAgICAgICB0aGlzLmZpcnN0V29yZCAgICAgID0gdHJ1ZVxuICAgICAgICB0aGlzLmRiSW5pdGlhbGl6ZWQgID0gZmFsc2VcbiAgICAgICAgdGhpcy5tdXNldW1Mb2FkZWQgICA9IGZhbHNlXG4gICAgICAgIHRoaXMucG9lbXNQZXJQYWdlICAgPSAyMFxuXG4gICAgICAgIGNvbnNvbGUubG9nKGRpY3Rpb25hcnkpXG4gICAgfVxuXG4gICAgc2F2ZVNlbGVjdG9ycygpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVQYWdlICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFjdGl2ZS1wYWdlJylcbiAgICAgICAgdGhpcy5hY3RpdmVOYXYgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFjdGl2ZS1uYXYtaXRlbScpXG4gICAgICAgIHRoaXMuc3VnZ2VzdGlvbkVscyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3N1Z2dlc3Rpb24tZmllbGQnKVxuICAgICAgICB0aGlzLmNvbXBvc2l0aW9uICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29tcG9zaXRpb24tZmllbGQnKVxuICAgICAgICB0aGlzLmlucHV0ICAgICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5pdGlhbC1pbnB1dCcpXG4gICAgICAgIHRoaXMuc3RhcnRCdG4gICAgICA9IHRoaXMuc3VnZ2VzdGlvbkVsc1sxXVxuICAgICAgICB0aGlzLnJlc3RhcnRCdG4gICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGFydC1idG4nKVxuICAgICAgICB0aGlzLmJhY2tCdG4gICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFjay1idG4nKVxuICAgICAgICB0aGlzLnNhdmVCdG4gICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F2ZS1idG4nKVxuICAgICAgICB0aGlzLnNoYXJlQnRuICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hhcmUtYnRuJylcbiAgICAgICAgdGhpcy5mYkJ0biAgICAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NoYXJlLWZiLWJ0bicpXG4gICAgICAgIHRoaXMudHdpdHRlckJ0biAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaGFyZS10d2l0dGVyLWJ0bicpXG4gICAgICAgIHRoaXMuc2hhcmVCdG5zICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaGFyZS1idG5zJylcbiAgICAgICAgdGhpcy5kYlNhdmVCdG4gICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RiLXNhdmUtYnRuJylcbiAgICAgICAgdGhpcy5tdXNldW1FbnRyaWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ211c2V1bS1lbnRyaWVzJylcbiAgICB9XG5cbiAgICBzYXZlTGlzdGVuZXJDYWxsYmFja3MoKSB7XG4gICAgICAgIHRoaXMuc3RhcnRDYWxsYmFjayA9ICgpID0+IHRoaXMuc3RhcnQoKVxuICAgICAgICB0aGlzLnNlbGVjdGlvbkNhbGxiYWNrID0gKGUpID0+IHRoaXMudXBkYXRlQ29tcG9zaXRpb24oZSlcbiAgICAgICAgdGhpcy5tdXNldW1TY3JvbGxDYWxsYmFjayA9IHRocm90dGxlKCgpID0+IHRoaXMubXVzZXVtTG9hZE1vcmUoKSwgMTAwMClcbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMub3ZlcmxheUxpc3RlbmVyKClcbiAgICAgICAgdGhpcy5uYXZMaXN0ZW5lcigpXG4gICAgICAgIHRoaXMuYWN0aXZlTGlzdGVuZXIoKVxuICAgICAgICB0aGlzLmluYWN0aXZlTGlzdGVuZXIoKVxuICAgICAgICB0aGlzLnR5cGluZ0xpc3RlbmVyKClcbiAgICAgICAgdGhpcy5zdGFydExpc3RlbmVyKHRydWUpXG4gICAgICAgIHRoaXMuYmFja3NwYWNlTGlzdGVuZXIoKVxuICAgICAgICB0aGlzLmJ1dHRvbkxpc3RlbmVycygpXG4gICAgfVxuXG4vKiBMSVNURU5FUlMgLy0tLS0tLS0gKi9cblxuICAgIG92ZXJsYXlMaXN0ZW5lcigpIHtcbiAgICAgICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zYXZlLXBvZW0tb3ZlcmxheScpXG4gICAgICAgIG92ZXJsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLnRvZ2dsZVNhdmVEaWFsb2d1ZSgpKVxuICAgIH1cblxuICAgIG5hdkxpc3RlbmVyKCkge1xuICAgICAgICBjb25zdCBuYXZJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uYXYtbGlzdC1pdGVtJylcbiAgICAgICAgbmF2SXRlbXMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHRoaXMuY2xpY2tOYXZJdGVtKGUpKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFjdGl2ZUxpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5jbGVhckRlZmF1bHRUZXh0KCkpXG4gICAgfVxuXG4gICAgaW5hY3RpdmVMaXN0ZW5lcigpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHRoaXMucmVwbGFjZURlZmF1bHRUZXh0KGUpKVxuICAgIH1cblxuICAgIHR5cGluZ0xpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHRoaXMudHlwZShlKSlcbiAgICB9XG5cbiAgICBzdGFydExpc3RlbmVyKGVuYWJsZWQpIHtcbiAgICAgICAgZW5hYmxlZCA/IHRoaXMuc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnN0YXJ0Q2FsbGJhY2spIDogdGhpcy5zdGFydEJ0bi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc3RhcnRDYWxsYmFjaylcbiAgICB9XG5cbiAgICBiYWNrc3BhY2VMaXN0ZW5lcigpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDggJiYgIXRoaXMuZmlyc3RXb3JkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVMYXN0V29yZCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc2VsZWN0aW9uTGlzdGVuZXIoZW5hYmxlZCkge1xuICAgICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgWy4uLnRoaXMuc3VnZ2VzdGlvbkVsc10uZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2VsZWN0aW9uQ2FsbGJhY2spXG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgWy4uLnRoaXMuc3VnZ2VzdGlvbkVsc10uZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2VsZWN0aW9uQ2FsbGJhY2spXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2Nyb2xsTGlzdGVuZXIoZW5hYmxlZCkge1xuICAgICAgICBlbmFibGVkID8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMubXVzZXVtU2Nyb2xsQ2FsbGJhY2spIDogd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMubXVzZXVtU2Nyb2xsQ2FsbGJhY2spXG4gICAgfVxuXG4gICAgYnV0dG9uTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLnJlc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLnJlc3RhcnRDb21wb3NpdGlvbigpKVxuICAgICAgICB0aGlzLmJhY2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmRlbGV0ZUxhc3RXb3JkKCkpXG4gICAgICAgIHRoaXMuc2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMudG9nZ2xlU2F2ZURpYWxvZ3VlKCkpXG4gICAgICAgIHRoaXMuc2hhcmVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLnRvZ2dsZVNoYXJlQnV0dG9ucygpKVxuICAgICAgICB0aGlzLmZiQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5zaGFyZVRvRkIoKSlcbiAgICAgICAgdGhpcy50d2l0dGVyQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5zaGFyZVRvVHdpdHRlcigpKVxuICAgICAgICB0aGlzLmRiU2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuc2F2ZVBvZW0oKSlcbiAgICB9XG5cbi8qIE5BVklHQVRJT04gLy0tLS0tLS0gKi9cblxuICAgIGNsaWNrTmF2SXRlbShlKSB7XG4gICAgICAgIGNvbnN0IHBhZ2VTZWxlY3Rpb24gPSBlLmN1cnJlbnRUYXJnZXQuZGF0YXNldC5wYWdlXG4gICAgICAgIGNvbnN0IG5leHRQYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGFnZVNlbGVjdGlvbilcblxuICAgICAgICBpZiAobmV4dFBhZ2UgIT09IHRoaXMuYWN0aXZlUGFnZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLm11c2V1bUxvYWRlZCAmJiBuZXh0UGFnZS5pZCA9PT0gJ211c2V1bS1wYWdlJykgdGhpcy5sb2FkTXVzZXVtKClcblxuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZShuZXh0UGFnZSlcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQWN0aXZlTmF2KHBhZ2VTZWxlY3Rpb24pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuYXZpZ2F0ZShuZXh0UGFnZSkge1xuICAgICAgICB0aGlzLmFjdGl2ZVBhZ2UuY2xhc3NMaXN0LmFkZCgnc2xpZGUtb3V0JylcbiAgICAgICAgbmV4dFBhZ2UuY2xhc3NMaXN0LmFkZCgnc2xpZGUtaW4nKVxuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVQYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZS1wYWdlJylcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlUGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZS1vdXQnKVxuICAgICAgICAgICAgbmV4dFBhZ2UuY2xhc3NMaXN0LmFkZCgnYWN0aXZlLXBhZ2UnKVxuICAgICAgICAgICAgbmV4dFBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGUtaW4nKVxuXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVBhZ2UgPSBuZXh0UGFnZVxuICAgICAgICB9LCAzMDApICAgICAvLyAzMDBtcyA9IHNsaWRpbmcgdHJhbnNpdGlvbiBzcGVlZFxuICAgIH1cblxuICAgIHVwZGF0ZUFjdGl2ZU5hdihwYWdlU2VsZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IG5leHROYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wYWdlPScgKyBwYWdlU2VsZWN0aW9uKVxuXG4gICAgICAgIHRoaXMuYWN0aXZlTmF2LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZS1uYXYtaXRlbScpXG4gICAgICAgIG5leHROYXYuY2xhc3NMaXN0LmFkZCgnYWN0aXZlLW5hdi1pdGVtJylcblxuICAgICAgICB0aGlzLmFjdGl2ZU5hdiA9IG5leHROYXZcbiAgICB9XG5cbi8qIElOUFVUIC8tLS0tLS0tICovXG5cbiAgICB0eXBlKGUpIHtcbiAgICAgICAgbGV0IHdvcmRcblxuICAgICAgICB3b3JkID0gZS50YXJnZXQudmFsdWVcbiAgICAgICAgd29yZCA9IHdvcmQuc3BsaXQoJyAnKVswXVxuICAgICAgICB3b3JkID0gd29yZC50cmltKCkudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgIHRoaXMuY29tcG9zaXRpb24uaW5uZXJUZXh0ID0gd29yZFxuXG4gICAgICAgIHRoaXMuc2hvd1N0YXJ0KCEhd29yZC5sZW5ndGgpXG4gICAgfVxuXG4gICAgc2hvd1N0YXJ0KHNob3cpIHtcbiAgICAgICAgc2hvdyA/IHRoaXMuc3RhcnRCdG4uY2xhc3NMaXN0LmFkZCgnc3RhcnQtYnRuJykgOiB0aGlzLnN0YXJ0QnRuLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YXJ0LWJ0bicpXG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuc2hvd1N0YXJ0KGZhbHNlKVxuICAgICAgICB0aGlzLnN0YXJ0TGlzdGVuZXIoZmFsc2UpXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uTGlzdGVuZXIodHJ1ZSlcbiAgICAgICAgdGhpcy5kaXNhYmxlSW5wdXQoKVxuICAgICAgICB0aGlzLnJlYWRJbnB1dCgpXG4gICAgfVxuXG4gICAgcmVhZElucHV0KCkge1xuICAgICAgICBjb25zdCB3b3JkID0gdGhpcy5jb21wb3NpdGlvbi5pbm5lclRleHRcblxuICAgICAgICB0aGlzLnNob3dTdWdnZXN0aW9ucyh3b3JkKVxuICAgICAgICB0aGlzLnRvZ2dsZUJ1dHRvbnNTdGF0ZSh0cnVlKVxuICAgIH1cblxuICAgIGRpc2FibGVJbnB1dCgpIHtcbiAgICAgICAgdGhpcy5pbnB1dC5kaXNhYmxlZCA9IHRydWVcbiAgICAgICAgdGhpcy5maXJzdFdvcmQgPSBmYWxzZVxuICAgIH1cblxuICAgIGVuYWJsZUlucHV0KCkge1xuICAgICAgICB0aGlzLmlucHV0LmRpc2FibGVkID0gZmFsc2VcbiAgICAgICAgdGhpcy5pbnB1dC52YWx1ZSA9ICcnXG4gICAgICAgIHRoaXMuaW5wdXQuZm9jdXMoKVxuXG4gICAgICAgIHRoaXMuZmlyc3RXb3JkID0gdHJ1ZVxuICAgIH1cblxuLyogQ09NUE9TSVRJT04gLy0tLS0tLS0gKi9cblxuICAgIHVwZGF0ZUNvbXBvc2l0aW9uKGUpIHtcbiAgICAgICAgY29uc3Qgd29yZCA9IGUudGFyZ2V0LmlubmVyVGV4dFxuXG4gICAgICAgIGlmICh3b3JkKSB7XG4gICAgICAgICAgICB0aGlzLmFkZE5leHRXb3JkKHdvcmQpXG4gICAgICAgICAgICB0aGlzLnNob3dTdWdnZXN0aW9ucyh3b3JkKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkTmV4dFdvcmQod29yZCkge1xuICAgICAgICB0aGlzLmNvbXBvc2l0aW9uLmlubmVyVGV4dCArPSAnICcgKyB3b3JkXG4gICAgfVxuXG4gICAgZGVsZXRlTGFzdFdvcmQoKSB7XG4gICAgICAgIGNvbnN0IHdvcmRzID0gdGhpcy5jb21wb3NpdGlvbi5pbm5lclRleHQuc3BsaXQoJyAnKVxuXG4gICAgICAgIHdvcmRzLnBvcCgpXG5cbiAgICAgICAgaWYgKHdvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5jb21wb3NpdGlvbi5pbm5lclRleHQgPSB3b3Jkcy5qb2luKCcgJylcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFN1Z2dlc3Rpb25zKClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVzdGFydENvbXBvc2l0aW9uKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldExhc3RXb3JkKCkge1xuICAgICAgICBjb25zdCB3b3JkcyA9IHRoaXMuY29tcG9zaXRpb24uaW5uZXJUZXh0LnNwbGl0KCcgJylcbiAgICAgICAgY29uc3QgbGFzdElkeCA9IHdvcmRzLmxlbmd0aCAtIDFcblxuICAgICAgICByZXR1cm4gd29yZHNbbGFzdElkeF1cbiAgICB9XG5cbiAgICByZXN0YXJ0Q29tcG9zaXRpb24oKSB7XG4gICAgICAgIHRoaXMuY29tcG9zaXRpb24uaW5uZXJUZXh0ID0gJydcblxuICAgICAgICB0aGlzLmVuYWJsZUlucHV0KClcbiAgICAgICAgdGhpcy5jbGVhclN1Z2dlc3Rpb25zKClcbiAgICAgICAgdGhpcy50b2dnbGVCdXR0b25zU3RhdGUoZmFsc2UpXG4gICAgICAgIHRoaXMuc3RhcnRMaXN0ZW5lcih0cnVlKVxuICAgIH1cblxuLyogU1VHR0VTVElPTlMgLy0tLS0tLS0gKi9cblxuICAgIHNob3dTdWdnZXN0aW9ucyh3b3JkKSB7XG4gICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25zID0gdGhpcy5nZXRTdWdnZXN0aW9ucyh3b3JkKVxuICAgICAgICB0aGlzLnJldHVyblN1Z2dlc3Rpb25zKHN1Z2dlc3Rpb25zKVxuICAgIH1cblxuICAgIGdldFN1Z2dlc3Rpb25zKHdvcmQpIHtcbiAgICAgICAgY29uc3QgcG9zc2liaWxpdGllcyA9IHRoaXMuZGljdGlvbmFyeVt3b3JkXVxuICAgICAgICBjb25zdCB1bmlxdWVQb3NzaWJpbGl0aWVzID0gdGhpcy5tYWtlVW5pcXVlKHBvc3NpYmlsaXRpZXMpXG4gICAgICAgIFxuICAgICAgICBsZXQgc3VnZ2VzdGlvbnMgPSBbXVxuXG4gICAgICAgIGlmICh1bmlxdWVQb3NzaWJpbGl0aWVzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRzTmVlZGVkID0gMyAtIHVuaXF1ZVBvc3NpYmlsaXRpZXMubGVuZ3RoXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHRoaXMuZ2V0RGVmYXVsdHMoZGVmYXVsdHNOZWVkZWQpXG4gICAgICAgICAgICBzdWdnZXN0aW9ucyA9IFsuLi51bmlxdWVQb3NzaWJpbGl0aWVzLCAuLi5kZWZhdWx0c11cbiAgICAgICAgfSBlbHNlIGlmICh1bmlxdWVQb3NzaWJpbGl0aWVzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgc3VnZ2VzdGlvbnMgPSB1bmlxdWVQb3NzaWJpbGl0aWVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aGlsZSAoc3VnZ2VzdGlvbnMubGVuZ3RoIDwgMykge1xuICAgICAgICAgICAgICAgIGxldCBzdWdnZXN0aW9uID0gdGhpcy5nZXRSYW5kb21FbChwb3NzaWJpbGl0aWVzKVxuICAgICAgICAgICAgICAgIGlmICghc3VnZ2VzdGlvbnMuaW5jbHVkZXMoc3VnZ2VzdGlvbikpIHN1Z2dlc3Rpb25zLnB1c2goc3VnZ2VzdGlvbilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdWdnZXN0aW9uc1xuICAgIH1cblxuICAgIGdldERlZmF1bHRzKGRlZmF1bHRzTmVlZGVkKSB7XG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0gdGhpcy5nZXRTdWdnZXN0aW9ucygndGhlJylcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRzLnNsaWNlKDAsIGRlZmF1bHRzTmVlZGVkKVxuICAgIH1cblxuICAgIHJldHVyblN1Z2dlc3Rpb25zKHN1Z2dlc3Rpb25zKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gMzsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uRWxzW2ldLmlubmVyVGV4dCA9IHN1Z2dlc3Rpb25zW2ldXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWZyZXNoU3VnZ2VzdGlvbnMoKSB7XG4gICAgICAgIGNvbnN0IGxhc3RXb3JkID0gdGhpcy5nZXRMYXN0V29yZCgpXG4gICAgICAgIHRoaXMuc2hvd1N1Z2dlc3Rpb25zKGxhc3RXb3JkKVxuICAgIH1cblxuICAgIGNsZWFyU3VnZ2VzdGlvbnMoKSB7XG4gICAgICAgIFsuLi50aGlzLnN1Z2dlc3Rpb25FbHNdLmZvckVhY2goKHN1Z2dlc3Rpb24pID0+IHtcbiAgICAgICAgICAgIHN1Z2dlc3Rpb24uaW5uZXJUZXh0ID0gJydcbiAgICAgICAgfSlcbiAgICB9XG5cbi8qIE1VU0VVTSAvLS0tLS0tLSAqL1xuICAgIFxuICAgIGxvYWRNdXNldW0oKSB7XG4gICAgICAgIGlmICghdGhpcy5kYkluaXRpYWxpemVkKSB0aGlzLmluaXRpYWxpemVGaXJlYmFzZSgpXG4gICAgICAgIHRoaXMuZmV0Y2hQb2Vtcyh0cnVlKVxuICAgICAgICB0aGlzLnNjcm9sbExpc3RlbmVyKHRydWUpXG5cbiAgICAgICAgdGhpcy5tdXNldW1Mb2FkZWQgPSB0cnVlXG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZUZpcmViYXNlKCkge1xuICAgICAgICB0aGlzLmRiID0gZmlyZWJhc2UuZGF0YWJhc2UoKVxuICAgICAgICB0aGlzLnBvZW1zREIgPSB0aGlzLmRiLnJlZigncG9lbXMnKVxuXG4gICAgICAgIHRoaXMuZGJJbml0aWFsaXplZCA9IHRydWVcbiAgICB9XG5cbiAgICBmZXRjaFBvZW1zKGZpcnN0UGFnZSkge1xuICAgICAgICBjb25zdCBxdWVyeSA9IGZpcnN0UGFnZSA/IHRoaXMucG9lbXNEQiA6IHRoaXMucG9lbXNEQi5vcmRlckJ5S2V5KCkuZW5kQXQodGhpcy5sYXN0UG9lbSlcblxuICAgICAgICBxdWVyeS5saW1pdFRvTGFzdCh0aGlzLnBvZW1zUGVyUGFnZSArIDEpLm9uKCd2YWx1ZScsIChzbmFwc2hvdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUG9lbXMoc25hcHNob3QudmFsKCksIGZpcnN0UGFnZSlcbiAgICAgICAgfSwgKGVycm9yT2JqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVGhlIHJlYWQgZmFpbGVkOiAnLCBlcnJvck9iamVjdClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBwcm9jZXNzUG9lbXMoZGF0YSkge1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZGF0YSlcbiAgICAgICAgY29uc3Qgbm9Nb3JlUG9lbXMgPSBrZXlzLmxlbmd0aCA8IHRoaXMucG9lbXNQZXJQYWdlXG4gICAgICAgIGNvbnN0IHBvZW1zID0gbm9Nb3JlUG9lbXMgPyBPYmplY3QudmFsdWVzKGRhdGEpIDogT2JqZWN0LnZhbHVlcyhkYXRhKS5zbGljZSgxKVxuICAgICAgICBcbiAgICAgICAgaWYgKG5vTW9yZVBvZW1zKSB0aGlzLnNjcm9sbExpc3RlbmVyKGZhbHNlKVxuICAgICAgICB0aGlzLmxhc3RQb2VtID0ga2V5c1swXVxuXG4gICAgICAgIHRoaXMuZGlzcGxheVBvZW1zKHBvZW1zKVxuICAgIH1cblxuICAgIGRpc3BsYXlQb2Vtcyhwb2Vtcykge1xuICAgICAgICBwb2VtcyA9IHBvZW1zLnJldmVyc2UoKVxuICAgICAgICBwb2Vtcy5mb3JFYWNoKChwb2VtKSA9PiB0aGlzLmRpc3BsYXlQb2VtKHBvZW0pKVxuICAgIH1cblxuICAgIGRpc3BsYXlQb2VtKHBvZW0pIHtcbiAgICAgICAgY29uc3QgaHRtbCA9IGBcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtdXNldW0tZW50cnlcIj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInBvZW0tdGV4dFwiPiR7cG9lbS5wb2VtfTwvcD5cbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInBvZW0tY29tcG9zZXJcIj4ke3BvZW0udXNlcn08L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYFxuICAgICAgICB0aGlzLm11c2V1bUVudHJpZXMuaW5uZXJIVE1MICs9IGh0bWxcbiAgICB9XG5cbiAgICBtdXNldW1Mb2FkTW9yZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlUGFnZS5pZCA9PT0gJ211c2V1bS1wYWdlJykge1xuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2VGcm9tQm90dG9tID0gdGhpcy5tdXNldW1FbnRyaWVzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSAtIHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICAgICAgaWYgKGRpc3RhbmNlRnJvbUJvdHRvbSA8PSB3aW5kb3cuaW5uZXJIZWlnaHQpIHRoaXMuZmV0Y2hQb2VtcygpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlUG9lbSgpIHtcbiAgICAgICAgY29uc3QgcG9lbSA9IHRoaXMuY29tcG9zaXRpb24uaW5uZXJUZXh0XG4gICAgICAgIGNvbnN0IHBlbm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGVubmFtZScpLnZhbHVlXG5cbiAgICAgICAgaWYgKCF0aGlzLmRiSW5pdGlhbGl6ZWQpIHRoaXMuaW5pdGlhbGl6ZUZpcmViYXNlKClcbiAgICAgICAgdGhpcy5zYXZlUG9lbVRvREIocG9lbSwgcGVubmFtZSlcblxuICAgICAgICB0aGlzLnRvZ2dsZVNhdmVEaWFsb2d1ZSgpXG4gICAgfVxuXG4gICAgc2F2ZVBvZW1Ub0RCKHBvZW0sIHVzZXIpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5wb2Vtc0RCLnB1c2goKS5rZXlcbiAgICAgICAgY29uc3QgZGF0YSA9IHt9XG5cbiAgICAgICAgZGF0YVtrZXldID0ge1xuICAgICAgICAgICAgcG9lbTogcG9lbSxcbiAgICAgICAgICAgIHVzZXI6IHVzZXJcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucG9lbXNEQi51cGRhdGUoZGF0YSlcbiAgICB9XG5cbi8qIFVJIFNUQVRFUyAvLS0tLS0tLSAqL1xuXG4gICAgdG9nZ2xlQnV0dG9uc1N0YXRlKGVuYWJsZWRTdGF0ZSkge1xuICAgICAgICBbdGhpcy5yZXN0YXJ0QnRuLCB0aGlzLmJhY2tCdG4sIHRoaXMuc2F2ZUJ0biwgdGhpcy5zaGFyZUJ0bl0uZm9yRWFjaCgoYnRuKSA9PiB7XG4gICAgICAgICAgICBlbmFibGVkU3RhdGUgPyBidG4uY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKSA6IGJ0bi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdG9nZ2xlU2F2ZURpYWxvZ3VlKCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2RpYWxvZ3VlLW9wZW4nKVxuICAgIH1cbiAgICBcbiAgICB0b2dnbGVTaGFyZUJ1dHRvbnMoKSB7XG4gICAgICAgIHRoaXMuc2hhcmVCdG5zLmNsYXNzTGlzdC50b2dnbGUoJ2V4cGFuZGVkJylcbiAgICB9XG5cbiAgICBjbGVhckRlZmF1bHRUZXh0KCkge1xuICAgICAgICBpZiAodGhpcy5pbnB1dC52YWx1ZSA9PSAnJykge1xuICAgICAgICAgICAgdGhpcy5jb21wb3NpdGlvbi5pbm5lclRleHQgPSAnJ1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVwbGFjZURlZmF1bHRUZXh0KGUpIHtcbiAgICAgICAgaWYgKGUudGFyZ2V0LmlkICE9PSAnaW5pdGlhbC1pbnB1dCcgJiYgdGhpcy5pbnB1dC52YWx1ZSA9PSAnJykge1xuICAgICAgICAgICAgdGhpcy5jb21wb3NpdGlvbi5pbm5lclRleHQgPSB0aGlzLmRlZmF1bHRUZXh0XG4gICAgICAgIH1cbiAgICB9XG5cbi8qIFNIQVJJTkcgLy0tLS0tLS0gKi9cblxuICAgIHNoYXJlVG9GQigpIHtcbiAgICAgICAgY29uc3QgZW5jb2RlZFBvZW0gPSBlbmNvZGVVUkkodGhpcy5jb21wb3NpdGlvbi5pbm5lclRleHQpXG4gICAgICAgIHdpbmRvdy5vcGVuKGBodHRwczovL3d3dy5mYWNlYm9vay5jb20vZGlhbG9nL3NoYXJlP2FwcF9pZD0zNDQxNDU5MDY0MzAwNTUmZGlzcGxheT1wb3B1cCZocmVmPWh0dHBzJTNBJTJGJTJGbXVzZW1hY2hpbmEuY29tJnF1b3RlPSR7ZW5jb2RlZFBvZW19YCwgJ19ibGFuaycpXG5cbiAgICAgICAgdGhpcy50b2dnbGVTaGFyZUJ1dHRvbnMoKVxuICAgIH1cbiAgICBcbiAgICBzaGFyZVRvVHdpdHRlcigpIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGBcIiR7dGhpcy5jb21wb3NpdGlvbi5pbm5lclRleHR9XCIgfCBjb21wb3NpbmcgY29tcHV0ZXIgcG9ldHJ5IGF0IGh0dHBzOi8vbXVzZW1hY2hpbmEuY29tYFxuICAgICAgICBjb25zdCBlbmNvZGVkID0gZW5jb2RlVVJJKHRleHQpXG4gICAgICAgIHdpbmRvdy5vcGVuKGBodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD90ZXh0PSR7ZW5jb2RlZH1gLCAnX2JsYW5rJylcblxuICAgICAgICB0aGlzLnRvZ2dsZVNoYXJlQnV0dG9ucygpXG4gICAgfVxuXG4vKiBVVElMUyAvLS0tLS0tLSAqL1xuXG4gICAgbWFrZVVuaXF1ZShhcnJheSkge1xuICAgICAgICByZXR1cm4gWy4uLm5ldyBTZXQoYXJyYXkpXVxuICAgIH1cblxuICAgIGdldFJhbmRvbUVsKGFycmF5KSB7XG4gICAgICAgIHJldHVybiBhcnJheVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnJheS5sZW5ndGgpXVxuICAgIH1cbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgIE11c2VNYWNoaW5hID0gbmV3IEFwcCgpXG59KSJdfQ==
