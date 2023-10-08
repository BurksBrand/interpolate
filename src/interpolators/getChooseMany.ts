import {promises as fs} from 'fs';
import * as path from 'path';
import { InterpolatorPlugin, InterpolatorPluginResult } from 'typings';

const delimiter = ":"
function shuffleArray<T>(array:T[]):void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i
  
      // Swap array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

async function* _choosemany<T>(numberToChoose:number, array: T[]) {
        shuffleArray(array)
        for(let item of array.slice(numberToChoose)){
            yield item;
        }
      }

const getChooseMany = ()=>{
    const result:InterpolatorPlugin = async function* interpolate(token:string):InterpolatorPluginResult {
        const keyword = "choosemany:";
        if(token.startsWith(keyword)){
            const pieces = token.slice(keyword.length).split(delimiter);
            if(pieces.length > 2){
                const countOfChoice = parseInt(pieces[0],10);

                if(pieces[1]==="file"){
                    const f  = pieces[2];
                    for await (let item of _choosemany<string>(countOfChoice,((await fs.readFile(path.join(process.cwd(),f), 'utf8'))).split(/\r?\n/))){
                        yield item;
                    }
                } else {
                    for await (let item of _choosemany(countOfChoice,pieces.slice(1).filter(x=>x&&x.length>0))){
                        if(item){
                            yield item;
                        }    
                    }
                }
    
            }
        }
    }
    return result;
}

export default getChooseMany;