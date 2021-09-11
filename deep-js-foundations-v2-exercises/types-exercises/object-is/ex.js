const test = (x, y) => {
  const isItNaN = (x) => {
    return x !== x;
  };

  const isItNegativeZero = (x) => {
    return x === 0 && 1 / x === -Infinity;
  };

  const negZeroX = isItNegativeZero(x);
  const negZeroY = isItNegativeZero(y);

  if (negZeroX || negZeroY) {
    return negZeroX && negZeroY;
  } else if (isItNaN(x) && isItNaN(y)) {
    return true;
  } else {
    return x === y;
  }
};

// tests:
console.log(test(42, 42) === true);
console.log(test("foo", "foo") === true);
console.log(test(false, false) === true);
console.log(test(null, null) === true);
console.log(test(undefined, undefined) === true);
console.log(test(NaN, NaN) === true);
console.log(test(-0, -0) === true);
console.log(test(0, 0) === true);

console.log(test(-0, 0) === false);
console.log(test(0, -0) === false);
console.log(test(0, NaN) === false);
console.log(test(NaN, 0) === false);
console.log(test(42, "42") === false);
console.log(test("42", 42) === false);
console.log(test("foo", "bar") === false);
console.log(test(false, true) === false);
console.log(test(null, undefined) === false);
console.log(test(undefined, null) === false);
