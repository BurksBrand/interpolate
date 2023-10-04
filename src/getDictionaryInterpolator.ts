
const getDictionaryInterpolator = (dictionary: {[key:string]:string})=>{
    const result = function* interpolate(token:string) {
        if(token in dictionary){
            yield dictionary[token];
        }
    }
    return result;
}

export default getDictionaryInterpolator;