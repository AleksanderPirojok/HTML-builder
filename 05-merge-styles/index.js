const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const regexp = /\.css/i;
const writeStream = fs.createWriteStream(bundlePath);
const styles = readdir(stylesPath, { withFileTypes: true });

styles.then((stylesArr) => {
  stylesArr.forEach((style) => {
    const stylePath = path.join(stylesPath, style.name);
    const extension = path.extname(stylePath);
    if (style.isFile() && extension.match(regexp)) {
      const readStream = fs.createReadStream(stylePath, 'utf-8');
      readStream.pipe(writeStream);
    }
  });
});
