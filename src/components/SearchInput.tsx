import { CircularProgress } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { fetchSupportedStocksList } from '../App';
import { useSupportedStocks } from '../hooks/useSupportedStocks';
import { supportedStockData } from '../hooks/useSupportedStocks'
import '../styles/SearchInput.scss'

 interface SearchInputProps {
    onAddStock: (ticker: string) => void
 }

 function* generateStocksMatches(stocksList: supportedStockData[], regexp: RegExp) {
     for (let i = 0; i < stocksList.length; i++) {
         if (regexp.test(stocksList[i].symbol)) {
             yield stocksList[i];
         }
     }
}

export const SearchInput: React.FC<SearchInputProps> = ({ onAddStock }) => {

    const history = useHistory();

    const searchInput = useRef<HTMLInputElement>(null);
    const foundStocksDiv = useRef<HTMLDivElement>(null);

    const [searchValue, setSearchValue] = useState('');

    const { isLoaded: isSupportedStocksLoaded, supportedStocks } = useSupportedStocks();

    const [isFocused, setIsFocused] = useState(false);
    const [searchResults, setSearchResults] = useState<supportedStockData[]>([]);

    useEffect(() => {
        console.log('effect when isLoaded = ', isSupportedStocksLoaded, 'and searchValue = ', searchValue);
        if (isSupportedStocksLoaded && searchValue != '') {
            let matchGenerator = generateStocksMatches(supportedStocks, new RegExp(`^${searchValue}`, 'i'))
            let matchesArray = [];
            while (matchesArray.length < 5) {
                let nextValue = matchGenerator.next();
                if (nextValue.done)
                    break;
                matchesArray.push(nextValue.value);
            }
            setSearchResults(matchesArray as supportedStockData[]);
        }
    }, [searchValue, isSupportedStocksLoaded])

    
    const inputRect = searchInput.current?.getBoundingClientRect();
    const foundStocksStyle: React.CSSProperties = {
        top: inputRect?.bottom as number + 3
    }


    return (
        <div className="SearchInput">
            <input 
                type="text" 
                ref={searchInput}
                onFocus={e => {
                    setIsFocused(true);
                }} 
                onBlur={e => {
                    setTimeout(() => setIsFocused(false), 300);
                }}
                value={searchValue} 
                onChange={e => setSearchValue(e.target.value)}/>
            {isFocused && searchResults.length > 0 ?
                <div className="found-stocks" style={foundStocksStyle}>
                    {searchResults.map(stock => (
                        <div 
                            key={stock.symbol} 
                            onClick={e => {
                                if ((e.target as HTMLElement).tagName != 'BUTTON') {
                                    history.push(`/stock/${stock.symbol}`)
                                }
                            }}>
                            <span>{stock.symbol}</span> 
                            <span className='found-stock-description'>{stock.description}</span> 
                            <button 
                                type='button' 
                                onClick={() => {
                                    searchInput.current?.focus();
                                    onAddStock(stock.symbol);
                                    console.log('clicked');
                                }}
                                className='add-stock-btn'>Add to checklist</button>
                        </div>
                    ))}
                </div>
            : null
            }
        </div>
    )
}