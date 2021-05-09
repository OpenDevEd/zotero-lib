export = function sleep(delayInMilliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, delayInMilliseconds));
};
