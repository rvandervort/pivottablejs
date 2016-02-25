var expect = require('chai').expect;
var aggregators = require('../aggregators');

describe('Aggregators', function() {

  describe('#count', function() {
    it('emits the value incremented by 1', function() {
      var cell = {value: 0};
      var rowValue = 2;

      var f = aggregators['count'];
      f.accumulator(cell, rowValue);
      expect(f.emitter(cell)).to.equal(1);
    });

  });


  describe('#sum', function() {
    it('adds the current row value to the cell value', function() {
      var cell = {value: 37};
      var rowValue = 1300;

      var f = aggregators['sum'];
      f.accumulator(cell, rowValue);

      expect(f.emitter(cell)).to.equal(1337);
    });
  });

  describe('#average', function() {
    it('emits the average of supplied values', function() {
      var cell = {value: 0};
      var rowValues = [1, 3, 5, 11]

      var f = aggregators['average'];

      rowValues.forEach(function(value) {
        f.accumulator(cell, value);
      });

      expect(f.emitter(cell)).to.equal(5);
    });
  });


  describe('#list', function() {
    it('emits a list of values for the key', function() {
      var cell = {value: 0};
      var rowValues = ["John", "Bob", "Jeff"]

      var f = aggregators['list'];

      rowValues.forEach(function(value) {
        f.accumulator(cell, value);
      });

      // eql does deep value compare
      expect(f.emitter(cell)).to.eql(["John", "Bob", "Jeff"]);
    });
  });
});
