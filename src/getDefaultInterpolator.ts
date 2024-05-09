const getDefaultInterpolator = (startSymbol:string, endSymbol:string,stack:string[]=[])=>{
    const result = function* interpolate(token: string,stack:string[]=[]) {
        yield `${startSymbol}${token}${endSymbol}`;
    }
    return result;
}

export default getDefaultInterpolator;