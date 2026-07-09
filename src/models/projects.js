import db from './db.js'

const getAllOrganizationProjects = async() => {
    const query = `
    SELECT 
        p.project_id,
        o.name AS organization_name,
        p.title,
        p.description,
        p.location,
        p.project_date
    FROM public.service_project p
    JOIN public.organization o ON p.organization_id = o.organization_id
    ORDER BY o.organization_id, p.project_date;
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error in getAllOrganizationProjects:', error.message);
        return [];
    }
}

export { getAllOrganizationProjects };