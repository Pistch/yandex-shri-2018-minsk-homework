export const probe = (fn) => {
  let count = 0;

  return function counter(...args) {
    if (args[args.length - 1] === true) {
      return count;
    }

    count++;
    return fn ? fn(...args) : null;
  };
};

export const x = 'x';
