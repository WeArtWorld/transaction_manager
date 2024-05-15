import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      // Fetch d'un seul bénévole
      try {
        const response = await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Volunteers/${id}.json`);
        const data = await response.json();
        res.status(200).json({ id, ...data });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch volunteer' });
      }
      break;

    case 'PATCH':
      // Update un bénévole
      try {
        const updatedVolunteer = req.body;
        const response = await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Volunteers/${id}.json`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedVolunteer),
        });
        const data = await response.json();
        res.status(200).json({ id, ...data });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update volunteer' });
      }
      break;
  
  case 'DELETE':
      // supprimer un bénévole
      try {
        await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Volunteers/${id}.json`, {
          method: 'DELETE',
        });
        res.status(204).end(); 
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete volunteer' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
