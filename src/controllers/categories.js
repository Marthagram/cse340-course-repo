// // Import any needed model functions
import { getAllCategories, getCategoryDetails} from '../models/categories.js';
import { getCategoryProjects } from '../models/categories.js';
// define the controller function
const categoriesPageCrtler = async (req, res) => {
    const title = 'Categories';
    const categories = await getAllCategories();
    console.log('Categories:', categories);
    res.render('categories', { title, categories});
   
};  

const showCategoryDetails = async (req, res) => {
 const categoryId = req.params.id;
    const title = 'Specific Category Projects';
    const categoryDetails = await getCategoryDetails(categoryId);
    const categoryProjects = await getCategoryProjects(categoryId)
    res.render('category', { title, categoryDetails, categoryProjects });

}




// Export any controller functions
export {categoriesPageCrtler, showCategoryDetails};