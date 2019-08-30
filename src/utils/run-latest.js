/* 
`runLatest` takes a generator that yields promises,
and returns an async function that restarts from the beginning every time it is called.
This is for when you have 

*/

export default function runLatest(fn) {
  const state = {
    currentGenerator: null,
  };
  return async (...args) => {
    // if there is already a running generator instance, 
    // create a new instance and replace the old one.
    //     
    if (state.currentGenerator) {
      state.currentGenerator = fn(...args);
      return
    }
    
    state.currentGenerator = fn(...args);
  

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