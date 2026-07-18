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



export { getAllCategories, getCategoryDetails, getProjectCategories, getCategoryProjects};