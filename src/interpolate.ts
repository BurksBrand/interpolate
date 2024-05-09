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
        endToken=">",
        stack=[]
    }:InterpolateOptions):Promise<()=>AsyncGenerator<string, any, unknown>>=>{
    return async function* (){
        const handlers:any = [
            getDictionaryInterpolator(dictionary,stack),// if in dictionary return it
            ...plugins.map((x:any)=>x()),
            getDefaultInterpolator(startToken,endToken,stack) // if we don't have a handler return unmodified
        ]
        async function *fullInterpolate (token:string,stack:string[]=[]){
            for await( let item of ( coalesceYielders<string>(handlers,[token,stack]) )){
                yield item;
            }// token in dictionary ? dictionary[token] : handlers();
        }
        for(let result of template.filter(x=>x).flatMap(async (line:string)=> await interpolator(line,fullInterpolate as any /* we have a default return so it is okay */,startToken,endToken,stack))){
            const r = await result;
            for await (let result2 of r){
                yield result2;
            }
        }
    }
}
export default getInterpolate;