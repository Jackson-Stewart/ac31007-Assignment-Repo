import json
import mysql.connector  #used to connect to mysql database, all dependencies are uploaded to aws

def lambda_handler(event, context): #deault handler for lambda function
    
    requestData = event['queryStringParameters']    #gets parameters passed in through url
    lat = requestData['lat']    #coordinates to search from
    long = requestData['long']
    radius = requestData['radius']  #radius to search (miles)
    table = requestData['table']    #selects either "atm" or "branches" table
    
    cnx = mysql.connector.connect(user='admin', password='Group3MasterPassword!',   #db login
                              host='bankdatabase.ct2cs466y605.us-east-1.rds.amazonaws.com',
                              database='BankDatabase')
    
    atmFields = "atm_identification, brand_name, supported_languages, atm_services, accessibility, access_24_hours, supported_currencies, minimum_amount, note, other_accessibility_code, other_accessibility_name, other_accessibility_description, branch_identification, location_category, other_location_category_code, other_location_category_name, other_location_category_description, site_identification, site_name, street_name, town_name, country_subdivision, country, post_code, latitude, longitude"
    branchesFields = "branch_identification, brand_name, branch_name, branch_type, customer_segments, services_and_facilities, accessibility, opening_hours_monday, opening_hours_tuesday, opening_hours_wednesday, opening_hours_thursday, opening_hours_friday, opening_hours_saturday, opening_hours_sunday, contact_phone, street_name, town_name, country_subdivision, country, post_code, latitude, longitude"
    fields = branchesFields if table == "branches" else atmFields   #list of fields to select, either from atm or branches
    try:
        cursor = cnx.cursor()
        #SQL query to search database for either ATMs or branches in a given radius
        query = """
            SELECT {Nfields}
            FROM 
                {Ntable}_data
            WHERE 
                ST_Distance_Sphere(
                    geolocation, 
                    ST_GeomFromText('POINT({Nlongitude} {Nlatitude})')
                ) <= {Ndistance};
        """.format(Nfields = fields, Nlatitude = lat, Nlongitude = long, Ndistance = radius, Ntable = table)
        cursor.execute(query)
        result = cursor.fetchall()  #result stores all the values
        columnNames = [column[0] for column in cursor.description]  #columnNames stores all the field names
        returnData = []
        #Iterates through each row of retreived data forming key value pairs of field names, and the data
        #These are then added to an array, giving an array of key value pairs ready to be  
        returnData = [dict(zip(columnNames, row)) for row in result]
    finally:
        cnx.close()
    return {
        'statusCode': 200,
        'headers': { #headers required to enable CORS
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(returnData)
    }