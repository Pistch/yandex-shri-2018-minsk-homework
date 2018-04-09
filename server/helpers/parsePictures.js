const { info } = require('easyimage');
const fs = require('fs');
const path = require('path');

function getImageData(path) {
  if (path.indexOf('.jp') === -1) return null;
  return info(path);
}

const root = path.join(__dirname, '../../pictures');

async function parseImages() {
  let dir = new Promise((resolve, reject) => {
    fs.readdir(root, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    })
  });

  let imagesInfo = await dir;

  for (let i = 0; i < imagesInfo.length; i++) {
    imagesInfo[i] = await getImageData(path.join(root, imagesInfo[i]));
  }

  imagesInfo = imagesInfo.filter(img => img);

  imagesInfo.sort(() => Math.random() - 0.5);

  return Promise.resolve(imagesInfo);
}

module.exports = parseImages;
