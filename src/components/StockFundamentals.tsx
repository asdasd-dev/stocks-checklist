import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchStockPrices, fetchStockProfile } from '../App';

import '../styles/StockFundamentals.scss'

interface companyProfileConfig {
    loaded: boolean,
    value: {
        [propName: string]: string
    } | null,
    error: Error | null
}

export const StockFundamentals: React.FC = () => {

    const params = useParams<{ ticker: string }>();
    
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [stockProfile, setStockProfile] = useState<{ [propName: string]: string } | null>(null);
    const [stockPrices, setStockPrices] = useState<{ [propName: string]: number } | null>(null)

    useEffect(() => {
        Promise.all([fetchStockProfile(params.ticker), fetchStockPrices(params.ticker)])
            .then(
                results => {
                    setIsLoaded(true);
                    setStockProfile(results[0]);
                    setStockPrices(results[1])},
                error => {
                    setError(error())
                })
    }, [])

    let content;

    if (!isLoaded) {
        content = <p>Loading...</p>
    }
    else if (error){
        content = <p>Error</p>
    }
    else if (stockProfile && stockPrices) {
        content = (
            <>
                <h2>
                    {stockProfile.name} ({params.ticker})
                </h2>
                <div className='price-section'>
                    <span className='current-price'>{stockPrices.c}</span>
                </div>
                <p>{stockProfile.description}</p>
            </>
        )
    }

    return (
        <div className='StockFundamentals'>
            {content}
        </div>
    )
}