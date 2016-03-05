var expect = require('chai').expect;
var utils = require('../utils');

describe('Utilities', function() {
  describe('#extend', function() {
    it('adds the properties of the extension', function() {
      var Person = function(name) {
        this.name = name;
      }

      var mixin = { 'nameLength': function() { return this.name.length; } };

      utils.extend(Person.prototype, mixin);

      var donald = new Person("Donald Trump");
      expect(donald.nameLength()).to.equal(12);
    });
  });
});
