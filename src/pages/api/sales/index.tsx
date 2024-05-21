import { log } from 'console';
import { NextApiRequest, NextApiResponse } from 'next';

// Helper function to update an artist or volunteer
async function updatePerson(type: 'Artists' | 'Volunteers', id: string, data: any) {
  const url = `https://transactions-man-default-rtdb.firebaseio.com/${type}/${id}.json`;
  try {
    // Fetch current data
    const currentDataResponse = await fetch(url);
    const currentData = await currentDataResponse.json();

    // Calculate new values
    const newItemSold = parseInt(currentData.item_sold || 0) + 1;
    const newOwedAmount = parseFloat(currentData.owed_amount || 0) + (type === 'Volunteers' ? parseFloat(data.price) * 0.10 : parseFloat(data.price) * 0.55);
    const newTotalRevenue = parseFloat(currentData.total_revenue || 0) + parseFloat(data.price);
    

    // Update data
    const updateResponse = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_sold: newItemSold,
        owed_amount: newOwedAmount,
        total_revenue: newTotalRevenue,
      }),
    });
    return await updateResponse.json();
  } catch (error: unknown) {
    // Error handling remains the same
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
        const { price, volunteer_id, artist_id } = req.body;
      
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
      
          // Update volunteer and artist
          await updatePerson('Volunteers', volunteer_id, { price: parseFloat(price) });
          await updatePerson('Artists', artist_id, { price: parseFloat(price) });
      
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
