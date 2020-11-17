import React, { useEffect, useRef, useState } from 'react'
import '../styles/SearchInput.scss'

 interface SearchInputProps {
    api: string,
    onAddStock: (ticker: string) => void
 }

 interface StockData {
         description: string ,
         displaySymbol: string,
         symbol: string,
         type: string,
         currency: string
 }

 function* generateStocksMatches(stocksList: StockData[], regexp: RegExp) {
     for (let i = 0; i < stocksList.length; i++) {
         if (regexp.test(stocksList[i].symbol)) {
             yield stocksList[i];
         }
     }
}

export const SearchInput: React.FC<SearchInputProps> = ({ api, onAddStock }) => {

    const [searchValue, setSearchValue] = useState('');
    const [stocksList, setStocksList] = useState([]);
    const [isStocksLoaded, setIsStocksLoaded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [foundStocks, setFoundStocks] = useState<StockData[]>([]);
    const [blurTimeout, setBlurTimeout] = useState<NodeJS.Timeout | null>(null);

    const searchInput = useRef<HTMLInputElement>(null);
    const foundStocksDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isStocksLoaded && searchValue != '') {
            let matchGenerator = generateStocksMatches(stocksList, new RegExp(`^${searchValue}`, 'i'))
            let matchesArray: StockData[] = [];
            for(let i = 0; i < 5; i++) {
                let result = matchGenerator.next();
                if (result.done) {
                    break;
                }
                matchesArray.push(result.value);
            }
            setFoundStocks(matchesArray);
        }
    }, [searchValue, isStocksLoaded, isFocused])

    const fetchStocks = () => {
        if(!isStocksLoaded) {
            fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=' + api)
                .then(response => response.json())
                .then(result => {
                    setStocksList(result);
                    setIsStocksLoaded(true)
                })
        }
    }

    const inputRect = searchInput.current?.getBoundingClientRect();
    const foundStocksRect = foundStocksDiv.current?.getBoundingClientRect()

    const foundStocksStyle: React.CSSProperties = {
        top: inputRect?.bottom as number + 3,
        left: (foundStocksRect?.width as number - (inputRect?.width  as number)) / 2
    }


    return (
        <div className="SearchInput">
            <input 
                type="text" 
                ref={searchInput}
                onFocus={e => {
                    if (blurTimeout) {
                        clearTimeout(blurTimeout);
                        setBlurTimeout(null);
                    }
                    fetchStocks();
                    setIsFocused(true);
                }} 
                onBlur={e => {
                    setBlurTimeout(setTimeout(() => setIsFocused(false), 2000));
                }}
                value={searchValue} 
                onChange={e => setSearchValue(e.target.value)}/>
            {isFocused && foundStocks.length > 0 ?
                <div className="found-stocks" style={foundStocksStyle}>
                    {foundStocks.map(stock => (
                        <div key={stock.symbol}>
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