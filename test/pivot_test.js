var expect = require('chai').expect;
var pivot = require('../pivot');
var aggregators = require('../aggregators');

describe('PivotTable', function() {


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

  describe('#getKeyValue', function() {
    var options = {
      aggregator: 'count',
      rows: ['country'],
      columns: ['year'],
      valueField: 'population'
    };

    var myPivot = new pivot.PivotTable([], options); 
    var row =  {name: 'Coraline', age: 9};

    it("for a string key, returns that field from the data row", function() {
      expect(myPivot.getKeyValue('name', row)).to.equal('Coraline');
    });

    it("for a function string, calls and returns the value from the function", function() {
      var fieldDef = function(row) {
        return row['age'] * 2;
      }

      expect(myPivot.getKeyValue(fieldDef, row)).to.equal(18);
    });
  });

  describe('#forEachCell', function() {
    var options = {
      aggregator: 'count',
      rows: ['country'],
      columns: ['year'],
      valueField: 'population'
    };

    var data = [
      {country: "US", year: "2015", population: 100},
      {country: "CA", year: "2015", population: 100}
    ];

    var myPivot = new pivot.PivotTable(data, options);

    it('iterates over each cell', function() {
      var cellCount = 0;

      myPivot.forEachCell(function(cell) {
        cellCount++;
      });

      expect(cellCount).to.equal(2);
    });
  });
});
