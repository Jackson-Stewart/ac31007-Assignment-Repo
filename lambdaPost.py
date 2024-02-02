import json
import mysql.connector

def lambda_handler(event, context):
    try:
        payload = json.loads(event['body'])
        if 'method' in payload:
            method = payload['method']
            match method:
                case "new": #TODO need to change ids to auto incremenet
                    table = payload['table']
                    if(table=="atm"):
                        query = """
                        INSERT INTO atm_data (
                            atm_identification,
                            brand_name, 
                            supported_languages, 
                            atm_services, 
                            accessibility, 
                            access_24_hours, 
                            supported_currencies, 
                            minimum_amount, 
                            note varchar,
                            other_accessibility_code, 
                            other_accessibility_name, 
                            other_accessibility_description, 
                            branch_identification, 
                            location_category varchar,
                            other_location_category_code, 
                            other_location_category_name, 
                            other_location_category_description, 
                            site_identification, 
                            site_name, 
                            street_name, 
                            town_name, 
                            country_subdivision, 
                            country, 
                            post_code, 
                            latitude, 
                            longitude
                        ) VALUES ({}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {})
                        """.format(
                            payload['atm_identification'],
                            payload['brand_name'],
                            payload['supported_languages'],
                            payload['atm_services'],
                            payload['accessibility'],
                            payload['access_24_hours'],
                            payload['supported_currencies'],
                            payload['minimum_amount'],
                            payload['note'],
                            payload['other_accessibility_code'],
                            payload['other_accessibility_name'],
                            payload['other_accessibility_description'],
                            payload['branch_identification'],
                            payload['location_category'],
                            payload['other_location_category_code'],
                            payload['other_location_category_name'],
                            payload['other_location_category_description'],
                            payload['site_identification'],
                            payload['site_name'],
                            payload['street_name'],
                            payload['town_name'],
                            payload['country_subdivision'],
                            payload['country'],
                            payload['post_code'],
                            payload['latitude'],
                            payload['longitude']
                        )
                    if(table=="branches"):
                        query = """
                        INSERT INTO branches_data (
                            branch_identification,
                            brand_name,
                            branch_name,
                            branch_type,
                            customer_segments,
                            services_and_facilities,
                            accessibility,
                            opening_hours_monday,
                            opening_hours_tuesday,
                            opening_hours_wednesday,
                            opening_hours_thursday,
                            opening_hours_friday,
                            opening_hours_saturday,
                            opening_hours_sunday,
                            contact_phone,
                            street_name,
                            town_name,
                            country_subdivision,
                            country,
                            post_code,
                            latitude,
                            longitude
                        ) VALUES ({}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {});
                        """.format(
                            payload['branch_identification'],
                            payload['brand_name'],
                            payload['branch_name'],
                            payload['branch_type'],
                            payload['customer_segments'],
                            payload['services_and_facilities'],
                            payload['accessibility'],
                            payload['opening_hours_monday'],
                            payload['opening_hours_tuesday'],
                            payload['opening_hours_wednesday'],
                            payload['opening_hours_thursday'],
                            payload['opening_hours_friday'],
                            payload['opening_hours_saturday'],
                            payload['opening_hours_sunday'],
                            payload['contact_phone'],
                            payload['street_name'],
                            payload['town_name'],
                            payload['country_subdivision'],
                            payload['country'],
                            payload['post_code'],
                            payload['latitude'],
                            payload['longitude']
                        )
                case "edit":
                    id = payload['id']
                    table = payload['table']
                    field = payload['field']
                    value = payload['value']
                    pk = "atm_identification" if table == "atm" else "branch_identification"
                    query = """
                    UPDATE {Ntable}_data
                    SET {Nfield}={Nvalue}
                    WHERE {Npk}='{Nid}';
                    """.format(Ntable=table, Nfield=field, Nvalue=value, Npk=pk, Nid=id)
                case "delete":
                    id = payload['id']
                    table = payload['table']
                    query = """DELETE FROM {Ntable}_data WHERE id='{Nid}';""".format(Ntable = table, Nid = id)
    except Exception as e:
        return {
            'statusCode': 400,
            'body': json.dumps(f'Error processing payload: {str(e)}')
        }
    cnx = mysql.connector.connect(user='admin', password='Group3MasterPassword!',   #db login
                      host='bankdatabase.ct2cs466y605.us-east-1.rds.amazonaws.com',
                      database='BankDatabase')
    try:
        cursor = cnx.cursor()
        cursor.execute(query)
    finally:
        cnx.close()
    return {
        'statusCode': 200,
        'body': json.dumps('Payload processed successfully')
    }