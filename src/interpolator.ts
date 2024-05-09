import current from './current';

async function* interpolate(
    template:string, 
    interpolationFunction:(s:string, stack:string[])=>AsyncGenerator<string>, 
    startToken:string,
    endToken:string,
    stack:string[]=[]
  ):AsyncGenerator<string> {
//  console.log("Entry to interpolate", template);
  let result = '';
  let startIndex = 0;
  while (startIndex < template.length) {
    const openBracketIndex = template.indexOf(startToken, startIndex);

    if (openBracketIndex === -1) {
      // No more '<' characters found; add the remaining text to the result
      result += template.slice(startIndex);
      break;
    }

    // Append the text before the '<' character to the result
    result += template.slice(startIndex, openBracketIndex);

    const closeBracketIndex = template.indexOf(endToken, openBracketIndex);
    const nextStartBracketIndex = template.indexOf(startToken,openBracketIndex+1);
    if (closeBracketIndex === -1) {
      // If there's no closing '>', treat the '<' as plain text
      result += startToken;
      startIndex = openBracketIndex + 1;
    } 
    // else if (nextStartBracketIndex>-1 && nextStartBracketIndex<closeBracketIndex /* Nested Tokens */){
    //   startIndex = template.length;
    //   yield "nested tokens not supported:"+template;
    //   return;
    // }
     else {
      // Extract the content between '<' and '>', apply interpolation, and append to the result
      const content = template.slice(openBracketIndex + 1, closeBracketIndex);
      const rest = template.slice(closeBracketIndex+1);
      let same = false;
      for await (let interpolated of interpolationFunction(content,[...stack,content])){
        const fork = result + interpolated + rest;
        //console.log(stack,"fork",fork);
        if(interpolated===startToken+content+endToken){
          same = true;
          break;
        } else {
          //console.log("-1-",stack,content, interpolated);
        }
        let restInterpolated:any
        for await (restInterpolated of interpolate(fork, interpolationFunction, startToken,endToken,[...stack,content])){
          //console.log("-2-",stack,content, restInterpolated);
          yield restInterpolated;
        }
      }
      if(!same){
      return;
      } else {
        result += startToken+content+endToken;
        startIndex=closeBracketIndex+1;
      }
    }
  }
  //console.log("Final yield", stack, result);
  // Yield the final interpolated result if no matches
  yield result;
}

export default interpolate;