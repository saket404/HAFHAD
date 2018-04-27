import sqlite3


""" sqlconn() just for testing connection purpose """
def sqlconn():
    conn = sqlite3.connect('modules/data/user_history.db')
    return conn
def createTable():

    conn = sqlconn()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS record
             (No integer primary key AUTOINCREMENT,plug_name integer NOT NULL, time text NOT NULL, open TINYINT(1) NOT NULL, close TINYINT(1) NOT NULL)''')
    c.close()
    return True

def insertData(structure,data):

    conn = sqlite3.connect('modules/data/user_history.db')
    c = conn.cursor()
    c.execute(structure,data)
    conn.commit()
    conn.close()
    print("Added data to sqlite successful")

    return 0

if __name__ == '__main__':
    createTable()