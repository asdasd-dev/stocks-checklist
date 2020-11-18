import React, { useState } from 'react';
import { SearchInput } from './components/SearchInput';
import { Logo } from './components/Logo';
import { CategoriesList } from './components/CategoriesList';
import { StocksList } from './components/StocksList';

import './App.scss';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { StockFundamentals } from './components/StockFundamentals';

let initialCategories = {
  'favorites': [
    'AAPL',
    'TSLA',
    'AMZN',
    'NFLX',
    'FB'
  ]
}

const apiKey = 'sandbox_bup9l3f48v6sjkjisljg';

function App() {

  const [categoriesDataList, setCategoriesDataList] = useState<{[categoryName: string]: string[]}>(initialCategories);  
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('favorites');

  const params = useParams();

  const onAddCategory = (categoryName: string) => {
    if (categoryName !== '' && !categoriesDataList[categoryName])
      setCategoriesDataList({
        ...categoriesDataList,
        [categoryName]: []
      })
  }

  const onAddStock = (ticker: string) => {
    if(!categoriesDataList[selectedCategoryName].includes(ticker)) {
      setCategoriesDataList({
        ...categoriesDataList,
        [selectedCategoryName]: [...categoriesDataList[selectedCategoryName], ticker]
      })
    }
  }

  const onRemoveStock = (ticker: string) => {
    let newCategoriesDataList = {
      ...categoriesDataList
    }
    newCategoriesDataList[selectedCategoryName] = newCategoriesDataList[selectedCategoryName].filter(elem => elem != ticker)
    setCategoriesDataList(newCategoriesDataList);
  }

  const onSelectCategory = (category: string) => {
    setSelectedCategoryName(category);
  }

  return (
    <div className="App">
      <div className="grid">
        <Logo />
        <SearchInput 
          onAddStock={onAddStock}/>
        <div className="scrollable-container">
          <CategoriesList 
            onAddCategory={onAddCategory} 
            categories={Object.keys(categoriesDataList)}
            onSelectCategory={onSelectCategory}
            selectedCategory={selectedCategoryName}/>
        </div>
        <div className="scrollable-container background-secondary">
          <Switch>
            <Route path='/categories/:categoryName'>
              <StocksList 
                categoriesData={categoriesDataList}
                onRemoveStock={onRemoveStock}/>
            </Route>
            <Route path='/stock/:ticker'>
              <StockFundamentals />
            </Route>
            <Redirect to='/categories/favorites' />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export const fetchStockProfile = (ticker: string) => {
  return (
    fetch('https://finnhub.io/api/v1/stock/profile?symbol=' + ticker + '&token=' + apiKey)
      .then(response => response.json())
  )
}

export const fetchSupportedStocksList = () => {
  return (
    fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=' + apiKey)
      .then(response => response.json())
  )
}

export const fetchStockPrices = (ticker: string) => {
  return (
    fetch('https://finnhub.io/api/v1/quote?symbol=' + ticker + '&token=' + apiKey)
      .then(response => response.json())
  )
}

export default App;
