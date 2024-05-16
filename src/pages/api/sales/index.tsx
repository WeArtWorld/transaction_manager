import { log } from 'console';
import { NextApiRequest, NextApiResponse } from 'next';

// Helper function to update an artist or volunteer
async function updatePerson(type: 'Artists' | 'Volunteers', id: string, data: any) {
  try {
    const response = await fetch(`https://transactions-man-default-rtdb.firebaseio.com/${type}/${id}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error: unknown) {
    // Using type assertion
    if (error instanceof Error) {
      console.error(`Failed to update ${type.slice(0, -1)}`, error.message);
    } else {
      console.error(`Failed to update ${type.slice(0, -1)}`, 'An unknown error occurred');
    }
    throw new Error(`Failed to update ${type.slice(0, -1)}`);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Fetch all sales
      try {
        const response = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Sales.json');
        const data = await response.json();
        const sales = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        res.status(200).json(sales);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sales' });
      }
      break;

    case 'POST':
      // Create a sale and update volunteer and artist records
      const { price, volunteer_id, artist_id } = req.body;
      const volunteer_owed = parseFloat(price) * 0.10; // 10% pour les bénécole
      const artist_owed = parseFloat(price) * 0.45;   //45% pour les artiste

      try {
        // Save the new sale
        const newSale = req.body;
        const saleResponse = await fetch('https://transactions-man-default-rtdb.firebaseio.com/Sales.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSale),
        });
        const saleData = await saleResponse.json();

        // Update volunteer
        console.log("Volunteers",volunteer_id);
        await updatePerson('Volunteers', volunteer_id, {          
          owed_amount: volunteer_owed,
          item_sold: 1,  // Assuming initial value or fetch and update logic needed
          total_revenue: parseFloat(price)
        });

        // Update artist
        await updatePerson('Artists', artist_id, {
          owed_amount: artist_owed,
          item_sold: 1,  // Assuming initial value or fetch and update logic needed
          total_revenue: parseFloat(price)
        });

        res.status(201).json({ id: saleData.name, ...newSale });
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ error: 'Failed to create sale', details: error.message });
        } else {
          res.status(500).json({ error: 'Failed to create sale', details: 'An unknown error occurred' });
        }
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
