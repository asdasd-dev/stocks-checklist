import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import '../styles/CategoriesList.scss'

interface CategoriesListProps {
    categories: string[],
    onAddCategory: (categoryName: string) => void,
    onSelectCategory: (category: string) => void
}

export const CategoriesList: React.FC<CategoriesListProps> = ({ categories, onAddCategory, onSelectCategory }) => {

    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryInputValue, setNewCategoryInputValue] = useState('');

    const newCategoryInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isAddingCategory && newCategoryInput && newCategoryInput.current) {
            newCategoryInput.current.focus();
        }
    }, [isAddingCategory])

    const toggleIsAddingCategory = () => {
        setIsAddingCategory(!isAddingCategory);
    } 

    return (
        <div className='CategoriesList'>
            <div>Categories 
                <button 
                    disabled={isAddingCategory} 
                    className='add-category-btn' 
                    onClick={toggleIsAddingCategory}>
                    +
                </button>
            </div>
            <ul>
                {categories.map(
                    categoryName => 
                    <li key={categoryName}>
                        <Link 
                            to={`/categories/${categoryName}`}
                            onClick={e => {
                                onSelectCategory(categoryName);
                            }}>
                            {categoryName}
                        </Link>
                    </li>)}
            </ul>
            { isAddingCategory && <div className=''>
                    <input 
                        onChange={e => setNewCategoryInputValue(e.target.value)} 
                        onBlur={() => {
                            onAddCategory(newCategoryInputValue);
                            toggleIsAddingCategory();
                            setNewCategoryInputValue('');
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                (e.target as HTMLInputElement).blur();
                            }
                        }}
                        ref={newCategoryInput} 
                        value={newCategoryInputValue}
                        type='text'></input>
                </div>}
        </div>
    );
}