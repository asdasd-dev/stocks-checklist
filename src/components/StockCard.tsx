import React, { useEffect, useState } from 'react'
import '../styles/StockCard.scss'

interface StockCardProps {
    ticker: string,
    api: string
}

interface companyProfileConfig {
    loaded: boolean,
    value: {
        [propName: string]: string
    } | null,
    error: Error | null
}

export const StockCard: React.FC<StockCardProps> = ({ ticker, api }) => {
    
    const [currentPrice, setCurrentPrice] = useState({loaded: false, value: null, error: null});

    useEffect(() => {
        fetch('https://finnhub.io/api/v1/quote?symbol=' + ticker + '&token=' + api)
            .then(response => response.json())
            .then(result => {
                setCurrentPrice({
                    loaded: true,
                    value: result.c,
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
        fetch('https://finnhub.io/api/v1/stock/profile2?symbol=' + ticker + '&token=' + api)
            .then(response => response.json())
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
        <div className='StockCard'>
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
        </div>
    )
}