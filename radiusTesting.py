import mysql.connector    
cnx = mysql.connector.connect(user='admin', password='Group3MasterPassword!',                      #connect to db
                              host='bankdatabase.ct2cs466y605.us-east-1.rds.amazonaws.com',
                              database='BankDatabase')

try:
   cursor = cnx.cursor()
   cursor.execute("""
      SELECT * FROM atm_data





   """)                               #currently gets all atms
   result = cursor.fetchall()
   print (result)                    #print result
finally:
    cnx.close()