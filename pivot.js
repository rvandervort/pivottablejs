var aggregators = require('./aggregators');

var exports = module.exports = {aggregators: aggregators};

var Cell = function Cell(key) {
  this.key = key;
  this.value = 0;
};

exports.PivotTable = function PivotTable(data, options) {
  this.inputData = data || [];
  this.aggregator = options.aggregator || aggregators['count'];
  this.valueField = options.valueField || 'value';
  this.rowFields = options.rows || [];
  this.columnFields = options.columns || [];
  this.cells = { };

  if (!this.validAggregator())
    throw new Error("Aggregator must be an object with accumulator and emitter methods");

  for (var i = 0, j = this.inputData.length; i < j; i++) {
    var row = this.inputData[i];
    var cell = this.getCell(row);

    this.aggregator.accumulator(cell, row[this.valueField]);
  }
}

exports.PivotTable.prototype.validAggregator = function() {
  if (this.aggregator instanceof Object)
    return true;
  else
    if (typeof this.aggregator == 'string') {
      var name = this.aggregator;

      if (!(aggregators[name] instanceof Object)) {
        return false;
      }
      else {
        this.aggregator = aggregators[name];
        return true;
      }
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

exports.PivotTable.prototype.getKeyValue = function(fieldDef, row) {
  if (typeof fieldDef == 'string')
    return row[fieldDef];

  if (typeof fieldDef === 'function')
    return fieldDef(row);
}

exports.PivotTable.prototype.getCellKey = function(row) {
  var keys = [];
  var i = 0;
  var j = this.rowFields.length;

  for (i = 0; i < j; i++)
    keys.push(this.getKeyValue(this.rowFields[i], row).toString());

  j = this.columnFields.length;
  for (i = 0; i < j; i++)
    keys.push(this.getKeyValue(this.columnFields[i], row).toString());

  return keys.join("\0");
}
