import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Fetch tous les artistes
      try {
        const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Artists.json');
        const data = await response.json();
        const artists = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        }));
        res.status(200).json(artists);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch artists' });
      }
      break;

    case 'POST':
      // creer un artiste
      try {
        const newArtist = req.body;
        const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Artists.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newArtist),
        });
        const data = await response.json();
        res.status(201).json({ id: data.name, ...newArtist });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create artist' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
