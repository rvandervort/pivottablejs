var aggregators = require('./aggregators');

var exports = module.exports = {};


var Cell = function Cell(key) {
  this.key = key;
  this.value = 0;
};

exports.PivotTable = function PivotTable(data, options) {

  this.inputData = data || [];
  this.aggregator = options.aggregator || aggregators.count;
  this.valueField = options.valueField || 'value';
  this.rowFields = options.rows || [];
  this.columnFields = options.columns || [];
  this.cells = { };

  if (typeof this.aggregator != 'function')
    if (typeof this.aggregator == 'string') {
      var name = this.aggregator;

      if (typeof aggregators[name] == 'function')
        this.aggregator = aggregators[name];
      else
        throw new Error("Aggregator is not a function!");
    }

  for (var i = 0, j = this.inputData.length; i < j; i++) {
    var row = this.inputData[i];
    var cell = this.getCell(row);

    this.aggregator(cell, row);
  }
}

exports.PivotTable.prototype.getCell = function(row) {
  var key = this.getCellKey(row);

  if (typeof this.cells[key] == 'undefined')
    this.cells[key] = new Cell(key);

  return this.cells[key];
}

exports.PivotTable.prototype.getCellValue = function(row) {
  return row[this.valueField];
}

exports.PivotTable.prototype.forEachCell = function(func) {
  for (key in this.cells)
    if (this.cells.hasOwnProperty(key))
      func(this.cells[key]);
}

exports.PivotTable.prototype.getCellKey = function(row) {
  var keys = [];
  var i = 0;
  var j = this.rowFields.length;

  for (i = 0; i < j; i++)
    keys.push(row[this.rowFields[i].toString()]);

  j = this.columnFields.length;
  for (i = 0; i < j; i++)
    keys.push(row[this.columnFields[i].toString()]);

  return keys.join("\0");
}
