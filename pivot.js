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

  this.inputData = data;
  this.pivotOptions = options;

  this.aggregator = this.pivotOptions.aggregator || aggregators.count;

  if (typeof this.aggregator != 'function')
    if (typeof this.aggregator == 'string') {
      var name = this.aggregator;

      if (typeof aggregators[name] == 'function')
        this.aggregator = aggregators[name];
      else
        throw new Error("Aggregator is not a function!");
    }


  this.valueField = this.pivotOptions.valueField;
  this.cells = { };

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
  var rowFields = this.pivotOptions.rows || [];
  var columnFields = this.pivotOptions.columns || [];

  for (var i = 0, j = this.pivotOptions.rows.length; i < j; i++)
    keys.push(row[rowFields[i].toString()]);

  for (var i = 0, j = this.pivotOptions.columns.length; i < j; i++)
    keys.push(row[columnFields[i].toString()]);

  return keys.join("\0");
}


