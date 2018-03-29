const { info } = require('easyimage');
const fs = require('fs');
const path = require('path');

function getImageData(path) {
  if (path.indexOf('.jp') === -1) return null;
  return info(path);
}

const root = path.join(__dirname, '../public/pictures');

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

  fs.open(path.join(root, '../pictures.json'), "w+", 0644, function(err, file_handle) {
    if (!err) {
      fs.write(file_handle, JSON.stringify(imagesInfo), null, 'ascii', function(err, written) {
        if (!err) {
          console.log("Success! ", written);
        } else {
          console.log("Write error", err);
        }
      });
    } else {
      console.log("File opening error! ", err);
    }
  });
}

parseImages();
