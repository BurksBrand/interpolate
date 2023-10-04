import {promises as fs} from 'fs';
import * as path from 'path';
import dynamicLoader from './dynamicLoader';
import getInterpolate from './interpolate';

export interface FileInterpolateOptions {
    templateFileToRead: string,
    dictionaryFileToRead: string,
    startToken?: string,
    endToken?: string
}
const main = async ({templateFileToRead,dictionaryFileToRead, startToken="<", endToken=">"}:FileInterpolateOptions):Promise<()=>AsyncGenerator<string>>=>{
    let ext = ".js";
    if(__filename.indexOf(".ts")>-1){
        ext = ".ts";
    }
   // console.log(path.join(process.cwd(),"./interpolators/"),ext);
    const pieces =await Promise.all([...[templateFileToRead,dictionaryFileToRead].map((fileName)=>fs.readFile(fileName, 'utf8')),...(await dynamicLoader(path.join(__dirname,"./interpolators/"),ext))]);
    let [template,dictionaryToParse,...plugins]:any = pieces;
    const dictionary = JSON.parse(dictionaryToParse);
    return await getInterpolate({dictionary,template:template.split("\r\n"),plugins, startToken,endToken});
}

if (require.main === module) {
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
    main({templateFileToRead,dictionaryFileToRead,startToken,endToken}).then(async (generator)=>{
        for await(let result of generator()){
            console.log(result);
        }   
    })
}
export default main;