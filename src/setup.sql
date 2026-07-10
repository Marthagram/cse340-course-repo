DROP TABLE IF EXISTS organization CASCADE;
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

DROP TABLE IF EXISTS service_project CASCADE;

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id) 
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);


INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
(1, 'Downtown Sidewalk Repair', 'Replace cracked sidewalks and add ADA ramps in the downtown district.', 'Main St & 4th Ave, Boise, ID', '2026-08-10'),
(1, 'Community Center Roof Upgrade', 'Install solar panels and repair roofing for the Westside Community Center.', 'Westside Community Center, Boise, ID', '2026-09-01'),
(1, 'Playground Safety Renovation', 'Upgrade playground equipment and install impact-safe surfaces at Riverside Park.', 'Riverside Park, Boise, ID', '2026-07-25'),
(1, 'Low-Income Housing Build', 'Volunteer construction crew to frame 2 new affordable housing units.', 'Habitat Site, 820 Elm St, Boise, ID', '2026-10-12'),
(1, 'Bridge Mural & Beautification', 'Repair bridge structure and coordinate with artists for community mural.', 'Boise River Greenbelt Bridge', '2026-11-03');

INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
(2, 'School Garden Installation', 'Build 10 raised garden beds and teach students about urban farming.', 'Lincoln Elementary School', '2026-08-20'),
(2, 'Composting Education Workshop', 'Free workshop on home composting and reducing food waste.', 'GreenHarvest Farm, 412 N 5th St', '2026-07-18'),
(2, 'Neighborhood Seed Swap', 'Community event to exchange seeds and gardening tools.', 'City Park Pavilion', '2026-09-14'),
(2, 'Food Desert Mobile Market', 'Weekly mobile market bringing fresh produce to underserved neighborhoods.', 'North Boise Community Center', '2026-08-05'),
(2, 'Rainwater Harvesting System Build', 'Install rain barrels and irrigation for 5 community gardens.', 'Various Community Gardens, Boise', '2026-10-02');

INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
(3, 'Winter Coat Drive & Distribution', 'Collect and distribute winter coats to families in need.', 'UnityServe Warehouse, 1200 W Main St', '2026-11-20'),
(3, 'Senior Center Meal Delivery', 'Volunteers deliver meals and provide companionship to seniors.', 'Boise Senior Center', '2026-08-12'),
(3, 'Homeless Shelter Renovation Day', 'Paint, clean, and repair the downtown homeless shelter.', 'Hope Shelter, 550 S Capitol Blvd', '2026-09-07'),
(3, 'After-School Tutoring Program', 'Provide free tutoring and mentorship for K-8 students.', 'UnityServe Learning Lab', '2026-09-01'),
(3, 'Park Cleanup & Tree Planting', 'Remove trash and plant 50 new trees in Julia Davis Park.', 'Julia Davis Park', '2026-10-19');

SELECT * FROM service_project;

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

INSERT INTO categories(category_name) VALUES
('Environmental'),
('Education'),
('Community Service'),
('Health and Wellness');


SELECT * FROM categories;



-- 2. JOIN TABLE: links projects to categories
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id), -- prevents duplicates
	
    CONSTRAINT fk_service_project
        FOREIGN KEY (project_id) 
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,
		
    CONSTRAINT fk_categories
        FOREIGN KEY (category_id) 
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

INSERT INTO project_category (project_id, category_id) VALUES

(1, 1), 
(2, 1),  
(3, 1), 
(4, 1), 
(5, 1), 

(6, 1), 
(6, 2), 
(7, 1), 
(7, 2), 
(8, 1),         
(9, 1),         
(10, 1),        

(11, 3), 
(11, 4), 		
(12, 4),          
(13, 3),          
(14, 2),          
(15, 1);        DROP TABLE IF EXISTS organization CASCADE;
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

DROP TABLE IF EXISTS service_project CASCADE;

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id) 
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);


INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
(1, 'Downtown Sidewalk Repair', 'Replace cracked sidewalks and add ADA ramps in the downtown district.', 'Main St & 4th Ave, Boise, ID', '2026-08-10'),
(1, 'Community Center Roof Upgrade', 'Install solar panels and repair roofing for the Westside Community Center.', 'Westside Community Center, Boise, ID', '2026-09-01'),
(1, 'Playground Safety Renovation', 'Upgrade playground equipment and install impact-safe surfaces at Riverside Park.', 'Riverside Park, Boise, ID', '2026-07-25'),
(1, 'Low-Income Housing Build', 'Volunteer construction crew to frame 2 new affordable housing units.', 'Habitat Site, 820 Elm St, Boise, ID', '2026-10-12'),
(1, 'Bridge Mural & Beautification', 'Repair bridge structure and coordinate with artists for community mural.', 'Boise River Greenbelt Bridge', '2026-11-03');

INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
(2, 'School Garden Installation', 'Build 10 raised garden beds and teach students about urban farming.', 'Lincoln Elementary School', '2026-08-20'),
(2, 'Composting Education Workshop', 'Free workshop on home composting and reducing food waste.', 'GreenHarvest Farm, 412 N 5th St', '2026-07-18'),
(2, 'Neighborhood Seed Swap', 'Community event to exchange seeds and gardening tools.', 'City Park Pavilion', '2026-09-14'),
(2, 'Food Desert Mobile Market', 'Weekly mobile market bringing fresh produce to underserved neighborhoods.', 'North Boise Community Center', '2026-08-05'),
(2, 'Rainwater Harvesting System Build', 'Install rain barrels and irrigation for 5 community gardens.', 'Various Community Gardens, Boise', '2026-10-02');

INSERT INTO service_project (organization_id, title, description, location, project_date) VALUES
(3, 'Winter Coat Drive & Distribution', 'Collect and distribute winter coats to families in need.', 'UnityServe Warehouse, 1200 W Main St', '2026-11-20'),
(3, 'Senior Center Meal Delivery', 'Volunteers deliver meals and provide companionship to seniors.', 'Boise Senior Center', '2026-08-12'),
(3, 'Homeless Shelter Renovation Day', 'Paint, clean, and repair the downtown homeless shelter.', 'Hope Shelter, 550 S Capitol Blvd', '2026-09-07'),
(3, 'After-School Tutoring Program', 'Provide free tutoring and mentorship for K-8 students.', 'UnityServe Learning Lab', '2026-09-01'),
(3, 'Park Cleanup & Tree Planting', 'Remove trash and plant 50 new trees in Julia Davis Park.', 'Julia Davis Park', '2026-10-19');

SELECT * FROM service_project;

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

INSERT INTO categories(category_name) VALUES
('Environmental'),
('Education'),
('Community Service'),
('Health and Wellness');


SELECT * FROM categories;



-- 2. JOIN TABLE: links projects to categories
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id), -- prevents duplicates
	
    CONSTRAINT fk_service_project
        FOREIGN KEY (project_id) 
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,
		
    CONSTRAINT fk_categories
        FOREIGN KEY (category_id) 
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

DELETE FROM project_category;

INSERT INTO project_category (project_id, category_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1), 
(6, 2),
(7, 1), 
(7, 2),
(8, 1),
(9, 1),
(10, 1),
(11, 3), 
(11, 4),
(12, 4),
(13, 3),
(14, 2),
(15, 1);

SELECT * FROM project_category;








