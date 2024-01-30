import json
import mysql.connector    

def getAtms(lat, long, radius):      #lat long and radius will be passed in from website
    print("test")
    cnx = mysql.connector.connect(user='admin', password='Group3MasterPassword!',                      #connect to db
                              host='bankdatabase.ct2cs466y605.us-east-1.rds.amazonaws.com',
                              database='BankDatabase')

    try:
        cursor = cnx.cursor()
        cursor.execute("""
            SELECT atm_identification, ( 3959 * acos( cos( radians(56.458510) ) * cos( radians( latitude) ) 
            * cos( radians( longitude ) - radians(-2.982718) ) + sin( radians(56.458510) ) * sin(radians(latitude)) ) ) AS distance 
            FROM atm_data 
            HAVING distance < 5
            ORDER BY distance ;
            """)                               #currently gets all atms
        result = cursor.fetchall()
        print("test")
        print (result)                    #print result
    finally:
        cnx.close()

getAtms(1,2,3)