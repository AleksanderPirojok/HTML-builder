const { mkdir, rm, readdir, copyFile } = require('fs/promises');
// const { access } = require('fs');
const path = require('path');

async function copyDir() {
  const dirPath = path.join(__dirname, 'files');
  const copyDirPath = path.join(__dirname, 'files-copy');
  const files = readdir(dirPath, { withFileTypes: true });
  //  access(copyDirPath);
  // rm(copyDirPath, { recursive: true });
  mkdir(copyDirPath, { recursive: true });

  files.then((filesArr) => {
    filesArr.forEach((file) => {
      const sourcePath = path.join(dirPath, file.name);
      const destinationPath = path.join(copyDirPath, file.name);
      copyFile(sourcePath, destinationPath);
    });
  });
}

copyDir();
