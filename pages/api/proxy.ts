import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Api for adding new items to the list
 * @param req
 * @param res
 * @returns
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const { url, method, body } = req.body;

    const response = await fetch(url, {
      method,
      body,
    });
    const data = await response.json();
    res.status(200).json(data);
    return;
  } catch (err) {
    res.status(500).send('Error');
  }
}
