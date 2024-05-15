import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Fetch tout les bénévole
      try {
        const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Volunteers.json');
        const data = await response.json();
        const volunteers = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        }));
        res.status(200).json(volunteers);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch volunteers' });
      }
      break;

    case 'POST':
      // creer un bénévole
      try {
        const newVolunteer = req.body;
        const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Volunteers.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newVolunteer),
        });
        const data = await response.json();
        res.status(201).json({ id: data.name, ...newVolunteer });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create volunteer' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
