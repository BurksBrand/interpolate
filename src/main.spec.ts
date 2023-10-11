import { FileInterpolateOptions } from 'typings';
import {interpolate,interpolateFromFiles} from './main'; // Import the main function and related types
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
    "red<bogus>bob is 23",
    "blue<bogus>bob is 23",
    "green<bogus>bob is 23",
    "yellow<bogus>bob is 23",
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
    "blue",
    "green",
    "green",
    "yellow",
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
    const result:()=>AsyncGenerator<string> = await interpolateFromFiles(options);
    let i = 0;
    let hasItems = false;
    for await(let line of result()){
        // Assert: Check the result or any expectations
        expect(line).toEqual(results[i]);
        i+=1;
        hasItems=true;
    } 
    expect(hasItems).toBeTruthy();

  });
  it('should successfully execute', async () => {
    const result = await interpolate({});
    let hasItems = false;
    for await(let line of result()){
      hasItems=true;
    }
    expect(hasItems).toBeFalsy();
  });

  it('should successfully execute main with template.choice.txt and dictionary', async () => {
    // Arrange: Set up the test input
    const options: FileInterpolateOptions = {
      templateFileToRead: './examples/template.choice.txt',
      dictionaryFileToRead: './examples/dictionary.json',
    };

    // Act: Call the main function
    const result:()=>AsyncGenerator<string> = await interpolateFromFiles(options);

    let index = 0;
    let hasItems = false;
    for await(let line of result()){
    // Assert: Check the result or any expectations
        if(index<1){
            expect(["red","blue","green","yellow"]).toContain(line);
        } else if( index<2){
            expect("<choose:>").toEqual(line);
        } else if( index<3){
          expect(["cat","dog"]).toContain(line);
        } else if (index<5) {
          expect(["red","blue","green","yellow"]).toContain(line);
        } else if(index<7) {
          expect(["foo","bar","baz","bat"]).toContain(line);
        } else {
          expect("<choosemany:2:>").toEqual(line);
        } 
        //console.log(`${index} - ${line}`);
        hasItems=true;
        index+=1;
    }
    expect(hasItems).toBeTruthy();
    expect(index).toBe(8);
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
    const result:()=>AsyncGenerator<string> = await interpolateFromFiles(options);
    let hasItems = false;
    for await(let line of result()){
    // Assert: Check the result or any expectations
        hasItems=true;
        expect(line).toEqual("<split:red:blue:green> dog");
    }
    expect(hasItems).toBeTruthy();
  });
  it('should successfully execute main with template.noclosing.txt and dictionary', async () => {
    // Arrange: Set up the test input
    const options: FileInterpolateOptions = {
      templateFileToRead: './examples/template.noclosing.txt',
      dictionaryFileToRead: './examples/dictionary.json'
    };

    // Act: Call the main function
    const result:()=>AsyncGenerator<string> = await interpolateFromFiles(options);
    let hasItems = false;
    let i = 0;
    const results = ["<color dog","<color log <name>"]
    for await(let line of result()){
      hasItems=true;
    // Assert: Check the result or any expectations
        expect(line).toEqual(results[i]);
        i+=1;
    }
    expect(hasItems).toBeTruthy();

  });
});
