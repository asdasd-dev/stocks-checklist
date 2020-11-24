import React, { useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import '../styles/StocksList.scss'
import { StockCard } from './StockCard';

interface StocksListProps { 
    categoriesData: {[categoryName: string]: string[]},
    onRemoveStock: (ticker: string) => void,
    onSelectCategory: (categoryName: string) => void
}

export const StocksList: React.FC<StocksListProps> = ({ categoriesData, onRemoveStock, onSelectCategory }) => {

    let { categoryName } = useParams<{ categoryName: string }>();

    useEffect(() => {
        onSelectCategory(categoryName);
    }, [categoryName])
    
    return (
        <div className="StocksList">
            {categoriesData[categoryName] ? 
                categoriesData[categoryName].map(stock => <StockCard onRemoveStock={onRemoveStock} key={stock} ticker={stock} />)
                : null
            }
        </div>
    )
}