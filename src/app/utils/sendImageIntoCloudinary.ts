import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloud_api_key,
  api_secret: config.cloud_api_secret,
});

export const sendImageIntoCloudinary = (
  path: string,
  fileName: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolved, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: fileName },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolved(result as UploadApiResponse);

        if (result) {
          fs.unlink(path, (err) => {
            if (err) {
              reject(err);
            } else {
              console.log('File is deleted.');
            }
          });
        }
      },
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
