import current from "./current";
const getDictionaryInterpolator = (dictionary: {[key:string]:string},stack:string[])=>{
    const result = function* interpolate(token:string, stack:string[]=[]) {
        if(token in dictionary){
            yield dictionary[token];
        } 
        else if (token in current) {
            yield current[token];
        }
    }
    return result;
}

export default getDictionaryInterpolator;