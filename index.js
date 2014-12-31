(function() {
  var root = this;

  var throttle = function(func, wait) {
    var context, args, result
    var timeout = null
    var previous = 0
    var later = function() {
      previous = +new Date
      timeout = null
      result = func.apply(context, args)
      if (!timeout) context = args = null
    }
    return function() {
      var now = +new Date
      if (!previous) previous = now
      var remaining = wait - (now - previous)
      context = this
      args = arguments
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout)
        timeout = null
        previous = now
        result = func.apply(context, args)
        if (!timeout) context = args = null
      } else if (!timeout) {
        timeout = setTimeout(later, remaining)
      }
      return result
    }
  }

  var inBrowser = typeof window !== "undefined"

  var addClass = function(elem, className) { elem.classList.add(className) }
  var removeClass = function(elem, className) { elem.classList.remove(className) }

  var scrollDelta = function(previousState, scrollTop) {
    var diff = scrollTop - previousState.scrollTop
    var delta = Math.abs(previousState.delta) < Math.abs(previousState.delta + diff) ? previousState.delta + diff : diff
    var newState = {
      delta: delta,
      scrollTop: scrollTop
    }
    return newState
  }

  var sneakpeek = function(elem, options) {
    if (!inBrowser) { return elem }
    options = options || {}
    var hiddenClass = options.hiddenClass || 'sneakpeek--hidden'
    var body = document.body
    var scrollState = {
      scrollTop: body.scrollTop,
      delta: 0
    }
    window.addEventListener('scroll', throttle(function() {
      scrollState = scrollDelta(scrollState, body.scrollTop)
      if (scrollState.delta > 120) {
        addClass(elem, hiddenClass)
      }
      if (scrollState.delta < -120) {
        removeClass(elem, hiddenClass)
      }
    }, 100), false)
    return elem
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = sneakpeek;
    }
    exports.sneakpeek = sneakpeek;
  } else {
    root.sneakpeek = sneakpeek;
  }
}).call(this)