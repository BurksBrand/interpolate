import {promises as fs} from 'fs';
import * as path from 'path';
import dynamicLoader from './dynamicLoader';
import getInterpolate from './interpolate';
import { FileInterpolateOptions, InterpolateOptions } from './typings';

export {InterpolatorPlugin} from './typings';
export {default as getChoose} from './interpolators/getChoose';
export {default as getRange} from './interpolators/getRange';
export {default as getSplit} from './interpolators/getSplit';
export {default as coalesceYields} from './coalesceYielders';
export {default as dynamicLoader} from './dynamicLoader';
export {default as getDefaultInterpolator} from './getDefaultInterpolator';
export {default as getDictionaryInterpolator} from './getDictionaryInterpolator';
export {default as interpolator} from './interpolator'; 

export const interpolateFromFiles = async ({templateFileToRead,dictionaryFileToRead, startToken="<", endToken=">"}:FileInterpolateOptions):Promise<()=>AsyncGenerator<string>>=>{
    let ext = ".js";
    if(__filename.indexOf(".ts")>-1){
        ext = ".ts";
    }
   // console.log(path.join(process.cwd(),"./interpolators/"),ext);
    const pieces =await Promise.all([...[templateFileToRead,dictionaryFileToRead].map((fileName)=>fs.readFile(fileName, 'utf8')),...(await dynamicLoader(path.join(__dirname,"./interpolators/"),ext))]);
    let [template,dictionaryToParse,...plugins]:any = pieces;
    const dictionary = JSON.parse(dictionaryToParse);
    return interpolate({dictionary,template:(template as string).split("\r\n"),plugins:plugins,startToken,endToken})

}
export const interpolate = async (options:InterpolateOptions):Promise<()=>AsyncGenerator<string>>=>{
    return await getInterpolate(options);
}

export const interpolateFromCLI = async()=>{
    // Check if a command-line argument (a file path) was provided
    // const IS_TS = process.argv[1].indexOf(".ts")
    let argOffset = 1
    if (!(process.argv.length == 4 || process.argv.length == 6)) {
        console.error('Usage: ts-node main.ts <dictionary-file-path> <template-file-path> <?startToken> <?endToken>');
        process.exit(1);
    }
    let startToken = "<";
    let endToken = ">";
    if(process.argv.length==6){
        startToken = process.argv[3+argOffset];
        endToken = process.argv[4+argOffset];

    }
    const templateFileToRead = path.join(process.cwd(), process.argv[2+argOffset]);
    const dictionaryFileToRead = path.join(process.cwd(), process.argv[1+argOffset]);
    interpolateFromFiles({templateFileToRead,dictionaryFileToRead,startToken,endToken}).then(async (generator)=>{
        for await(let result of generator()){
            console.log(result);
        }   
    })

}
if (require.main === module) {
    interpolateFromCLI();
}
export default interpolate;