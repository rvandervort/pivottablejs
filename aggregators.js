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
    accumulate: function(rowValue) {
       if (typeof this.sum == 'undefined')
         this.sum = 0;

       this.sum += rowValue;

       if (typeof this.count == 'undefined')
         this.count = 0;

       this.count++;
    },
    emit: function() {
               return this.sum / this.count;
             }
  },

  'list': {
     accumulate: function(rowValue) {
                    if (typeof this.valueList == 'undefined')
                      this.valueList = [];

                    this.valueList.push(rowValue);
                  },

     emit: function() { return this.valueList; }

  }

};
