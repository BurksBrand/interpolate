const getDefaultInterpolator = (startSymbol:string, endSymbol:string)=>{
    const result = function* interpolate(token: string) {
        yield `${startSymbol}${token}${endSymbol}`;
    }
    return result;
}

export default getDefaultInterpolator;