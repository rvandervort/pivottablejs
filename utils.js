module.exports = {
  extend: function(base, mixin) {

    for (var method in mixin) {
      if (mixin.hasOwnProperty(method))
        base[method] = mixin[method];
    }
  }
}
