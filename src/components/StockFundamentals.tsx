import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchStockPrices, fetchStockProfile } from '../App';

import '../styles/StockFundamentals.scss'
import { StockPriceChange } from './StockPriceChange';

export const StockFundamentals: React.FC = () => {

    const params = useParams<{ ticker: string }>();
    
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [stockProfile, setStockProfile] = useState<{ [propName: string]: string }>({});
    const [stockPrices, setStockPrices] = useState<{ [propName: string]: number }>({})

    useEffect(() => {
        Promise.all([fetchStockProfile(params.ticker), fetchStockPrices(params.ticker)])
            .then(
                results => {
                    setIsLoaded(true);
                    setStockProfile(results[0]);
                    setStockPrices(results[1])},
                error => {
                    setError(error)
                })
    }, [params.ticker])


    if (!isLoaded) {
        return <p>Loading...</p>
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