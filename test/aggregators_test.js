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
});
