import json
import mysql.connector    

def getAtms(lat, long, radius):      #lat long and radius will be passed in from website
    print("test")
    Filter = 'accessibility LIKE "%WheelchairAccessible%"'
    filter = 'AND ' + Filter
    cnx = mysql.connector.connect(user='admin', password='Group3MasterPassword!',   #db login
                              host='bankdatabase.ct2cs466y605.us-east-1.rds.amazonaws.com',
                              database='BankDatabase')

    try:
        cursor = cnx.cursor()
        cursor.execute("""
             SELECT *
            FROM
                branches_data
            WHERE
                ST_Distance_Sphere(
                    geolocation,
                    ST_GeomFromText('POINT(-4.083687, 52.415085)') 
                ) <= 10000000;   
            """.format(Nfilter = filter))                               #currently gets all atms
        result = cursor.fetchall()
        print("test")
        print (result)                    #print result
    finally:
        cnx.close()

getAtms(1,2,3)