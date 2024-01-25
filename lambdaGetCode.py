import json
import mysql.connector 

def lambda_handler(event, context):
    
    requestData = event['queryStringParameters']
    lat = requestData['lat']
    long = requestData['long']
    radius = requestData['radius']
    table = requestData['table']
    cnx = mysql.connector.connect(user='admin', password='Group3MasterPassword!',
                              host='bankdatabase.ct2cs466y605.us-east-1.rds.amazonaws.com',
                              database='BankDatabase')
                              
    atmFields = "atm_identification, brand_name, supported_languages, atm_services, accessibility, access_24_hours, supported_currencies, minimum_amount, note, other_accessibility_code, other_accessibility_name, other_accessibility_description, branch_identification, location_category, other_location_category_code, other_location_category_name, other_location_category_description, site_identification, site_name, street_name, town_name, country_subdivision, country, post_code, latitude, longitude"
    branchesFields = "branch_identification, brand_name, branch_name, branch_type, customer_segments, services_and_facilities, accessibility, opening_hours_monday, opening_hours_tuesday, opening_hours_wednesday, opening_hours_thursday, opening_hours_friday, opening_hours_saturday, opening_hours_sunday, contact_phone, street_name, town_name, country_subdivision, country, post_code, latitude, longitude"
    if(table=="branches"):fields = branchesFields
    if(table=="atm"):fields = atmFields
    try:
        cursor = cnx.cursor()
        query = """
        SELECT {Nfields}, ( 3959 * acos( cos( radians({Nlatitude}) ) * cos( radians( latitude) ) 
        * cos( radians( longitude ) - radians({Nlongitude}) ) + sin( radians({Nlatitude}) ) * sin(radians(latitude)) ) ) AS distance 
        FROM {Ntable}_data 
        HAVING distance < {Ndistance}
        ORDER BY distance ;
        """.format(Nfields = fields, Nlatitude = lat, Nlongitude = long, Ndistance = radius, Ntable = table)
        cursor.execute(query)
        result = cursor.fetchall()
        
        columnNames = [column[0] for column in cursor.description]
        returnData = []
        for row in result:
            rowDict = dict(zip(columnNames, row))
            returnData.append(rowDict)
    finally:
        cnx.close()
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        'body': json.dumps(returnData)
    }