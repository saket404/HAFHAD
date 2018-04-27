import mysql.connector
from mysql.connector import errorcode
config = {
  'user': 'test',
  'password': '1234',
  'host': '35.189.145.19',
  'database': 'hafhad_db',
  'raise_on_warnings': True,
}
def gcloudConnect():
	
	cnx = mysql.connector.connect(**config)
	cursor = cnx.cursor()
	print("Connected to Database")


	#for name, ddl in TABLES.items():
	#	try:
	#		print("Creating table {}:".format(name),end='')
	#		cursor.execute(ddl)
	#	except mysql.connector.Error as err:
	#		if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
	#			print("Already exists.")
	#		else:
	#			print(err.msg)
	#	else:
	#		print("OK")
	return cnx

def insertCloud(structure,data):
	cnx = mysql.connector.connect(**config)
	cursor = cnx.cursor()
	print("Connected to Database")
	cursor.execute(structure,data)
	cnx.commit()
	cursor.close()
	cnx.close
	print("Added data to cloud successfuly")
	
	return 0
	
	

if __name__ == '__main__':
    gcloudConnect()
    

