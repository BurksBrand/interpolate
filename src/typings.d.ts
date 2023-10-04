export interface InterpolatorPlugin {
    default: ()=>(token:string)=>Generator<string>
}