#from Open_Close import open_close
#from sqliteconn import sqlconn
from Naked.toolshed.shell import execute_js, muterun_js
from modules.sqliteconn import sqlconn
from stt import stt
from tts import tts
import sys
import datetime
import sqlite3
ratio = 0.55

def behaviorLearn():

    #try:
    conn = sqlconn()
    #except Error as e:
    #    print(e)
    
    cur = conn.cursor()
    cur.execute("SELECT count(*) from record ")
    rows = cur.fetchone()
    numRow = rows[0]
    #print(numRow)

    cur.execute("select count(No),plug_name,time,open,close from record group by plug_name,time,open,close")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    conn2 = sqlite3.connect('modules/data/user_behavior.db')
    cur2 = conn2.cursor()
    cur2.execute("create table if not exists behavior (No integer primary key AUTOINCREMENT, plug_name text NOT NULL,time text NOT NULL,open TINYINT(1) NOT NULL, close TINYINT(1) NOT NULL)")
    cur2.execute('DELETE FROM behavior')

    add_bh = ("INSERT INTO behavior"
					"(plug_name,time,open,close)"
					"VALUES(?,?,?,?)")
    for row in rows:
        #print(row)
        test = row[0]/numRow
        if (row[0]/numRow) > ratio:

           # print(type(row[1]),type(row[2]),type(row[3]),type(row[4]))

            data = (row[1],row[2],row[3],row[4])
            print(data)
            cur2.execute(add_bh,data)
            conn2.commit()
            print("add ",data," to behavior ")

def behavior_alert():

    time = datetime.datetime.now()
    h = time.hour
    m = time.minute
    print(h,m)
    conn = sqlite3.connect('modules/data/user_behavior.db')
    cur = conn.cursor()
    cur.execute('select * from behavior')
    rows = cur.fetchall()

    final = ()
    for row in rows:
        print("hour:",h," minute: ",m," behavior time to open and close:",row[2])
        if (row[2] == h & m == 0) :

            if row[3] == 1:
                final[1] = "open"
                event = 0
                command = "เปิด"
            elif row[3] == 1:
                final[1] = "close"
                event = 1
                command = "ปิด"

            final[0] = row[1]
            tts("ต้องการที่จะ",command,"หรือไม่คะ")
            text = stt()

            if any(["ปิด" in text, "ใช่" in text]) & event == 1:
                success = muterun_js('plug/plugjs',final)
            elif any(["เปิด" in text ,"ใช่" in text]) & event == 0:
                success = muterun_js('plug/plugjs',final)
    return 0
                


if __name__ == '__main__':
    behavior_alert()