
async function* interpolate(template:string, interpolationFunction:(s:string)=>AsyncGenerator<string>, startToken:string,endToken:string):AsyncGenerator<string> {
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
      for await (let interpolated of interpolationFunction(content)){
        const fork = result + interpolated + rest;
        if(interpolated===startToken+content+endToken){
          same = true;
          break;
        }
      let restInterpolated:any
        for await (restInterpolated of interpolate(fork, interpolationFunction, startToken,endToken)){
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
  // Yield the final interpolated result if no matches
  yield result;
}

export default interpolate;