module.exports = {
  randomNumber(max) {
    return Math.floor(Math.random() * max);
  },
  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
};
