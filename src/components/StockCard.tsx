import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { fetchStockPrices, fetchStockProfile } from '../App';
import '../styles/StockCard.scss'
import { StockPriceChange } from './StockPriceChange';

interface StockCardProps {
    ticker: string,
    onRemoveStock: (ticker: string) => void
}

export const StockCard: React.FC<StockCardProps> = ({ ticker, onRemoveStock }) => {

    const history = useHistory();
    
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [stockProfile, setStockProfile] = useState<{ [propName: string]: string }>({});
    const [stockPrices, setStockPrices] = useState<{ [propName: string]: number }>({})

    useEffect(() => {
        Promise.all([fetchStockProfile(ticker), fetchStockPrices(ticker)])
            .then(
                results => {
                    setStockProfile(results[0]);
                    setStockPrices(results[1]);
                    setIsLoaded(true)
                },
                error => {
                    setError(error)
                })
    }, [])

    if (error) {
        return <div>{error.message}</div>
    }
    
    if (!isLoaded) {
        return <div>Loading...</div>
    }

    return (
        <div 
            className='StockCard' 
            onClick={e => {
                    if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                        history.push(`/stock/${ticker}`);
                    }
            }}>
                <div className="big-ticker">{ticker}</div>
                <div className="full-stock-name">
                    {`Company name: ${stockProfile.name}`}
                </div>
                <div className="stock-price">
                    {`$${stockPrices?.c}`}
                    <StockPriceChange stockPrices={stockPrices} />
                </div>
                <button type='button' onClick={e => onRemoveStock(ticker)}>X</button>
        </div>
    )
}