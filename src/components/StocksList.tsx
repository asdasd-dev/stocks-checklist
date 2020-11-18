import React from 'react'
import { Redirect, useParams } from 'react-router-dom'
import '../styles/StocksList.scss'
import { StockCard } from './StockCard';

interface StocksListProps { 
    categoriesData: {[categoryName: string]: string[]},
    onRemoveStock: (ticker: string) => void
}

export const StocksList: React.FC<StocksListProps> = ({ categoriesData, onRemoveStock }) => {

    let { categoryName } = useParams<{ categoryName: string }>();
    
    return (
        <div className="StocksList">
            {categoriesData[categoryName] ? 
                categoriesData[categoryName].map(stock => <StockCard onRemoveStock={onRemoveStock} key={stock} ticker={stock} />)
                : <Redirect to='/noSuchCategory' /> 
            }
        </div>
    )
}