import { CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { fetchStockPrices, fetchStockProfile } from '../App';
import { useStockData } from '../hooks/useStockData';
import '../styles/StockCard.scss'
import { StockPriceChange } from './StockPriceChange';

interface StockCardProps {
    ticker: string,
    onRemoveStock: (ticker: string) => void
}

export const StockCard: React.FC<StockCardProps> = ({ ticker, onRemoveStock }) => {

    const history = useHistory();
    
    const { isLoaded, stockProfile, stockPrices, error } = useStockData(ticker);

    if (error) {
        return <div>{error.message}</div>
    }
    
    if (!isLoaded) {
        return (
            <div>
                <CircularProgress />
            </div>
        );
    }

    const handleStockCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).tagName !== 'BUTTON') {
            history.push(`/stock/${ticker}`);
        }
    }

    return (
        <div className='StockCard' onClick={handleStockCardClick}>
            <div className="big-ticker">{ticker}</div>
            <div className="full-stock-name">
                {`Company name: ${stockProfile.name}`}
            </div>
            <div className="stock-price">
                {`$${stockPrices.c}`}
                <StockPriceChange stockPrices={stockPrices} />
            </div>
            <button type='button' onClick={e => onRemoveStock(ticker)}>X</button>
        </div>
    )
}