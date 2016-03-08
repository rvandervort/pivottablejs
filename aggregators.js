var exports = module.exports = {
  'count': {
      accumulate: function(rowValue) {
                      this.value++;
                   },

      emit: function() {
                 return this.value;
               }
   },

  'sum': {
    accumulate: function(rowValue) {
                  this.value += rowValue;
                 },

    emit: function() {
                return this.value;
             }
  },

  'average': {
    sum: 0,
    count: 0,
    accumulate: function(rowValue) {
       this.sum += rowValue;
       this.count++;
    },
    emit: function() {
               return this.sum / this.count;
             }
  },

  'list': {
     valueList: [],
     accumulate: function(rowValue) {
                    this.valueList.push(rowValue);
                  },

     emit: function() { return this.valueList; }

  }
};
