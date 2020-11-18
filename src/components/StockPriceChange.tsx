import React from 'react'

interface StockPriceChangeProps {
    stockPrices: { [propName: string]: number }
}

export const StockPriceChange: React.FC<StockPriceChangeProps> = ({ stockPrices }) => {

    const prevClosePriceDiff: number = stockPrices.c - stockPrices.pc
    const prevClosePriceDiffPercent: number = prevClosePriceDiff / stockPrices.c * 100;
    const prevClosePriceDiffStyle: React.CSSProperties = {
        color: prevClosePriceDiff > 0 ? 'green' : 'red' 
    }

    return (
        <span className='StockPriceChange' style={prevClosePriceDiffStyle}>
            {prevClosePriceDiff > 0 && '+'}{prevClosePriceDiff.toFixed(2)}
            ({prevClosePriceDiffPercent > 0 && '+'}{prevClosePriceDiffPercent.toFixed(2)}%)
        </span>
    )
}