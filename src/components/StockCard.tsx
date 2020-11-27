import React from 'react'
import { useHistory } from 'react-router-dom';

import { CircularProgress } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { useStockData } from '../hooks/useStockData';
import { StockPriceChange } from './StockPriceChange';

import '../styles/StockCard.scss'


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
        if (!(e.target as HTMLElement).closest('button')) {
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
            <IconButton size='small' color='secondary' className="remove-btn" type="button" onClick={() => onRemoveStock(ticker)}>
                <CloseIcon />
            </IconButton>
        </div>
    )
}