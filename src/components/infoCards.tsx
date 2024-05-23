import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

interface Artist {
    id: string;
    name: string;
    owed_amount: number;
}

interface InfoCardProps {
    title: string;
    value: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => {
    return (
        <div style={{
            minWidth: '200px',
            padding: '20px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            margin: '0 10px',
            cursor: 'pointer',
            color: 'black'
        }}>
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
};

const InfoCards: React.FC<{ totalArtists: number, totalSales: number }> = ({ totalArtists, totalSales }) => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await axios.get('/api/artists'); // Adjust the API endpoint as necessary
                setArtists(response.data);
            } catch (error) {
                console.error('Error fetching artists:', error);
            }
        };

        fetchArtists();
    }, []);

    const artistsWithOwedAmount = artists.filter(artist => artist.owed_amount > 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div onClick={() => setIsModalOpen(true)}>
                <InfoCard title="Artiste à payer" value={`${artistsWithOwedAmount.length} artiste(s) à payer`} />
            </div>
            <InfoCard title="Total Sales" value={totalSales} />
            <InfoCard title="Total Artists" value={totalArtists} />
            <Modal 
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Artistes à payer"
                style={{
                    content: {
                        maxWidth: '500px',
                        margin: 'auto',
                        borderRadius: '10px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: 'fit-content'
                    }
                }}
            >
                <div>
                    <h2 style={{ color: 'black', marginBottom: '20px' }}>Artistes à payer</h2>
                    <ul style={{ color: 'black', padding: '0', listStyleType: 'none' }}>
                        {artistsWithOwedAmount.map(artist => (
                            <li key={artist.id} style={{ marginBottom: '10px', fontSize: '16px' }}>
                                <strong>{artist.name}:</strong> <span>{artist.owed_amount.toFixed(2)} $</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <button 
                    onClick={() => setIsModalOpen(false)} 
                    style={{
                        background: 'red',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        alignSelf: 'center',
                        marginTop: '20px'
                    }}
                >
                    Fermer
                </button>
            </Modal>
        </div>
    );
};

export default InfoCards;
