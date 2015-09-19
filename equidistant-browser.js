/********************************************************************************
 * Write a function which, 
 * 1. takes in an array of integers
 * 2. sorts given integers, such that any member of an identical pair of numbers,
 *    a. is seperated from its pair by the same number of digits as its value
 *        i. e.g. given [1, 2, 1]
 *           the difference of the indices equals the sum of the members of the pair
 *           or, 2(third item in array) - 0(first item in array) - 1 = 1
 * 3. can identify invalid array inputs and return -1 (not an array containing -1)
 *    a. unpaired integers in the array
 *    b. arrays containing odd numbers of items
 *    c. arrays containing non-numerical items
 ** NOTE **
*********************************************************************************
 * YOUR CODE BELOW
********************************************************************************/
function sort(array) {
  if (!Array.isArray(array)) return -1;

  if (array.length % 2) return -1;

  // obviously I'm not too concerned about efficiency 
  if (array.filter(function(value) {
    return isNaN(value);
  }).length) {
    return -1;
  }

  var pairedNumbers = [],
      arrayGenerator = function(number) {
        if (typeof number === 'number') {
          var buffer = new Array(parseInt(number));

          for (var i = 0; i < buffer.length; i++) {
            // Array.indexOf(undefined) returns -1
            // Array.indexOf(null) finds the first null item
            buffer[i] = null;
          }

          return buffer;
        }
      };
  
  var unpairedNumbers = array.filter(function(x) {
    var equivalentNumbers = array.filter(function(y) {
      return x === y;
    });

    if (equivalentNumbers.length == 2) {
      var memberOfPair = equivalentNumbers[0];
      if (pairedNumbers.indexOf(memberOfPair) < 0) {
        pairedNumbers.push(memberOfPair);
      }
    }
    
    return equivalentNumbers.length != 2;
  });

  if (unpairedNumbers.length) return -1;

  // every item beyond the bounds of
  // count of paired numbers should be null
  var outOfBounds = function(testArray) {
    return testArray
      .slice(pairedNumbers.length * 2)
      .some(function(currentValue) {
        return currentValue !== null;
      });
  };

  var overlay = function(buffer, indices, value) {
    if (Array.isArray(buffer)) {
      var output = buffer.slice();
      for (var i in indices) {
        output[indices[i]] = value;
      }
      return output;
    }
  };

  var forceOverlay = function(buffer, indices, value) {
    if (Array.isArray(buffer)) {
      var output = { buffer: buffer.slice(), removedNumbers: [] };
      for (var i in indices) {
        var removedNumber = buffer[indices[i]];

        if (removedNumber !== null) {
          output.removedNumbers.push(removedNumber);
        }

        output.buffer[indices[i]] = value;
      }

      // set other half of overwritten pair to null
      output.removedNumbers.forEach(function(currentValue) {
        output.buffer[output.buffer.indexOf(currentValue)] = null;
      });
      return output;
    }
  };

  var shiftLeft = function(buffer) {
    if (Array.isArray(buffer)) {
      var output = buffer.slice();
      for (var i = 0; i < output.length; i++) {
        if (output[0] === null) {
          output.push(output.shift()); // push onto tail whatever is taken from head
        } else {
          break;
        }
      }
      return output;
    }
  }

  var canOverlayWithoutDataLoss = function(buffer, indicesToOverwrite) {
    var nonNull = function(currentValue) {
      return currentValue !== null;
    };

    var indexOf = function(currentArray) {
      return function(previousValue, currentValue, index) {
        var output;
        if (Array.isArray(previousValue)) {
          output = previousValue;
        } else {
          output = [];
        }
        output.push(currentArray.indexOf(currentValue, output[output.length - 1] + 1));
        return output;
      };
    };

    var indicesOfBufferValues = buffer
      .filter(nonNull)
      .reduce(indexOf(buffer), []);
    
    var duplicateIndices =
      indicesOfBufferValues
        .concat(indicesToOverwrite)
        .filter(function(currentValue, index, currentArray) {
          return currentArray.filter(function(otherValue) {
            return currentValue === otherValue;
          }).length > 1;
        });

    return duplicateIndices.length == 0;
  };

  var reducer = function(state, pairedNumber) {
    console.log('current paired number: ' + pairedNumber);

    var buffer = state.buffer,
        startingIndex = state.hasOwnProperty("startingIndex") ?
        state.startingIndex : buffer.indexOf(null),
        endingIndex = startingIndex + pairedNumber + 1,
        recursionCounter = state.recursionCounter + 1,
        recursionLimit = state.recursionLimit,
        output;

    console.log('current buffer: ' + buffer);

    if (recursionCounter > recursionLimit) {
      return -1;
      console.error('recursion limit exceeded');
    }

    
    if (canOverlayWithoutDataLoss(buffer, [startingIndex, endingIndex])) {
        output = overlay(buffer, [startingIndex, endingIndex], pairedNumber);
    } else {
      // shift right to next null and try again
      startingIndex = buffer.indexOf(null, startingIndex + 1);

      return reducer({
        buffer: buffer,
        recursionCounter: recursionCounter,
        recursionLimit: recursionLimit,
        startingIndex: startingIndex
      },
      pairedNumber);
    }

    if (outOfBounds(output)) {
      var distanceOutOfBounds = output.lastIndexOf(pairedNumber) - (pairedNumbers.length * 2 - 1);
      startingIndex = startingIndex - distanceOutOfBounds;
      endingIndex = endingIndex - distanceOutOfBounds;

      forcedOutput = forceOverlay(buffer, [startingIndex, endingIndex], pairedNumber);

      output = forcedOutput.buffer;
      removedNumbers = forcedOutput.removedNumbers;

      return removedNumbers.reduce(reducer,
      {
        buffer: shiftLeft(output),
        recursionCounter: recursionCounter,
        recursionLimit: recursionLimit
      });
    } else {
      return {
        buffer: output,
        recursionCounter: recursionCounter,
        recursionLimit: recursionLimit
      };
    }
  };  

  pairedNumbers.sort(function(x, y) { return x - y; });

  var initialValue = {
    buffer: arrayGenerator(pairedNumbers.length * 3),
    recursionCounter: 0,
    recursionLimit: 200
  };

  var reduction = pairedNumbers.reduce(reducer,
    initialValue);

  var output = reduction.buffer.slice(0, pairedNumbers.length * 2);
  console.log('sorted "' + array + '" to  "' + output + '"');

  return output;
};
/********************************************************************************
 * ARRAY COMPARER - used by 'assert' to check resulting arrays
********************************************************************************/
function arraysEqual(x, y) {
    // if the other y is a falsy value, return
    if (!y)
        return false;

    // compare lengths - can save a lot of time 
    if (x.length != y.length)
        return false;

    for (var i = 0, l=x.length; i < l; i++) {
        // Check if we have nested arrays
        if (Array.isArray(x[i]) && Array.isArray(y[i])) {
            // recurse into the nested arrays
            if (!x[i].equals(y[i]))
                return false;       
        }           
        else if (x[i] != y[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
/******************************************************************************
 * SUPPLEMENTARY FUNCTIONS TO "HIDE" THE ORIGINAL RIDDLE'S ANSWER
******************************************************************************/

function obfuscateNumber(value) {
  if (typeof value === 'number') {
    return btoa(encodeURIComponent(escape(Number.prototype.toString.call(value, 16))));
  } else {
    console.log(value + ' is not a number, it is a ' + typeof value);
  }
}
function parseObfuscatedNumber(value) {
  if (typeof value === 'string') {
    return parseInt(unescape(decodeURIComponent(atob(value))), 16);
  } else {
    console.log(value + ' is not a string');
  }
}
function parseArrayOfObfuscatedNumbers(array) {
  if (Array.isArray(array) &&
      array.every(function(currentValue) {
        return typeof currentValue === 'string';
      })) {
    return array.map(parseObfuscatedNumber);
  }
}
/********************************************************************************
 * TESTS
********************************************************************************/
console.assert('YQ==' == obfuscateNumber(10));
console.assert(10 == parseObfuscatedNumber('YQ=='));

// real tests
console.assert(-1 == sort('fish'));
console.assert(-1 == sort([1, 1, 2, 2, 3, 3, 4]));

// hard to assert your function is correct without giving away
// the answer to Darren's riddle
console.assert(arraysEqual(parseArrayOfObfuscatedNumbers(['NA==', 'MQ==', 'Mw==', 'MQ==', 'Mg==', 'NA==', 'Mw==', 'Mg==']), sort([1, 1, 2, 2, 3, 3, 4, 4])));

console.assert(arraysEqual([2, 3, 1, 2, 1, 3], sort([1, 1, 2, 2, 3, 3])));

console.log('succeeded!');
