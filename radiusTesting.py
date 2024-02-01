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
            SELECT {Nfields},
                ST_Distance_Sphere(
                    geolocation, 
                    ST_GeomFromText('POINT({Nlongitude} {Nlatitude})')
                ) AS distance
            FROM 
                {Ntable}_data
            WHERE 
                ST_Distance_Sphere(
                    geolocation, 
                    ST_GeomFromText('POINT({Nlongitude} {Nlatitude})')
                ) <= {Ndistance}
            ORDER BY distance ;
            """)                               #currently gets all atms
        result = cursor.fetchall()
        print("test")
        print (result)                    #print result
    finally:
        cnx.close()

getAtms(52.415085,-4.083687,10)
56.461773, -2.979359

