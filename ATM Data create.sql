CREATE TABLE atm_data (
	atm_identification VARCHAR(15) PRIMARY KEY,
    brand_name VARCHAR(255),
    supported_languages VARCHAR(255),
    atm_services VARCHAR(255),
    accessibility VARCHAR(255),
    access_24_hours  BOOLEAN,
    supported_currencies VARCHAR(255),
    minimum_amount DECIMAL(10, 2),
    note VARCHAR(10),
    other_accessibility_code VARCHAR(10),
    other_accessibility_name VARCHAR(255),
    other_accessibility_description TEXT,
    branch_identification INT,
    location_category VARCHAR(255),
    other_location_category_code VARCHAR(10),
    other_location_category_name VARCHAR(255),
    other_location_category_description TEXT,
    site_identification INT,
    site_name VARCHAR(255),
    street_name VARCHAR(255),
    town_name VARCHAR(255),
    country_subdivision VARCHAR(255),
    country VARCHAR(2),
    post_code VARCHAR(10),
    latitude DECIMAL(10, 6), -- Has since been changed to a FLOAT
    longitude DECIMAL(10, 6) -- Has since been changed to a FLOAT
    
    -- FOREIGN KEY (branch_identification) REFERENCES branches_data(branch_identification) THIS has been Unused as not every ATM has a branch

    -- SQL Statement used to create the initial atm_data table


);