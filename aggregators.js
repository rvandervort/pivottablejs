var exports = module.exports = {

  'count': {
      accumulator: function(currentCell, rowValue) {
                      currentCell.value++;
                   },

      emitter: function(cell) {
                 return cell.value;
               }
   },

  'sum': {
    accumulator: function(currentCell, rowValue) {
                  currentCell.value += rowValue;
                 },

    emitter: function(cell) {
                return cell.value;
             }
  },

  'average': {
    accumulator: function(currentCell, rowValue) {
       if (typeof currentCell.sum == 'undefined')
         currentCell.sum = 0;

       currentCell.sum += rowValue;

       if (typeof currentCell.count == 'undefined')
         currentCell.count = 0;

       currentCell.count++;
    },
    emitter: function(cell) {
               return cell.sum / cell.count;
             }
  }
};
