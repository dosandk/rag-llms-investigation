import busboy from "busboy";
import { text } from "node:stream/consumers"

export const uploadFile = async (req, res, next) => {
  const fileLimit = 100; // could be whatever you want 
  const fileSize = req.headers['content-length'];
  const fileSizeInKB = (fileSize / 1024); // this would be in kilobytes defaults to bytes

  if (fileSizeInKB > fileLimit) {
    return next({
      statusCode: 400,
      message: `File is too big. Please upload the file no more than ${fileLimit}KB`,
    })
  }

  const bb = busboy({ headers: req.headers });

  bb.on('file', async (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    console.log(
      `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
      filename,
      encoding,
      mimeType
    );

    if (mimeType !== 'text/markdown') {
      return next({
        statusCode: 400,
        message: `Wrong file format. Please upload text/markdown`,
      })
    }

    req.content = {
      file: await text(file),
      metadata: {
        source: filename,
      }
    };

    next();
  });

  req.pipe(bb);
}