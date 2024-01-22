const { mkdir, readdir, copyFile, unlink } = require('fs/promises');
const path = require('path');

async function copyDir() {
  const dirPath = path.join(__dirname, 'files');
  const copyDirPath = path.join(__dirname, 'files-copy');
  const files = readdir(dirPath, { withFileTypes: true });

  await mkdir(copyDirPath, { recursive: true });
  const copiedFiles = readdir(copyDirPath, { withFileTypes: true });

  await copiedFiles.then((filesArr) => {
    filesArr.forEach((file) => {
      const newFilePath = path.join(copyDirPath, file.name);
      unlink(newFilePath);
    });
  });

  files.then((filesArr) => {
    filesArr.forEach((file) => {
      const sourcePath = path.join(dirPath, file.name);
      const destinationPath = path.join(copyDirPath, file.name);
      copyFile(sourcePath, destinationPath);
    });
  });
}

copyDir();
