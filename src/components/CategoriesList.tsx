import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import '../styles/CategoriesList.scss'
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { IconButton, Input } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';



interface CategoriesListProps {
    categories: string[],
    onAddCategory: (categoryName: string) => void,
    onRemoveCategory: (categoryName: string) => void,
    selectedCategory: string
}

export const CategoriesList: React.FC<CategoriesListProps> = ({ categories, onAddCategory, onRemoveCategory, selectedCategory }) => {

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

    return (
        <div className='CategoriesList'>
            <div className='category-header'><span>Categories</span>
                <IconButton size='small' color='primary'  className='add-category-btn' type="button" 
                    onClick={toggleIsAddingCategory}
                    disabled={isAddingCategory}>
                        <AddIcon />
                </IconButton>
            </div>
            {categories.map(
                categoryName => 
                    <div 
                        className="category-item" 
                        key={categoryName}
                        style={categoryName === selectedCategory ? {backgroundColor: 'rgba(0, 0, 0, .25)'} : {}}
                        onClick={
                            e => {
                                console.log((e.target as HTMLElement).closest('button'));
                                if (!(e.target as HTMLElement).closest('button')) {
                                    history.push(`/categories/${categoryName}`)
                                } 
                            }
                        }>
                            <FolderOpenIcon /> 
                            <span> {categoryName}</span>
                            <IconButton size='small' color='secondary' className="remove-btn" type="button" onClick={() => onRemoveCategory(categoryName)}>
                                <CloseIcon />
                            </IconButton>
                    </div>
            )}
            { isAddingCategory && 
                <div className='add-category-div'>
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
                        type='text'>
                    </input>
                </div>
            }
        </div>
    );
}