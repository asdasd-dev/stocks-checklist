import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import '../styles/CategoriesList.scss'
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

interface CategoriesListProps {
    categories: string[],
    onAddCategory: (categoryName: string) => void,
    selectedCategory: string
}

export const CategoriesList: React.FC<CategoriesListProps> = ({ categories, onAddCategory, selectedCategory }) => {

    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryInputValue, setNewCategoryInputValue] = useState('');

    const newCategoryInput = useRef<HTMLInputElement>(null);

    const history = useHistory();
    const params = useParams<{categoryName: string}>();

    useEffect(() => {
        if (isAddingCategory && newCategoryInput && newCategoryInput.current) {
            newCategoryInput.current.focus();
        }
    }, [isAddingCategory])

    const toggleIsAddingCategory = () => {
        setIsAddingCategory(!isAddingCategory);
    } 

    console.log(selectedCategory)

    return (
        <div className='CategoriesList'>
            <div className='category-header'>Categories 
                <button 
                    disabled={isAddingCategory} 
                    className='add-category-btn' 
                    onClick={toggleIsAddingCategory}>
                    +
                </button>
            </div>
            {categories.map(
                categoryName => 
                    <div 
                        className="category-item" 
                        key={categoryName}
                        style={categoryName === selectedCategory ? {backgroundColor: 'rgba(0, 0, 0, .25)'} : {}}
                        onClick={
                            e => {
                                history.push(`/categories/${categoryName}`)
                            }
                        }>
                            <FolderOpenIcon /> 
                            <span> {categoryName}</span>
                    </div>
            )}
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