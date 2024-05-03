import { IncomingForm } from 'formidable';
import fs from 'fs';
import { isEmpty } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1gb',
    }, // Disable built-in body parser
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new IncomingForm({
    maxFileSize: 1000 * 1024 * 1024, // 1GB file size limit
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error');
    }

    const file = files.video;
    if (!file && !isEmpty(file)) {
      return res.status(400).send('No file uploaded');
    }

    const realfile = (file as any)[0];
    const fileBuffer = fs.readFileSync(realfile.filepath);

    const formData = new FormData();
    const videoBlob = new Blob([fileBuffer], { type: 'video/mp4' }); // Adjust the MIME type as needed
    formData.append(
      'video',
      videoBlob,
      `${Date.now()}${realfile.originalFilename}`
    );

    try {
      const proxyResponse = await fetch(
        'http://ec2-3-84-158-161.compute-1.amazonaws.com/predict',
        {
          method: 'POST',
          body: formData,
        }
      );

      const response = await proxyResponse.json();
      res.status(200).json({ ...response });
    } catch (err) {
      console.error(err);
      res.status(500).send(`Error ${String(err)}`);
    }
  });
}
