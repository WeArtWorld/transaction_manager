import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Fetch toutes les ventes
      try {
        const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Sales.json');
        const data = await response.json();
        const sales = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        }));
        res.status(200).json(sales);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sales' });
      }
      break;

    case 'POST':
      // Creer une vente
      try {
        const newSale = req.body;
        const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Sales.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSale),
        });
        const data = await response.json();
        res.status(201).json({ id: data.name, ...newSale });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create sale' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
