var assert = require('assert');
var pivot = require('../pivot');

describe('PivotTable', function() {
  var simpleCount = function(currentCell, rowValue) {
    return currentCell.value + 1;
  }

  var simpleSum = function(currentCell, rowValue) {
    return currentCell.value += rowValue;
  }

  var populationPivotOptions = {
    aggregator: simpleSum,
    rows: ['country'],
    columns: ['year'],
    valueField: 'population'
  };


  var populationData = [
      {country: "US", year: "2015", population: 100},
      {country: "US", year: "2016", population: 99},
      {country: "CA", year: "2015", population: 300},
      {country: "CA", year: "2016", population: 299},
      {country: "CA", year: "2016", population: 110}
    ];

  describe('#forEachCell', function() {
    var data = [
      {country: "US", year: "2015", population: 100},
      {country: "CA", year: "2015", population: 100}
    ];

    var myPivot = new pivot.PivotTable(data, populationPivotOptions);

    it('iterates over each cell', function() {
      var cellCount = 0;

      myPivot.forEachCell(function(cell) {
        cellCount++;
      });

      assert.equal(cellCount, 2);
    });
  });


});
