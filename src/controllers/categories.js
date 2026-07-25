// import validation rules from express-validator
import { body, validationResult } from 'express-validator';
// Import any needed model functions
import { getAllCategories, getCategoryDetails, getCategoryProjects, getProjectCategories, updateCategoryAssignments, createNewCategory, updateCategory} from '../models/categories.js';
import { getProjectDetails} from '../models/projects.js';

const categoryValidation = [
    body('categoryName')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
 
];

// define the controller function
const categoriesPageCrtler = async (req, res) => {
    const title = 'Categories';
    const categories = await getAllCategories();
    console.log('Categories:', categories);
    res.render('categories', { title, categories});
   
};  

const showCategoryDetails = async (req, res) => {
 const categoryId = parseInt(req.params.id);
    const title = 'Specific Category Projects';
    const categoryDetails = await getCategoryDetails(categoryId);
    const categoryProjects = await getCategoryProjects(categoryId);
    res.render('category', { title, categoryDetails, categoryProjects });
    // res.render only feeds the GET page. It dies as soon as the page loads.
}

const showAssignCategoriesForm = async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const title = 'Assign Categories to Project';
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const projectCategories = await getProjectCategories(projectId)
    res.render('assign-categories', { title, projectDetails, categories, projectCategories});
    // we pass the projectId to the template so we can use it in the form action because we need to know which project we are assigning categories to.

}


const processAssignCategoriesForm = async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = async (req, res) => {
  
    const title = 'Add New Category';

res.render('new-category', {title})
}

const processNewCategoryForm = async (req, res) => {
      // Check for validation errors
        const results = validationResult(req);
        if (!results.isEmpty()) {
            // Validation failed - loop through errors
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });
    
            // Redirect back to the new organization form
            return res.redirect('/new-category');
        }
         
        const {categoryName} = req.body;
        const categoryId = await createNewCategory(categoryName);
        req.flash('success', 'Category added successfully!');
        res.redirect(`/category/${categoryId }`);
};

// if editing a form, it is best to fetch the existing data from the database into the form field readt to be edited 
const showEditCategoryForm = async(req, res) =>{
    const categoryId = parseInt(req.params.id);
    const title = 'Edit Existing Category'
    const categoryDetails = await getCategoryDetails(categoryId);
    res.render('edit-category', {title, categoryDetails});
  

}

const processEditCategoryForm = async(req, res) =>{
    const categoryId = parseInt(req.params.id);
      // Check for validation errors
const results = validationResult(req);
if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
        req.flash('error', error.msg);
    });

    // Redirect back to the edit organization form
    return res.redirect('/edit-category/' + req.params.id);
}


    const { categoryName } = req.body;
      console.log("BODY:", req.body);
    await updateCategory(categoryName, categoryId);
    
    // Set a success flash message
    req.flash('success', 'Category updated successfully!');

    res.redirect(`/category/${categoryId}`);


}


// Export any controller functions
export {categoriesPageCrtler, showCategoryDetails, showAssignCategoriesForm, processAssignCategoriesForm, categoryValidation, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm};