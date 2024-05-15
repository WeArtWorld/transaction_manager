import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      // Fetch un seul artiste
      try {
        const response = await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Artists/${id}.json`);
        const data = await response.json();
        res.status(200).json({ id, ...data });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch artist' });
      }
      break;

    case 'PATCH':
      // Update un artiste
      try {
        const updatedArtist = req.body;
        const response = await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Artists/${id}.json`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedArtist),
        });
        const data = await response.json();
        res.status(200).json({ id, ...data });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update artist' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PATCH']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}