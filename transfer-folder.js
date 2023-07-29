import { resolve } from 'path';
import fs from 'fs-extra';

// Source folder to be transferred
const sourceFolder1 = 'node_modules/@pdftron/webviewer/public/';
// const sourceFolder2 = 'node_modules/@pdftron/webviewer/public/';

// Destination folder in the public directory
const destinationFolder = 'public/webviewer/lib';

try {
  const sourcePath = resolve(sourceFolder1);
  const destinationPath = resolve(destinationFolder);
  
  // Create the destination folder if it doesn't exist
//   execSync(`mkdir -p ${destinationPath}`);
  
  await fs.ensureDir(destinationPath);

  // Transfer the folder using the 'copy' method from fs-extra
  await fs.copy(sourcePath, destinationPath);

  console.log(`Successfully transferred folder: ${sourcePath}`);


} catch (error) {
  console.error('Error transferring folder:', error);
  process.exit(1);
}