const path = require('path');
const { readdir } = require('fs/promises');
const { stat } = require('fs');
const { stdout } = require('process');

const dirPath = path.join(__dirname, 'secret-folder');
const files = readdir(dirPath, { withFileTypes: true });

files.then((filesArr) => {
  filesArr.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(dirPath, file.name);
      const fileName = file.name.split('.')[0];
      const fileExtension = path.extname(filePath).slice(1);
      let fileSize;

      stat(filePath, (err, stats) => {
        fileSize = (stats.size / 1024).toFixed(3);
        stdout.write(`${fileName}`);
        stdout.write(' - ');
        stdout.write(`${fileExtension}`);
        stdout.write(' - ');
        stdout.write(`${fileSize} kb\n`);
      });
    }
  });
});
