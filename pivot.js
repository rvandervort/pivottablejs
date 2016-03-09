var aggregators = require('./aggregators');
var exports = module.exports = {aggregators: aggregators};
var utils = require('./utils');



exports.PivotTable = function PivotTable(data, options) {
  this.Cell = function Cell(key) {
    this.key = key;
    this.value = 0;
  };

  this.inputData = data || [];

  this.valueField = options.valueField || 'value';
  this.rowFields = options.rows || [];
  this.columnFields = options.columns || [];
  this.cells = {};
  this.rowSummary = {};
  this.columnSummary = {};

  this.aggregator = options.aggregator || aggregators['count'];

  if (!this.validAggregator())
    throw new Error("Aggregator must be an object with accumulator and emitter methods");

  utils.extend(this.Cell.prototype, this.aggregator);

  this.calculate();

}

exports.PivotTable.prototype.calculate = function() {
  var valueField = this.valueField;

  for (var i = 0, j = this.inputData.length; i < j; i++) {
    var row = this.inputData[i];
    var keys = this.getCellKeys(row);

    // Accumulate individual cell
    this.accumulate('cells', keys.cell, row[valueField]);

    // Accumulate summaries
    this.accumulate('rowSummary', keys.row, row[valueField]);
    this.accumulate('columnSummary', keys.column, row[valueField]);

  }
}

exports.PivotTable.prototype.accumulate = function(target, key, value) {
  if (typeof this[target][key] == 'undefined')
    this[target][key] = new this.Cell(key);

  this[target][key].accumulate(value);
}


exports.PivotTable.prototype.validAggregator = function() {
  if (this.aggregator instanceof Object) {
    return ((typeof this.aggregator.emit == 'function') && (typeof this.aggregator.accumulate == 'function'));
  }
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

exports.PivotTable.prototype.getCell = function(row, keys) {
  if (typeof this.cells[keys.cell] == 'undefined')
    this.cells[keys.cell] = new this.Cell(keys.cell);

  return this.cells[keys.cell];
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

exports.PivotTable.prototype.getCellKeys = function(row) {
  var keys = [];
  var i = 0, j = 0;

  var rowKey = [];
  var colKey = [];

  j = this.rowFields.length;
  for (i = 0; i < j; i++)
    rowKey.push(this.getKeyValue(this.rowFields[i], row).toString());

  j = this.columnFields.length;
  for (i = 0; i < j; i++)
    colKey.push(this.getKeyValue(this.columnFields[i], row).toString());

  return { 
    cell: rowKey.concat(colKey).join("\0"),
    column: colKey.join("\0"),
    row: rowKey.join("\0")
  };
}
