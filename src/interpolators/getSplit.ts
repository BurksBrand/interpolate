import {promises as fs} from 'fs';
import * as path from 'path';
import splitFileToken from '../splitFileToken';
import { InterpolatorPlugin } from 'typings';

const delimiter = ":"
const getSplit = ()=>{
    const result: InterpolatorPlugin = async function* interpolate(token:string) {
        if(token.startsWith("split:")){
            const pieces = token.slice(6).split(delimiter);
            if(pieces[0]==="file"){
                let f  = pieces.join(delimiter);
                let head = -1;
                let startTake = -1;
                let sliceItem = 1;
                if(pieces.length>2){
                    if(pieces[1]==="head"){
                        sliceItem +=2;
                        head = parseInt(pieces[2],10);
                        if(pieces.length>4 && pieces[3]==="tail"){
                            sliceItem +=2;
                            startTake = head- parseInt(pieces[4],10)-1;
                        }
                    }
                    if(pieces[1]==="tail"){
                        sliceItem +=2;
                        startTake = parseInt(pieces[2],10)-1;
                    }
                }
                f=f.split(":").slice(sliceItem)[0]
                let index = 0;
                     for await (let line of (await fs.readFile(path.join(process.cwd(),f), 'utf8')).split(splitFileToken)){
                    if((startTake===-1 && head===-1) ||index<startTake+head&&index>startTake){
                        const result = line.trim();
                        if(result){
                            yield line.trim();
                        }
                    }
                    index+=1;
                }
            } else {
                for (let newToken of token.slice(6).split(delimiter)){
                    yield newToken;
                }
            }
        }
    }
    return result;
}

export default getSplit;