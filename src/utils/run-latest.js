/* 
`runLatest` takes a generator that yields promises,
and returns an async function that restarts from the beginning every time it is called.
Example:

const 


*/

export default function runLatest(fn) {
  const state = {
    currentGenerator: null,
  };
  return async (...args) => {
    const isAlreadyRunning = state.currentGenerator;
    state.currentGenerator = fn(...args);
    if (isAlreadyRunning) return;

    let promiseResult = null;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { value, done } = state.currentGenerator.next(promiseResult);
      if (done) {
        state.currentGenerator = null;
        return;
      }
      promiseResult = await value; // eslint-disable-line no-await-in-loop
    }
  };
}