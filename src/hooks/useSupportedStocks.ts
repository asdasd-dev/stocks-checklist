import { useState, useEffect } from 'react'
import { fetchSupportedStocksList } from '../App'

export interface supportedStockData {
    description: string ,
    displaySymbol: string,
    symbol: string,
    type: string,
    currency: string
}

export function useSupportedStocks() {

    const [isLoaded, setIsLoaded] = useState(false);
    const [supportedStocks, setSupportedStocks] = useState<supportedStockData[]>([]);
    
    useEffect(() => {
        fetchSupportedStocksList()
            .then(result => {
                setSupportedStocks(result);
                setIsLoaded(true);
            })
    }, []);

    return { isLoaded, supportedStocks }
}