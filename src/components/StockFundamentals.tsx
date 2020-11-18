import { CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchStockPrices, fetchStockProfile } from '../App';
import { useStockData } from '../hooks/useStockData';

import '../styles/StockFundamentals.scss'
import { StockPriceChange } from './StockPriceChange';

export const StockFundamentals: React.FC = () => {

    const params = useParams<{ ticker: string }>();
    
    const { isLoaded, stockProfile, stockPrices, error } = useStockData(params.ticker, [params]);

    if (!isLoaded) {
        return (
            <div>
                <CircularProgress />
            </div>
        )
    }

    if (error) {
        return <p>{error.message}</p>
    }

    return (
        <div className='StockFundamentals'>
            <h2>
                {stockProfile.name} ({stockProfile.ticker})
            </h2>
            <div className='price-section'>
                <span className='current-price'>{stockPrices.c}</span>
                <StockPriceChange stockPrices={stockPrices} />
            </div>
            <p>{stockProfile.description}</p>
        </div>
    )
}