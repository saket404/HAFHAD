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

	"""	Connect to google clound and return cursor for execute query """
	
	cnx = mysql.connector.connect(**config)
	cursor = cnx.cursor()
	print("Connected to Database")

	return cnx

def insertCloud(structure,data):

	""" Insert query into google cloud
		structure eg . ("INSERT INTO behavior"
						"(plug_name,time,open,close)"
						"VALUES(?,?,?,?)")
		data is tuple of data eg .['test1','test2']
	"""
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
    

