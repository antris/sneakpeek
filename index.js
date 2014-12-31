(function() {
  var root = this;

  var sneakpeek = function() {
    return 'foo';
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = sneakpeek;
    }
    exports.sneakpeek = sneakpeek;
  } else {
    root.sneakpeek = sneakpeek;
  }
}).call(this)