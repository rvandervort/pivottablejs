var exports = module.exports = {
  'count': {
      accumulator: function(currentCell, rowValue) { currentCell.value++; },
      emitter: function(cell) { return cell.value; }
   },
  'sum': {
    accumulator: function(currentCell, rowValue) { currentCell.value += rowValue; },
    emitter: function(cell) { return cell.value; }
  }
};
