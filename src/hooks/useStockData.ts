import { useState, useEffect } from 'react'
import { fetchStockPrices, fetchStockProfile } from '../App';

export function useStockData(ticker: string, dependencies: React.DependencyList = []) {

    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [stockProfile, setStockProfile] = useState<{ [propName: string]: string }>({});
    const [stockPrices, setStockPrices] = useState<{ [propName: string]: number }>({})

    useEffect(() => {
        setIsLoaded(false);
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
    }, dependencies)
    
    return { isLoaded, stockProfile, stockPrices, error }
}