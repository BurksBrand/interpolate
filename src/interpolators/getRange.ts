import { InterpolatorPlugin } from "typings";
import current from "../current";
const delimiter = ":";
const getSplit = ()=>{
    const result: InterpolatorPlugin = async function* interpolate(token:string, stack:string[]=[]) {
        if(token.startsWith("range:")){
            const pieces = token.slice(6).split(delimiter);
            if(pieces.length===2){
                let [start,end] = pieces.map(x=>parseInt(x,10));
                for(let i=start; i<=end; i+=1){
                    const result = i.toString();
                    current[`${stack[stack.length-2]}.current`] = result;
                    yield result;
                }
            } else if(pieces.length===3){
                let [start,end,step] = pieces.map(x=>parseInt(x,10));
                for(let i=start; i<=end; i+=step){
                    const result = i.toString();
                    current[`${stack[stack.length-2]}.current`] = result;
                    yield result;
                }
            }
                //we can't handle it but maybe something else can
            
        }
    }
    return result;
}

export default getSplit;