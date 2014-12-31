(function() {
  var root = this;
  var absolute = Math.abs;

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

  var getScrollPos = function() {
    var scrollTop = (pageYOffset !== undefined) ? pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
    return (scrollTop < 0 ? 0 : scrollTop)
  }
  var inBrowser = typeof window !== "undefined"

  var scrollDelta = function(previousState, y) {
    var diff = y - previousState.y
    var newDelta = absolute(previousState.d) < absolute(previousState.d + diff) ? previousState.d + diff : diff
    var newState = {
      d: newDelta,
      y: y
    }
    return newState
  }

  var sneakpeek = function(elem, options) {
    if (!inBrowser) { return elem }
    options = options || {}
    var hiddenClass = options.hiddenClass || 'sneakpeek--hidden'
    var scrollState = {
      y: getScrollPos(),
      d: 0
    }
    addEventListener('scroll', throttle(function() {
      scrollState = scrollDelta(scrollState, getScrollPos())
      if (scrollState.d > 120) {
        elem.classList.add(hiddenClass)
      }
      if (scrollState.d < -120) {
        elem.classList.remove(hiddenClass)
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