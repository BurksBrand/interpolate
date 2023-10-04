import main, { FileInterpolateOptions } from './main'; // Import the main function and related types
import * as fs from 'fs';

describe('main', () => {
  // Define a mock function for fs.readFile
  const mockReadFile = jest.fn();

  // Mock the fs module to control the behavior of fs.readFile
  jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    readFile: mockReadFile,
  }));

  const results =[
    "redbob is 23",
    "bluebob is 23",
    "greenbob is 23",
    "yellowbob is 23",
    "bob is 23",
    "Foo bob is 23",
    "johnbob is 23",
    "sambob is 23",
    "joebob is 23",
    "24 wizards",
    "25 wizards",
    "26 wizards",
    "27 wizards",
    "28 wizards",
    "29 wizards",
    "30 wizards",
    "24 wizards",
    "29 wizards",
    "red dog",
    "blue dog",
    "green dog",
    "<defaulthandlershouldfire>"
];
  // Example test case
  it('should successfully execute main with template.txt and dictionary', async () => {
    // Arrange: Set up the test input
    const options: FileInterpolateOptions = {
      templateFileToRead: './examples/template.txt',
      dictionaryFileToRead: './examples/dictionary.json',
    };

    // Mock fs.readFile to return desired content
    // mockReadFile
    //   .mockResolvedValueOnce('Template content')
    //   .mockResolvedValueOnce('{"key": "value"}');

    // Act: Call the main function
    const result:()=>AsyncGenerator<string> = await main(options);
    let i = 0;
    for await(let line of result()){
    // Assert: Check the result or any expectations
    expect(line).toEqual(results[i]);
        i+=1;
    }

  });

  it('should successfully execute main with template.choice.txt and dictionary', async () => {
    // Arrange: Set up the test input
    const options: FileInterpolateOptions = {
      templateFileToRead: './examples/template.choice.txt',
      dictionaryFileToRead: './examples/dictionary.json',
    };

    // Act: Call the main function
    const result:()=>AsyncGenerator<string> = await main(options);

    let index = 0;
    for await(let line of result()){
    // Assert: Check the result or any expectations
        if(index<1){
            expect(["red","blue","green","yellow"]).toContain(line);
        } else if( index<2){
            expect("<choose:>").toEqual(line);
        }else {
            expect(["cat","dog"]).toContain(line);
        }

        index+=1;
    }

  });
  it('should successfully execute main with template.othersymbols.txt and dictionary', async () => {
    // Arrange: Set up the test input
    const options: FileInterpolateOptions = {
      templateFileToRead: './examples/template.othersymbols.txt',
      dictionaryFileToRead: './examples/dictionary.json',
      startToken:"{",
      endToken:"}"
    };

    // Act: Call the main function
    const result:()=>AsyncGenerator<string> = await main(options);

    for await(let line of result()){
    // Assert: Check the result or any expectations
        //console.log("line",line);
        expect(line).toEqual("<split:red:blue:green> dog");
    }

  });
  it('should successfully execute main with template.noclosing.txt and dictionary', async () => {
    // Arrange: Set up the test input
    const options: FileInterpolateOptions = {
      templateFileToRead: './examples/template.noclosing.txt',
      dictionaryFileToRead: './examples/dictionary.json',
    //   startToken:"{",
    //   endToken:"}"
    };

    // Act: Call the main function
    const result:()=>AsyncGenerator<string> = await main(options);

    for await(let line of result()){
    // Assert: Check the result or any expectations
        expect(line).toEqual("<color dog");
    }

  });
});
