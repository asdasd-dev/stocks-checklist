import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSupportedStocks } from '../hooks/useSupportedStocks'
import { supportedStockData } from '../hooks/useSupportedStocks'
import { IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import '../styles/SearchInput.scss'

 interface SearchInputProps {
    onAddStock: (ticker: string) => void
 }

export const SearchInput: React.FC<SearchInputProps> = ({ onAddStock }) => {

    const history = useHistory();

    const searchInput = useRef<HTMLInputElement>(null);
    const blurTimeoutRef = useRef<NodeJS.Timeout>();

    const { isLoaded: isSupportedStocksLoaded, supportedStocks } = useSupportedStocks();

    const [searchValue, setSearchValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [searchResults, setSearchResults] = useState<supportedStockData[]>([]);

    useEffect(() => {
        if (isSupportedStocksLoaded) {
            if (searchValue === '') {
                setSearchResults([]);
                return;
            }
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
                    if (blurTimeoutRef.current) {
                        clearTimeout(blurTimeoutRef.current);
                    }
                }} 
                onBlur={e => {
                    blurTimeoutRef.current = setTimeout(() => setIsFocused(false), 1000);
                }}
                value={searchValue} 
                onChange={e => setSearchValue(e.target.value)}/>
            {isFocused && searchResults.length > 0 ?
                <div className="found-stocks" style={foundStocksStyle}>
                    {searchResults.map(stock => (
                        <div 
                            key={stock.symbol} 
                            onClick={e => {
                                if (!(e.target as HTMLElement).closest('button')) {
                                    history.push(`/stock/${stock.symbol}`)
                                }
                            }}>
                            <span>{stock.symbol}</span> 
                            <span className='found-stock-description'>{stock.description}</span> 
                            <IconButton size='small' color='primary'  className='add-stock-btn' type="button" 
                                onClick={() => {
                                    onAddStock(stock.symbol);
                                    searchInput.current?.focus();
                                }}>
                                    <AddIcon />
                            </IconButton>
                        </div>
                    ))}
                </div>
            : null
            }
        </div>
    )
}

function* generateStocksMatches(stocksList: supportedStockData[], regexp: RegExp) {
    for (let i = 0; i < stocksList.length; i++) {
        if (regexp.test(stocksList[i].symbol)) {
            yield stocksList[i];
        }
    }
}