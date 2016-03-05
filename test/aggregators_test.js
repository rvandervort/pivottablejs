var expect = require('chai').expect;
var utils = require('../utils');
var aggregators = require('../aggregators');

describe('Aggregators', function() {
  describe('#count', function() {
    it('emits the value incremented by 1', function() {
      var cell = {value: 0};
      var rowValue = 2;

      utils.extend(cell, aggregators.count);

      cell.accumulate(1);
      expect(cell.emit()).to.equal(1);
    });

  });


  describe('#sum', function() {
    it('adds the current row value to the cell value', function() {
      var cell = {value: 37};

      utils.extend(cell, aggregators.sum);

      cell.accumulate(1300);
      expect(cell.emit()).to.equal(1337);
    });
  });

  describe('#average', function() {
    it('emits the average of supplied values', function() {
      var cell = {value: 0};

      utils.extend(cell, aggregators.average);

      [1, 3, 5, 11].forEach(function(value) {
        cell.accumulate(value);
      });

      expect(cell.emit()).to.equal(5);
    });
  });


  describe('#list', function() {
    it('emits a list of values for the key', function() {
      var cell = {value: 0};
      var rowValues = ["John", "Bob", "Jeff"]

      var f = aggregators['list'];

      utils.extend(cell, aggregators.list);

      rowValues.forEach(function(value) {
        cell.accumulate(value);
      });

      // eql does deep value compare
      expect(cell.emit()).to.eql(["John", "Bob", "Jeff"]);
    });
  });
});
