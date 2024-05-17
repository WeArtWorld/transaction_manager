import React from 'react';

interface TopCardProps {
    label: string;
    value: string;
}

const TopCard: React.FC<TopCardProps> = ({ label, value }) => {
    return (
        <div className="bg-white border p-4 rounded-lg shadow min-w-[200px]"> 
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-gray-600">{label}</p>
            </div>
        </div>
    );
};

const TopCards: React.FC = () => {
    return (    
        <div className="flex flex-wrap justify-center gap-4 p-4">
            <TopCard label="Daily Revenue" value="$7,846" />
            <TopCard label="YTD Revenue" value="$1,437,876" />
            <TopCard label="Customers" value="11,437" />
        </div>
    );
};

export default TopCards;