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
