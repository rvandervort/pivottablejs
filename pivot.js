var exports = module.exports = {};

exports.PivotTable = function PivotTable(data, options) {
  var Cell = function Cell(key) {
    this.key = key;
    this.value = 0;
  };

  this.inputData = data;
  this.pivotOptions = options;

  this.aggregator = this.pivotOptions.aggregator;
  this.valueField = this.pivotOptions.valueField;
  this.cells = { };

  this.getCellKey = function(row) {
    var keys = [];
    var rowFields = this.pivotOptions.rows;
    var columnFields = this.pivotOptions.columns;

    for (var i = 0, j = this.pivotOptions.rows.length; i < j; i++)
      keys.push(row[rowFields[i].toString()]);

    for (var i = 0, j = this.pivotOptions.columns.length; i < j; i++)
      keys.push(row[columnFields[i].toString()]);

    return keys.join("\0");
  }

  this.getCell = function(row) {
    var key = this.getCellKey(row);

    if (typeof this.cells[key] == 'undefined')
      this.cells[key] = new Cell(key);

    return this.cells[key];
  }

  this.getCellValue = function(row) {
    return row[this.valueField];
  }

  this.forEachCell = function(func) {
    for (key in this.cells)
      if (this.cells.hasOwnProperty(key))
        func(this.cells[key]);
  }

  for (var i = 0, j = this.inputData.length; i < j; i++) {
    var row = this.inputData[i];
    var cell = this.getCell(row);

    cell.value = this.aggregator(cell, this.getCellValue(row));
  }
}
