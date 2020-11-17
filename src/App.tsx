import React, { useState } from 'react';
import { SearchInput } from './components/SearchInput';
import { Logo } from './components/Logo';
import { CategoriesList } from './components/CategoriesList';
import { StocksList } from './components/StocksList';

import './App.scss';

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

  const onAddCategory = (categoryName: string) => {
    if (!categoriesDataList[categoryName])
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

  const onSelectCategory = (category: string) => {
    setSelectedCategoryName(category);
  }

  return (
    <div className="App">
        <Logo />
        <SearchInput api={apiKey} onAddStock={onAddStock}/>
        <CategoriesList 
          onAddCategory={onAddCategory} 
          categories={Object.keys(categoriesDataList)}
          onSelectCategory={onSelectCategory}/>
        <StocksList 
          stocks={categoriesDataList[selectedCategoryName]}
          api={apiKey}/>
    </div>
  );
}

export default App;
