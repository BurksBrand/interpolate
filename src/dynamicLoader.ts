import {promises as fs} from 'fs';
import * as path from 'path';

async function dynamicLoad(interpolatorFolder:string, extension:string) {
  // const interpolatorFolder = './interpolators'; 
  const modules: {default:any}[] = [];

  try {
    const files = await fs.readdir(interpolatorFolder);

    // Filter and map the TypeScript files
    const moduleFiles = files.filter((file) => file.endsWith(extension));
    // Create an array of promises for reading and loading the modules
    const promises = moduleFiles.map(async (file) => {
      const modulePath = path.join(interpolatorFolder, file);
      const moduleToAdd = await import(modulePath);
      if (moduleToAdd.default && typeof moduleToAdd.default === 'function') {
        modules.push(moduleToAdd.default);
      }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);
    return modules;
  } catch (error) {
    //console.error('Error reading or loading files:', error);
    throw error;
  }
}

export default dynamicLoad;