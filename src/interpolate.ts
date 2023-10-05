import interpolator from './interpolator';
import coalesceYielders from './coalesceYielders';
import getDictionaryInterpolator from './getDictionaryInterpolator';
import getDefaultInterpolator from './getDefaultInterpolator';
import { InterpolateOptions } from 'typings';

export type plugin =()=>(key:string)=>string;

const getInterpolate = async ({
        dictionary={},
        template=[],
        plugins=[],
        startToken="<",
        endToken=">"
    }:InterpolateOptions):Promise<()=>AsyncGenerator<string, any, unknown>>=>{
    return async function* (){
        const handlers:any = [
            getDictionaryInterpolator(dictionary),// if in dictionary return it
            ...plugins.map((x:any)=>x()),
            getDefaultInterpolator(startToken,endToken) // if we don't have a handler return unmodified
        ]
        async function *fullInterpolate (token:string){
            for await( let item of ( coalesceYielders<string>(handlers,[token]) )){
                yield item;
            }// token in dictionary ? dictionary[token] : handlers();
        }
        for(let result of template.filter(x=>x).flatMap(async (line:string)=> await interpolator(line,fullInterpolate as any /* we have a default return so it is okay */,startToken,endToken))){
            const r = await result;
            for await (let result2 of r){
                yield result2;
            }
        }
    }
}
export default getInterpolate;