import formidable, { File } from 'formidable';
import fs from 'fs';
import { isEmpty } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

const form = formidable({ multiples: true });

const isFile = (file: File | File[]): file is File =>
  !Array.isArray(file) && file.filepath !== undefined;

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '1000mb',
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fileContent: string = await new Promise((resolve, reject) => {
      try {
        form.parse(req, async (err, _fields, files) => {
          const file = files.video;
          if (!file && !isEmpty(file)) {
            return reject('No file uploaded');
          }

          const realfile = (file as any)[0];
          const fileBuffer = fs.readFileSync(realfile.filepath);

          resolve('Hello World');

          // const formData = new FormData();
          // const videoBlob = new Blob([fileBuffer], {
          //   type: 'video/mp4',
          // }); // Adjust the MIME type as needed

          // formData.append(
          //   'video',
          //   videoBlob,
          //   `${Date.now()}${realfile.originalFilename}`
          // );

          // try {
          //   const proxyResponse = await fetch(
          //     'http://ec2-3-84-158-161.compute-1.amazonaws.com/predict',
          //     {
          //       method: 'POST',
          //       body: formData,
          //     }
          //   );

          //   const response = await proxyResponse.json();
          //   resolve({ ...response });
          // } catch (err) {
          //   console.error(err);
          //   reject(`Error ${String(err)}`);
          // }
        });
      } catch (e) {
        reject(`Error ${String(e)}`);
      }
    });

    // Do whatever you'd like with the file since it's already in text
    console.log(fileContent);

    res.status(200).json(fileContent);
  } catch (err) {
    res.status(400).send({ message: 'Bad Request' + err });
  }
}
