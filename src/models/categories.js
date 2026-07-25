import db from './db.js'

const getAllCategories = async() => {
    const query = `
    SELECT 
      category_id, 
      category_name
    FROM public.categories
    ORDER BY category_id
    `;

  
        const result = await db.query(query);
        return result.rows;
 
}

const getCategoryDetails = async(category_id)=>{
    const query = `
    SELECT 
      category_id, 
      category_name
    FROM public.categories
    WHERE category_id = $1
    ORDER BY category_id
   
    `;

     const queryParams = [category_id];
    
      const result = await db.query(query, queryParams);
      return result.rows.length > 0 ? result.rows[0] : null;

}

const getCategoryProjects = async(category_id) =>{
  const query = `
        SELECT
          p.project_id,
          p.organization_id,
          p.title,
          p.description,
          p.location,
          p.project_date
        FROM public.service_project p
        JOIN public.project_category pc ON p.project_id = pc.project_id
        JOIN public.categories c ON c.category_id = pc.category_id
        WHERE pc.category_id = $1`

        const queryParams = [category_id];
    
        const result = await db.query(query, queryParams);
        return result.rows;

      ;
}

const getProjectCategories = async(project_id) =>{
  const query = `
        SELECT
        c.category_id, 
        c.category_name
        FROM public.service_project p
        JOIN public.project_category pc ON p.project_id = pc.project_id
        JOIN public.categories c ON c.category_id = pc.category_id
        WHERE pc.project_id = $1`

        const queryParams = [project_id];
    
        const result = await db.query(query, queryParams);
        return result.rows;

      ;
}
const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

// create a new information with the data provided by the user
const createNewCategory = async(categoryName) =>{
  const query = `
  INSERT INTO categories (category_name)
  VALUES($1)
  RETURNING category_id
`;

 const queryParams = [categoryName];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0].category_id);
    }

    return result.rows[0].category_id;
}
// change what is in the database
const updateCategory =  async(categoryName, categoryId) => {
  const query =`
        UPDATE categories
        SET category_name = $1
        WHERE category_id =$2
        RETURNING category_id
  `;

   const queryParams = [categoryName, categoryId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to update category');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('update Category with ID:', result.rows[0].category_id);
    }

    return result.rows[0].category_id;
}


export { getAllCategories, getCategoryDetails, getProjectCategories, getCategoryProjects, updateCategoryAssignments, createNewCategory, updateCategory};