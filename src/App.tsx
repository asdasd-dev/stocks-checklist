import React, { useEffect, useState } from 'react';
import { SearchInput } from './components/SearchInput';
import { Logo } from './components/Logo';
import { CategoriesList } from './components/CategoriesList';
import { StocksList } from './components/StocksList';

import './App.scss';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { StockFundamentals } from './components/StockFundamentals';

const apiKey = 'sandbox_bup9l3f48v6sjkjisljg';

function App() {

  const params = useParams<{ categoryName: string }>();

  const [categoriesDataList, setCategoriesDataList] = useState<{[categoryName: string]: string[]}>({});  
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, [])

  const onAddCategory = (categoryName: string) => {
    fetch('http://localhost:8080/api/categories', {
      method: 'POST',
      credentials: 'include',
      body: categoryName,
    }).then(response => response)
    .then(result => fetchCategories())
  }

  const onAddStock = (ticker: string) => {
    fetch('http://localhost:8080/api/categories/' + selectedCategoryName, {
      method: 'POST',
      credentials: 'include',
      body: ticker,
    }).then(response => response)
    .then(result => fetchCategories())
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

  const fetchCategories = () => {
    fetch('http://localhost:8080/api/categories', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(categories => {
        setCategoriesDataList(categories);
      })
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
            selectedCategory={selectedCategoryName}/>
        </div>
        <div className="scrollable-container background-secondary">
          <Switch>
            <Route path='/categories/:categoryName'>
              <StocksList 
                categoriesData={categoriesDataList}
                onRemoveStock={onRemoveStock}
                onSelectCategory={onSelectCategory}/>
            </Route>
            <Route path='/stock/:ticker'>
              <StockFundamentals />
            </Route>
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
