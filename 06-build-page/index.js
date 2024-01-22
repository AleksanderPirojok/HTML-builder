const path = require('path');
const fs = require('fs');
const { mkdir, readdir, copyFile /* unlink */ } = require('fs/promises');

const distPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(__dirname, 'assets');
const newAssetsPath = path.join(distPath, 'assets');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const indexHtmlPath = path.join(distPath, 'index.html');
// make 'project-dist' folder
mkdir(distPath, { recursive: true });

// merge styles
async function mergeStyles() {
  const stylesPath = path.join(__dirname, 'styles');
  const bundlePath = path.join(distPath, 'style.css');
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
}

// copy assets
async function copyDir(fromPath, toPath) {
  mkdir(toPath, { recursive: true });
  const files = readdir(fromPath, { withFileTypes: true });
  //const copyFiles = readdir(toPath, { withFileTypes: true });

  // await copyFiles.then((filesArr) => {
  //   filesArr.forEach((file) => {
  //     const newFilePath = path.join(toPath, file.name);
  //     unlink(newFilePath);
  //   });
  // });

  files.then((filesArr) => {
    filesArr.forEach((file) => {
      const sourcePath = path.join(fromPath, file.name);
      const destinationPath = path.join(toPath, file.name);
      if (file.isDirectory()) {
        copyDir(sourcePath, destinationPath);
      } else {
        copyFile(sourcePath, destinationPath);
      }
    });
  });
}

// HTML
async function modifyTemplate() {
  let finalTemplate = '';
  let tags = [];

  const readStream = fs.createReadStream(templatePath, 'utf-8');
  const writeStream = fs.createWriteStream(indexHtmlPath);

  readStream.on('data', (chunk) => {
    finalTemplate += chunk;

    const components = readdir(componentsPath, { withFileTypes: true });

    components.then((componentsArr) => {
      componentsArr.forEach((component) => {
        const regexp = /\.html/i;
        const componentPath = path.join(componentsPath, component.name);
        const extension = path.extname(componentPath);
        if (component.isFile() && extension.match(regexp)) {
          const fileName = component.name.split('.')[0];
          tags.push(fileName);
        }
      });
      tags.forEach((tag, index) => {
        const tagPath = path.join(componentsPath, `${tag}.html`);
        const readTag = fs.createReadStream(tagPath, 'utf-8');
        readTag.on('data', (data) => {
          finalTemplate = finalTemplate.replace(`{{${tag}}}`, data);
          if (index === tags.length - 1) {
            writeStream.write(finalTemplate);
          }
        });
      });
    });
  });
}

// body
mergeStyles();
copyDir(assetsPath, newAssetsPath);
modifyTemplate();
