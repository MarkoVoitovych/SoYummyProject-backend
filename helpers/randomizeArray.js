const { randNum } = require('./randNum');

const randomizeArray = (arrayLength, numbersCount) => {
  const uniqArray = new Set();

  while (uniqArray.size <= numbersCount) {
    uniqArray.add(randNum(arrayLength - 1));
    if (uniqArray.size === numbersCount) break;
  }

  return [...uniqArray];
};

module.exports = { randomizeArray };
