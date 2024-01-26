import json
import pymysql

filePath = "" # a file path for the branches.json is entered here

# this reads in the data from the JSON file (path entered above)
with open(filePath, 'r') as json_file:
    data = json.load(json_file)

# login credentials for the database
connection = pymysql.connect(
    host='bankdatabase.ct2cs466y605.us-east-1.rds.amazonaws.com',
    user='admin',
    password='Group3MasterPassword!',
    database='BankDatabase'
)

# cursor object used for executing statements to communicate with the database
# Help found at: https://www.tutorialspoint.com/python_data_access/python_mysql_cursor_object.htm
cursor = connection.cursor()

# this loops through the JSON file
# Help found at: https://www.tech-otaku.com/mac/using-python-to-loop-through-json-encoded-data/
for i, brand_data in enumerate(data['data'], 1):

    brand_name = brand_data['Brand'][0]['BrandName']

    print("Data insertion STARTED.")
    # Iterate over Branches data
    for branches_data in brand_data['Brand'][0]['Branch']:

        # this puts opening hours into format "<OpeningTime> - <ClosingTime>".
        # made this way to reduce the amount of columns needed to store opening/closing times.
        opening_hours_monday = f"{branches_data['Availability']['StandardAvailability']['Day'][0]['OpeningHours'][0]['OpeningTime']} - {branches_data['Availability']['StandardAvailability']['Day'][0]['OpeningHours'][0]['ClosingTime']}"
        opening_hours_tuesday = f"{branches_data['Availability']['StandardAvailability']['Day'][1]['OpeningHours'][0]['OpeningTime']} - {branches_data['Availability']['StandardAvailability']['Day'][1]['OpeningHours'][0]['ClosingTime']}"
        opening_hours_wednesday = f"{branches_data['Availability']['StandardAvailability']['Day'][2]['OpeningHours'][0]['OpeningTime']} - {branches_data['Availability']['StandardAvailability']['Day'][2]['OpeningHours'][0]['ClosingTime']}"
        opening_hours_thursday = f"{branches_data['Availability']['StandardAvailability']['Day'][3]['OpeningHours'][0]['OpeningTime']} - {branches_data['Availability']['StandardAvailability']['Day'][3]['OpeningHours'][0]['ClosingTime']}"
        opening_hours_friday = f"{branches_data['Availability']['StandardAvailability']['Day'][4]['OpeningHours'][0]['OpeningTime']} - {branches_data['Availability']['StandardAvailability']['Day'][4]['OpeningHours'][0]['ClosingTime']}"
        opening_hours_saturday = f"{branches_data['Availability']['StandardAvailability']['Day'][5]['OpeningHours'][0]['OpeningTime']} - {branches_data['Availability']['StandardAvailability']['Day'][5]['OpeningHours'][0]['ClosingTime']}"
        opening_hours_sunday = f"{branches_data['Availability']['StandardAvailability']['Day'][6]['OpeningHours'][0]['OpeningTime']} - {branches_data['Availability']['StandardAvailability']['Day'][6]['OpeningHours'][0]['ClosingTime']}"

        # SQL statement inserting values into the "branches_data" table(table was created in the database before running this)
        cursor.execute("""
                INSERT INTO branches_data (
                    brand_name, branch_identification, branch_name, branch_type,
                    customer_segments, services_and_facilities, accessibility,
                    opening_hours_monday, opening_hours_tuesday, opening_hours_wednesday,
                    opening_hours_thursday, opening_hours_friday, opening_hours_saturday,
                    opening_hours_sunday, contact_phone, street_name, town_name,
                    country_subdivision, country, post_code, latitude, longitude
                ) VALUES (
                    %(brand_name)s, %(branch_identification)s, %(branch_name)s, %(branch_type)s,
                    %(customer_segments)s, %(services_and_facilities)s, %(accessibility)s,
                    %(opening_hours_monday)s, %(opening_hours_tuesday)s, %(opening_hours_wednesday)s,
                    %(opening_hours_thursday)s, %(opening_hours_friday)s, %(opening_hours_saturday)s,
                    %(opening_hours_sunday)s, %(contact_phone)s, %(street_name)s, %(town_name)s,
                    %(country_subdivision)s, %(country)s, %(post_code)s, %(latitude)s, %(longitude)s
                )
            """, {
            'brand_name': brand_name,
            'branch_identification': branches_data['Identification'],
            'branch_name': branches_data['Name'],
            'branch_type': branches_data['Type'],
            'customer_segments': ",".join(branches_data['CustomerSegment']),
            'services_and_facilities': ",".join(branches_data.get('ServiceAndFacility', [])), # .join used to convert lists to comma separated strings
            'accessibility': ",".join(branches_data['Accessibility']),
            'opening_hours_monday': opening_hours_monday,
            'opening_hours_tuesday': opening_hours_tuesday,
            'opening_hours_wednesday': opening_hours_wednesday,
            'opening_hours_thursday': opening_hours_thursday,
            'opening_hours_friday': opening_hours_friday,
            'opening_hours_saturday': opening_hours_saturday,
            'opening_hours_sunday': opening_hours_sunday,
            'contact_phone': branches_data['ContactInfo'][0]['ContactContent'],
            'street_name': branches_data['PostalAddress'].get('StreetName', ''),
            'town_name': branches_data['PostalAddress'].get('TownName', ''),
            'country_subdivision': ",".join(branches_data['PostalAddress']['CountrySubDivision']),
            'country': branches_data['PostalAddress']['Country'],
            'post_code': branches_data['PostalAddress']['PostCode'],
            'latitude': branches_data['PostalAddress']['GeoLocation']['GeographicCoordinates']['Latitude'], # nested structures
            'longitude': branches_data['PostalAddress']['GeoLocation']['GeographicCoordinates']['Longitude'],
        })

print("Data insertion completed.")
# this commits changes and closes the connection
connection.commit()
cursor.close()
connection.close()
