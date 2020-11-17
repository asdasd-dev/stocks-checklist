import React, { ReactComponentElement } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/StocksList.scss'
import { StockCard } from './StockCard';

interface StocksListProps { 
    stocks: string[],
    api: string
}

export const StocksList: React.FC<StocksListProps> = ({ stocks, api }) => {
    let params = useParams();
    return (
        <div className="StocksList">
            {stocks.map(stock => <StockCard key={stock} ticker={stock} api={api} />)}
        </div>
    )
}