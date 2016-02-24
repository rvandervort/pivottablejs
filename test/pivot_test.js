var expect = require('chai').expect;
var pivot = require('../pivot');
var aggregators = require('../aggregators');

describe('PivotTable', function() {

  var populationPivotOptions = {
    aggregator: 'count',
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


  describe('#constructor', function() {
    it("raises an error if the provided aggregator is not a function", function() {
      var options = {
        aggregator: 'not_a_function',
        rows: ['country'],
        columns: ['year'],
        valueField: 'population'
      };

      expect(function() { var myPivot = new pivot.PivotTable([], options); }).to.throw(/Aggregator/);
    });
  });

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

      expect(cellCount).to.equal(2);
    });
  });
});
