/* @flow */

(function() {
  declare var pageYOffset: number
  var root: any = this
  var inBrowser = typeof window !== "undefined"
  var WAIT = 100

  var throttle = function(func) {
    var result
    var timeout = null
    var previous = 0
    var later = function() {
      previous = +new Date
      timeout = null
      result = func()
    }
    return function() {
      var now = +new Date
      if (!previous) previous = now
      var remaining = WAIT - (now - previous)
      if (remaining <= 0 || remaining > WAIT) {
        clearTimeout(timeout)
        timeout = null
        previous = now
        result = func()
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

  var scrollDelta = function(previousState, y) {
    var diff = y - previousState.y
    var newDelta = Math.abs(previousState.d) < Math.abs(previousState.d + diff) ? previousState.d + diff : diff
    var newState = {
      d: newDelta,
      y: y
    }
    return newState
  }

  var emitter = (function() {
    var noop = function(){}
    if (!inBrowser) { return {on: noop, off: noop}}
    var listeners = []
    var emit = function(eventType) {
      listeners
        .filter(function(listener){ return listener.t == eventType })
        .forEach(function(listener){ listener.f() })
    }
    var scrollState = {y: 0, d: 0};
    var firstScroll = true;
    var headerIsVisible = true;
    window.addEventListener('scroll', throttle(function() {
      if (firstScroll) {
        firstScroll = false;
        scrollState = {
          y: getScrollPos(),
          d: 0
        }
        return
      }
      scrollState = scrollDelta(scrollState, getScrollPos())
      if (scrollState.d > 120 && headerIsVisible) {
        emit('hide')
        headerIsVisible = false;
      }
      if (scrollState.d < -120 && !headerIsVisible) {
        emit('show')
        headerIsVisible = true;
      }
    }), false)
    return {
      on: function(eventType: string, listener: Function) {
        listeners = listeners.concat([{ t: eventType, f: listener }])
      },
      off: function(eventType: string, listener: Function) {
        listeners = listeners.filter(function(existingListener) {
          return existingListener.f !== listener || existingListener.t !== eventType
        })
      }
    }
  })()

  var sneakpeek: any = function(elem: Object, options: Object) {
    if (!inBrowser) { return elem }
    options = options || {}
    var hiddenClass = options.hiddenClass || 'sneakpeek--hidden'
    emitter.on('hide', function() {
      elem.classList.add(hiddenClass)
    })
    emitter.on('show', function() {
      elem.classList.remove(hiddenClass)
    })
    return elem
  }

  sneakpeek.emitter = emitter

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = sneakpeek;
    }
    exports.sneakpeek = sneakpeek;
  } else {
    root.sneakpeek = sneakpeek;
  }
}).call(this)