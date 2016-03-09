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
  this.summary = {};

  this.aggregator = options.aggregator || aggregators['count'];

  if (!this.validAggregator())
    throw new Error("Aggregator must be an object with accumulator and emitter methods");

  utils.extend(this.Cell.prototype, this.aggregator);

  var valueField = this.valueField;

  for (var i = 0, j = this.inputData.length; i < j; i++) {
    var row = this.inputData[i];
    var keys = this.getCellKeys(row);

    // Accumulate Individual Cell
    var cell = this.getCell(row, keys);

    cell.accumulate(row[valueField]);

    this.accumulate_summary(keys.column, row[valueField]);

    this.accumulate_summary(keys.row, row[valueField]);
  }
}

exports.PivotTable.prototype.accumulate_summary = function(key, value)  {
  if (typeof this.summary[key] == 'undefined')
    this.summary[key] = new this.Cell(key);

  this.summary[key].accumulate(value);
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
