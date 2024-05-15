import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      // Fetch une seul vente
      try {
        const response = await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Sales/${id}.json`);
        const data = await response.json();
        res.status(200).json({ id, ...data });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sale' });
      }
      break;

    case 'PATCH':
      // Update une vente
      try {
        const updatedSale = req.body;
        const response = await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Sales/${id}.json`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSale),
        });
        const data = await response.json();
        res.status(200).json({ id, ...data });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update sale' });
      }
      break;

    case 'DELETE':
      // supprimer une vente
      try {
        await fetch(`https://transactions-man-default-rtdb.firebaseio.com/Sales/${id}.json`, {
          method: 'DELETE',
        });
        res.status(204).end(); 
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete sale' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);

  }
}
