function tokenize(input: string, startToken: string, endToken: string): [string, string[]] {
    let counter = 0;
    let values: string[] = [];
    let regex = new RegExp(`${startToken}(.*?)${endToken}`, 'g');
    let result = input.replace(regex, (match) => {
        let value = match.slice(startToken.length, match.length - endToken.length);
        values.push(value);
        return `{${counter++}}`;
    });
    return [result, values];
}

export default tokenize;