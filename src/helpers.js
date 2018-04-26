export const probe = () => {
  let count = 0;

  return function counter(returnCount) {
    if (returnCount === true) {
      return count;
    }
    count++;
  };
};

export const x = 'x';
