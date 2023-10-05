import { InterpolatorPlugin } from "typings";

const delimiter = ":";
const getSplit = ()=>{
    const result: InterpolatorPlugin = async function* interpolate(token:string) {
        if(token.startsWith("range:")){
            const pieces = token.slice(6).split(delimiter);
            if(pieces.length===2){
                let [start,end] = pieces.map(x=>parseInt(x,10));
                for(let i=start; i<=end; i+=1){
                    yield i.toString();
                }
            } else if(pieces.length===3){
                let [start,end,step] = pieces.map(x=>parseInt(x,10));
                for(let i=start; i<=end; i+=step){
                    yield i.toString();
                }
            }
                //we can't handle it but maybe something else can
            
        }
    }
    return result;
}

export default getSplit;