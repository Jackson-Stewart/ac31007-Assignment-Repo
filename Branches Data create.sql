CREATE TABLE branches_data (
    branch_identification INT PRIMARY KEY,
    brand_name VARCHAR(255),
    branch_name VARCHAR(255),
    branch_type VARCHAR(255),
    customer_segments VARCHAR(255),
    services_and_facilities VARCHAR(255),
    accessibility VARCHAR(255),
    opening_hours_monday VARCHAR(255),
    opening_hours_tuesday VARCHAR(255),
    opening_hours_wednesday VARCHAR(255),
    opening_hours_thursday VARCHAR(255),
    opening_hours_friday VARCHAR(255),
    opening_hours_saturday VARCHAR(255),
    opening_hours_sunday VARCHAR(255),
    contact_phone VARCHAR(255),
    street_name VARCHAR(255),
    town_name VARCHAR(255),
    country_subdivision VARCHAR(255),
    country VARCHAR(2),
    post_code VARCHAR(10),
    latitude DECIMAL(10,6),  -- this was changed to float later on
    longitude DECIMAL(10,6)  -- this was changed to float later on
); 

-- this is the sql statement used to create branches_data table to store branches.json data