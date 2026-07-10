import db from './db.js'

const getAllCategories = async() => {
    const query = `
    SELECT 
      category_id, 
      category_name
    FROM public.categories
    ORDER BY category_id;
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllCategories:', error.message);
        return [];
    }
}

export { getAllCategories };