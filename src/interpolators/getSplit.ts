import {promises as fs} from 'fs';
import * as path from 'path';
import { InterpolatorPlugin } from 'typings';

const delimiter = ":"
const getSplit = ()=>{
    const result: InterpolatorPlugin = async function* interpolate(token:string) {
        if(token.startsWith("split:")){
            const pieces = token.slice(6).split(delimiter);
            if(pieces[0]==="file"){
                const f  = pieces.slice(1).join(delimiter);
                for await (let line of (await fs.readFile(path.join(process.cwd(),f), 'utf8')).split("\r\n")){
                    yield line;
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