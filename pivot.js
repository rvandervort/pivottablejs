var exports = module.exports = {};

var Cell = function Cell(key) {
  this.key = key;
  this.value = 0;
};

exports.PivotTable = function PivotTable(data, options) {
  var aggregators = {
    'count': function(currentCell, rowValue) { return currentCell.value + 1; },
    'sum': function(currentCell, rowValue) { return currentCell.value + rowValue; }
  }

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

    cell.value = this.aggregator(cell, this.getCellValue(row));
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

  for (var i = 0, j = this.rowFields.length; i < j; i++)
    keys.push(row[this.rowFields[i].toString()]);

  for (var i = 0, j = this.columnFields.length; i < j; i++)
    keys.push(row[this.columnFields[i].toString()]);

  return keys.join("\0");
}
