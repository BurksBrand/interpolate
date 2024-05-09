export type InterpolatorPluginResult=AsyncGenerator<string>
export type InterpolatorPlugin=(token:string)=>InterpolatorPluginResult;
export type getInterpolatorPlugin=()=>InterpolatorPlugin;
export interface InterpolatorPluginModule {
    default: Promise<getInterpolatorPlugin>
}
export interface InterpolateOptions{
    dictionary?: {[key:string]:string},
    template?:string[]
    plugins?:InterpolatorPlugin[],
    startToken?:string
    endToken?:string,
    stack?:string[]
}

export interface FileInterpolateOptions {
    templateFileToRead: string,
    dictionaryFileToRead: string,
    startToken?: string,
    endToken?: string,
    stack?:string[]
}
