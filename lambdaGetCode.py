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
    try:
        cursor = cnx.cursor()
        query = """
        SELECT *, ( 3959 * acos( cos( radians({Nlatitude}) ) * cos( radians( latitude) ) 
        * cos( radians( longitude ) - radians({Nlongitude}) ) + sin( radians({Nlatitude}) ) * sin(radians(latitude)) ) ) AS distance 
        FROM {Ntable}_data 
        HAVING distance < {Ndistance}
        ORDER BY distance ;
        """.format(Nlatitude = lat, Nlongitude = long, Ndistance = radius, Ntable = table)
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
        'body': json.dumps(str(returnData))
    }