// // Import any needed model functions
import { getAllCategories } from '../models/categories.js';

// define the controller function
const categoriesPageCrtler = async (req, res) => {
    const title = 'Categories';
    const categories = await getAllCategories();
    console.log('Categories:', categories);
    res.render('categories', { title, categories });
   
};  


// Export any controller functions
export {categoriesPageCrtler};