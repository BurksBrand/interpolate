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