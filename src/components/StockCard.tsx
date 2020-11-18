import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { fetchStockPrices, fetchStockProfile } from '../App';
import '../styles/StockCard.scss'

interface StockCardProps {
    ticker: string,
    api: string,
    onRemoveStock: (ticker: string) => void
}

interface companyProfileConfig {
    loaded: boolean,
    value: {
        [propName: string]: string
    } | null,
    error: Error | null
}

export const StockCard: React.FC<StockCardProps> = ({ ticker, api, onRemoveStock }) => {
    
    const [currentPrice, setCurrentPrice] = useState({loaded: false, value: null, error: null});

    const history = useHistory();

    useEffect(() => {
        fetchStockPrices(ticker)
            .then(result => {
                setCurrentPrice({
                    loaded: true,
                    value: result.c, // c - current price
                    error: null
                });
            }, error => {
                setCurrentPrice({
                    loaded: true,
                    value: null,
                    error: error
                });
            })
    }, []);

    const [companyProfile, setCompanyProfile] = useState<companyProfileConfig>({loaded: false, value: null, error: null});

    useEffect(() => {
        fetchStockProfile(ticker)
            .then(result => {
                setCompanyProfile({
                    loaded: true,
                    value: result,
                    error: null
                })
                console.log(result);
            }, error => {
                setCompanyProfile({
                    loaded: true,
                    value: null,
                    error: error
                });
            })
    }, []);

    return (
        <div className='StockCard' onClick={() => history.push(`/stock/${ticker}`)}>
            <div className="big-ticker">{ticker}</div>
            <div className="full-stock-name">
                {companyProfile.error ? 'Error' :
                    !companyProfile.loaded ? 'Loading...' :
                        companyProfile.value !== null && `Company name: ${companyProfile.value.name}`
                }
            </div>
            <div className="stock-price">
                {currentPrice.error ? 'Error' :
                    !currentPrice.loaded ? 'Loading...' :
                        '$' + currentPrice.value
                }
            </div>
            <button type='button' onClick={e => onRemoveStock(ticker)}>X</button>
        </div>
    )
}