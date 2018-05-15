const io = require('socket.io')(6999);
const fs = require('fs');
const path = require('path');

const chunkSize = 4;
const folderPath = path.resolve('./drive_data/velodyne_points/data/');
const filePaths = [];

fs.readdirSync(folderPath).forEach((file) => {
  const fp = path.join(folderPath, file);
  filePaths.push(fp);
});

const sendPosition = filePath => new Promise((rs, rj) => {
  console.log(`load file ${filePath}`);
  const readStream = fs.createReadStream(filePath);
  readStream.on('data', (fileBuffer) => {
    console.log(`send ${fileBuffer.length / chunkSize} positions`);
    const arr = [];
    for (let i = 0; i < fileBuffer.length - 1; i += chunkSize * 4) {
      const z = fileBuffer.readFloatLE(i);
      const x = fileBuffer.readFloatLE(i + chunkSize);
      const y = fileBuffer.readFloatLE(i + (chunkSize * 2));
      const w = ((x ** 2) + (y ** 2) + (z ** 2)) ** 0.5;
      const vect = {
        x, y, z, w,
      };
      arr.push(vect);
    }
    io.emit('position', arr);
  }).on('end', () => {
    console.log('end');
    io.emit('end');
    rs();
  });
});

io.on('connection', (socket) => {
  socket.on('getPosition', (fileIndex) => {
    console.log('getPosition: ', fileIndex);
    sendPosition(filePaths[fileIndex]);
  });
  console.log('connection success');
});

