import json
import pymysql # Used for sql queries
import random # Used for random function
from faker import Faker # Library for random streets and such
import string # Used for string Randomizer

atm_IDCount = 855964
atmNumber = 0

# Faker Created to be used for info generation
fake = Faker()

# Setups Connection to database
connection = pymysql.connect(
    host='bankdatabase.ct2cs466y605.us-east-1.rds.amazonaws.com',
    user='admin',
    password='Group3MasterPassword!',
    database='BankDatabase'
)

# Creates Cursor used to run SQL statements
cursor = connection.cursor()

# Loops for 25000 ATMs
for i in range(25000):

    #Counter to keep track of insert
    atmNumber = atmNumber + 1
    print(atmNumber)

    # Counter used for atm_ID
    atm_IDCount = atm_IDCount + 1

    # Assigns values for all ATM Columns With random and hard coded values
    random_atm = {
        'brand_name': 'Dummy ATM',
        'atm_identification': f'A{atm_IDCount}A', # Gives ID for ATMs with Counter And 'A' for format
        'supported_languages': ', '.join(('en', 'es')), # Join used for turning list to string with , as delimeter
        'atm_services': ', '.join(random.sample(['CashWithdrawal', 'CashDeposits', 'PINChange', 'ChequeDeposits', # Random.Sample chooses random amount of items from list
                                                 'Balance'], k=random.randint(1, 5))),
        'accessibility': ', '.join(random.sample(['AudioCashMachine', 'WheelchairAccess'], k=random.randint(1, 2))),
        'access_24_hours': random.choice([True, False]),
        'supported_currencies': 'GBP',
        'minimum_amount': random.choice(['5', '10']), # Random.choice chooses a random element from the list
        'note': random.choice(['DATM', 'ATM']),
        'other_accessibility_code': 'DTSA',
        'other_accessibility_name': 'Digital Touch Screen',
        'other_accessibility_description': 'All our Digital ATM''s are fitted with a touch screen for ease of access.',
        'branch_identification': random.randint(1, 1000), # Generates a random int within range
        'location_category': random.choice(['BranchInternal', 'BranchExternal']),
        'other_location_category_code': random.choice(['BRIN', 'BREX']),
        'other_location_category_name': random.choice(['BRANCH INTERNAL', 'BRANCH EXTERNAL']),
        'other_location_category_description': random.choice(['External ATM at a Branch', 'Internal ATM at a Branch']),
        'site_identification': random.randint(2000, 20000),
        'site_name': fake.city() + ' ' + str(random.randint(1, 500)),
        'street_name': fake.street_address(),
        'town_name': fake.city(),
        'country_subdivision': random.choice(['North Yorkshire', 'Somerset', 'Cumberland', 'Westmorland and Furness'
                                                 , 'North Northamptonshire', 'West Northamptonshire', 'Buckinghamshire',
                                              'Bournemouth', 'Christchurch and Poole'
                                                 , 'Dorset', 'Cornwall', 'Durham', 'Northumberland', 'Shropshire',
                                              'Wiltshire', 'Bedford', 'Central Bedfordshire'
                                                 , 'Cheshire East', 'Cheshire West and Chester',
                                              'Blackburn with Darwen', 'Blackpool', 'Bracknell Forest', 'Halton'
                                                 , 'Herefordshire', 'Medway', 'Nottingham', 'Peterborough', 'Plymouth',
                                              'Reading', 'Slough', 'Southend-on-Sea', 'Stoke-on-Trent'
                                                 , 'Swindon', 'Telford and Wrekin', 'Thurrock', 'Torbay', 'Warrington',
                                              'West Berkshire', 'Windsor and Maidenhead', 'Wokingham'
                                                 , 'Bournemouth', 'Brighton and Hove', 'Derby', 'Darlington',
                                              'Leicester', 'Luton', 'Milton Keynes', 'Poole', 'Portsmouth', 'Rutland'
                                                 , 'Southampton', 'Bath and North East Somerset', 'Bristol',
                                              'East Riding of Yorkshire', 'Hartlepool', 'Kingston upon Hull',
                                              'Middlesbrough', 'North East Lincolnshire', 'North Lincolnshire',
                                              'North Somerset', 'Redcar and Cleveland', 'South Gloucestershire',
                                              'Stockton-on-Tees', 'York', 'Isle of Wight', 'Isles of Scilly']), # List of English country subdivisions
        'country': 'GB',
        'post_code': random.choice(string.ascii_uppercase) + random.choice(string.ascii_uppercase) + str(
            random.randint(0, 9)) + " " + str(random.randint(0, 9)) + random.choice(
            string.ascii_uppercase) + random.choice(string.ascii_uppercase), # Used several short random ints and letter in order to generate fake postcode
        'latitude': round(random.uniform(49.823809, 58.782192), 6),  # Uses coordinates Limited to the UK
        'longitude': round(random.uniform(-5.109863, 1.286621), 6)  # Generates random float within range
    }

    # Executes Insert into atm_data Table with the provided variables
    (cursor.execute("""
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
    """, random_atm))

# Commits to database
connection.commit()

# Closed cursor and Connection
cursor.close()
connection.close()