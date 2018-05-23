#from Open_Close import open_close
#from sqliteconn import sqlconn
from Naked.toolshed.shell import execute_js, muterun_js
from modules.sqliteconn import sqlconn
from modules.cloudConnect import gcloudConnect
from stt import stt
from tts import tts
from mysql.connector import errorcode
import json
import mysql.connector
import sys
import datetime
import sqlite3
ratio = 0.65
config = {
  'user': 'test',
  'password': '1234',
  'host': '35.189.145.19',
  'database': 'hafhad_db',
  'raise_on_warnings': True,
}

def behaviorLearn():

    """ Behavior learn function use collected user history data to
        learn behavior from it then update to new db call user_behavior.db
        also when execute function old table will be flush before add new one
    """
    cnx = mysql.connector.connect(**config)
    with open('modules/data/user.json') as json_data:
        d = json.load(json_data)
        d2 = d['users'][0]['key']   
    cursor = cnx.cursor()
    cursor.execute("""SELECT ratio FROM user_tb WHERE userKey = "QWERTY1234" """)
    ratio_tuble = cursor.fetchone()
    ratio = float(ratio_tuble[0])
   # print("User ratio : ",ratio)
    cursor.close()
    cnx.close()

    conn = sqlconn()
    cur = conn.cursor()
    cur.execute("SELECT count(*) from record ")
    rows = cur.fetchone()
    numRow = rows[0]
    print(numRow)

    cur.execute("select count(No),plug_name,time,open,close from record group by plug_name,time,open,close")
    rows = cur.fetchall()  
    #for row in rows:
    #    print(row, row[0]/numRow)   
    cur.execute("create table if not exists behavior (No integer primary key AUTOINCREMENT, plug_name text NOT NULL,time text NOT NULL,open TINYINT(1) NOT NULL, close TINYINT(1) NOT NULL)")
    conn.commit
    cur.execute('DELETE FROM behavior')
    conn.commit
    add_bh = ("INSERT INTO behavior"
					"(plug_name,time,open,close)"
					"VALUES(?,?,?,?)")
    for row in rows:

        if (row[0]/numRow) >= ratio:
            print(row)
            data = (row[1],row[2],row[3],row[4])
            print(data)
            cur.execute(add_bh,data)
            conn.commit()
            print("add ",data," to behavior ")
    cur.close()
    conn.close()
    return 0

def behavior_alert():
    """
        Alert user when reach the time in user_behavior 
        It will ask user for permission before execute
        
    """

    time = datetime.datetime.now()
    h = time.hour
    m = time.minute
    conn = sqlite3.connect('modules/data/user_behavior.db')
    cur = conn.cursor()
    cur.execute('select * from behavior')
    rows = cur.fetchall()

    for row in rows:
        final = []
        print("Current time || hour:",h," minute: ",int(m)," time to open or close:",row[2])
        if (int(row[2]) == int(h) and int(m) == 0) :
            print(row[2],row[3])
            if row[3] == 1:
                final.append("open")
                event = 0
                command = "เปิด"
            elif row[4] == 1:
                final.append("close")
                event = 1
                command = "ปิด"

            final.append(row[1])
            tts("ต้องการที่จะ"+command+"ไฟ"+row[1]+"หรือไม่คะ")
            text = stt()
            print(event)
            if any(["ปิด" in text, "ใช่" in text]) & event == 1:
                run = ",".join(final)
                success = muterun_js('plug/plugForBot.js',run)
                if success.exitcode == 0 :
                    print(success.stdout.decode("utf-8"))
            elif any(["เปิด" in text ,"ใช่" in text]) & event == 0:
                run = ",".join(final)
                success = muterun_js('plug/plugForBot.js',run)
                if success.exitcode == 0 :
                    print(success.stdout.decode("utf-8"))
            else:
                tts("ไม่เข้าใจคำสั่งค่ะ")
            print(run)
            print(success.exitcode)
    return 0
    
