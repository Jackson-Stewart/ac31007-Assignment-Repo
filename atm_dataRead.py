import json
import pymysql
 
filepath = "D:\Year 3\Semester 2\Agile\Source material\Atms.json" # Path to Json file
 
# Read JSON data from file
with open(filepath, 'r') as json_file:
    data = json.load(json_file)
 
 
# Creates connection to the database
connection = pymysql.connect(
    host='bankdatabase.ct2cs466y605.us-east-1.rds.amazonaws.com',
    user='admin',
    password='Group3MasterPassword!',
    database='BankDatabase'
)

# Cursor created to execute SQL statement
cursor = connection.cursor()
 
# Takes the Json values assigned to variables choosen by the names and inserts them into the database based on column names
for brand_data in data['data']: # Read in data, used to keep Brand name for each ATM
    brand_name = brand_data['Brand'][0]['BrandName']
    for atm_data in brand_data['Brand'][0]['ATM']: # Iterates through each ATM
        # Runs the query
        cursor.execute("""
            INSERT INTO atm_data (
                brand_name, atm_identification, supported_languages, atm_services,
                accessibility, access_24_hours, supported_currencies,
                minimum_amount, note, other_accessibility_code,
                other_accessibility_name, other_accessibility_description,
                branch_identification, location_category, other_location_category_code,
                other_location_category_name, other_location_category_description,
                site_identification, site_name, street_name, town_name,
                country_subdivision, country, post_code, latitude, longitude
            ) 
            VALUES 
            (
                %(brand_name)s, %(atm_identification)s, %(supported_languages)s,
                %(atm_services)s, %(accessibility)s, %(access_24_hours)s,
                %(supported_currencies)s, %(minimum_amount)s, %(note)s,
                %(other_accessibility_code)s, %(other_accessibility_name)s,
                %(other_accessibility_description)s, %(branch_identification)s,
                %(location_category)s, %(other_location_category_code)s,
                %(other_location_category_name)s, %(other_location_category_description)s,
                %(site_identification)s, %(site_name)s, %(street_name)s, %(town_name)s,
                %(country_subdivision)s, %(country)s, %(post_code)s, %(latitude)s, %(longitude)s
            )
        """,
        # Assigns Json values to variables reading through nested Json, if Json is empty it will replace it with an empty string (Added cause kept crashing since some are empty)
        {
            'brand_name': brand_name,
            'atm_identification': atm_data.get('Identification', ''), # get used to make sure doesnt break if empty
            'supported_languages': ",".join(atm_data.get('SupportedLanguages', [])),
            'atm_services': ",".join(atm_data.get('ATMServices', [])), # Join used to combine lists into string
            'accessibility': ",".join(atm_data.get('Accessibility', [])),
            'access_24_hours': atm_data.get('Access24HoursIndicator', False),
            'supported_currencies': ",".join(atm_data.get('SupportedCurrencies', [])),
            'minimum_amount': atm_data.get('MinimumPossibleAmount', 0),
            'note': ",".join(atm_data.get('Note', [])),
            'other_accessibility_code': atm_data['OtherAccessibility'][0]['Code'] if 'OtherAccessibility' in atm_data else '',
            'other_accessibility_name': atm_data['OtherAccessibility'][0]['Name'] if 'OtherAccessibility' in atm_data else '',
            'other_accessibility_description': atm_data['OtherAccessibility'][0]['Description'] if 'OtherAccessibility' in atm_data else '',
            'branch_identification': atm_data['Branch']['Identification'] if 'Branch' in atm_data else '',
            'location_category': ",".join(atm_data['Location']['LocationCategory']) if 'Location' in atm_data else '',
            'other_location_category_code': atm_data['Location']['OtherLocationCategory'][0]['Code'] if 'Location' in atm_data else '',
            'other_location_category_name': atm_data['Location']['OtherLocationCategory'][0]['Name'] if 'Location' in atm_data else '',
            'other_location_category_description': atm_data['Location']['OtherLocationCategory'][0]['Description'] if 'Location' in atm_data else '',
            'site_identification': atm_data['Location']['Site']['Identification'] if 'Location' in atm_data else '',
            'site_name': atm_data['Location']['Site']['Name'] if 'Location' in atm_data else '',
            'street_name': atm_data['Location']['PostalAddress']['StreetName'] if 'Location' in atm_data else '',
            'town_name': atm_data['Location']['PostalAddress']['TownName'] if 'Location' in atm_data else '',
            'country_subdivision': ",".join(atm_data['Location']['PostalAddress']['CountrySubDivision']) if 'Location' in atm_data else '',
            'country': atm_data['Location']['PostalAddress']['Country'] if 'Location' in atm_data else '',
            'post_code': atm_data['Location']['PostalAddress']['PostCode'] if 'Location' in atm_data else '',
            'latitude': atm_data['Location']['PostalAddress']['GeoLocation']['GeographicCoordinates']['Latitude'] if 'Location' in atm_data else '',
            'longitude': atm_data['Location']['PostalAddress']['GeoLocation']['GeographicCoordinates']['Longitude'] if 'Location' in atm_data else ''
        })

# Commits to database
connection.commit()

# Closed cursor and Connection
cursor.close()
connection.close()