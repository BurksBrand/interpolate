(token:string)=>`<${token}>`

const getDefaultInterpolator = (startSymbol:string, endSymbol:string)=>{
    const result = function* interpolate(token:string) {
        //console.log("default was called",token);
        yield `${startSymbol}${token}${endSymbol}`;
        //yield token;

    }
    return result;
}

export default getDefaultInterpolator;