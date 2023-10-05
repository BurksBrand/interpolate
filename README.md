# interpolate
a typescript node tool for interpolating a template array with a series of plugins


## CLI mode

```sh
ts-node main.ts <dictionary-file-path> <template-file-path> <?startToken> <?endToken>
```

## Library

interpolate(dictionary, arrayOfStringTemplates)


Sample Input:

Dictionary
```json
{
    "age":"23",
    "name":"bob",
    "color":"<split:red:blue:green>"
}
```

Template:
```
<split:file:./examples/colors.txt><name> is <age>
<name> is <age>
Foo <name> is <age>
<split:john:sam:joe><name> is <age>
<range:24:30> wizards
<range:24:30:5> wizards
<color> dog
<defaulthandlershouldfire>
```

Sample Output:
```
redbob is 23
bluebob is 23
greenbob is 23
yellowbob is 23
bob is 23
Foo bob is 23
johnbob is 23
sambob is 23
joebob is 23
24 wizards
25 wizards
26 wizards
27 wizards
28 wizards
29 wizards
30 wizards
24 wizards
29 wizards
red dog
blue dog
green dog
<defaulthandlershouldfire>
```

Usage Example:
```js

const {interpolateFromFiles, interpolate,getChoose,getSplit,getRange,getDefaultInterpolator} = require("@burksbrand/interpolate");

// A custom plugin for year
const customPlugin = ()=>{
    return async function* (token) {
        if(token==="customplugin"){
            yield (new Date(Date.now())).getFullYear()
        }    
    }

}


const main = async function (){

    const templateFileToRead = "./template.txt"
    const dictionaryFileToRead = "./dictionary.json"

    // Example 1 using no plugins and files
    const foo = await interpolateFromFiles({templateFileToRead,dictionaryFileToRead,
       plugins:[
        ]
    });
    for await (let item of foo()){
        console.log(item)
    }
    
    // Example 2 using getSplit plugin and customPlugin
    const foo2 = await interpolate({
        dictionary:{
            "toes":"this little piggy <customplugin><bogus>"
        },
        template:["tippy <toes>","<split:23:24:29><toes><bogus>"],
        plugins:[
           getSplit,
           customPlugin
            ]
    })
    for await (let item of foo2()){
        console.log(item);
    }
}
main();


```