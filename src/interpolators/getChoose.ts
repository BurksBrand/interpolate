import {promises as fs} from 'fs';
import * as path from 'path';
import splitFileToken from '../splitFileToken';
import { InterpolatorPlugin, InterpolatorPluginResult } from 'typings';
import current from '../current';

const delimiter = ":"
const _choose = <T>(array: T[]): T | undefined => {
        if (array.length === 0) {
          return undefined; // Return undefined for an empty array
        }
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
      }

const getChoose = ()=>{
    const result:InterpolatorPlugin = async function* interpolate(token:string, stack:string[]=[]):InterpolatorPluginResult {
        if(token.startsWith("choose:")){
            const pieces = token.slice(7).split(delimiter);
            if(pieces[0]==="file"){
                const f  = pieces.slice(1).join(delimiter);
                const result = _choose(((await fs.readFile(path.join(process.cwd(),f), 'utf8'))).split(splitFileToken));
                if(result){
                    current[`${stack[stack.length-2]}.current`] = result;
                    yield result;
                }
            } else {
                const result = _choose(pieces.filter(x=>x))
                if(result){
                    current[`${stack[stack.length-2]}.current`] = result;
                    yield result as string;
                }
            }
        }
    }
    return result;
}

export default getChoose;