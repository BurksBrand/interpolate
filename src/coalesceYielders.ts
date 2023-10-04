async function *coalesceYielders<T>(functions:((...rest:any)=>Generator<T>)[],rest:any) {
    let yielded = false;
    for (const func of functions) {
      for await(let item of  func(...rest)){
        yielded = true;
        yield item;
      }
      if (yielded) {
        return;
      }
    }
  }
export default coalesceYielders;