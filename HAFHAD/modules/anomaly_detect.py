# Import database module.
import mysql
import json
import datetime
import statistics
from statistics import stdev
from statistics import mean
from pprint import pprint
from modules.cloudConnect import gcloudConnect
from modules.cloudConnect import insertCloud
from datetime import date, datetime, timedelta
#from tts import tts



def anomaly_detection():
    with open('modules/data/user.json') as json_data:
        d = json.load(json_data)
        d2 = d['users'][0]['key']
        #print(d['users'][0]['key'])
        time = str(datetime.now().replace(microsecond=0)- timedelta(days = 1))  
        #print(time)
        sevenday = str(datetime.now().replace(microsecond=0) - timedelta(days = 7))
       # print(sevenday)  
        time2 = str(datetime.now().date())

        userKey = str(d2)

        cnx = gcloudConnect()

        query = ("SELECT * FROM consumption_tb WHERE userKey ='"+userKey+"' AND datetime BETWEEN '"+sevenday+"'AND'"+time+"'")
        query2 = (("SELECT * FROM consumption_tb WHERE userKey ='"+userKey+"' AND DATE(datetime) ='"+time2+"'"))

        cursor = cnx.cursor()
        cursor.execute(query)
        data = cursor.fetchall()

        cursor.execute(query2)
        data2 = cursor.fetchall()
        summation = 0
        summation2 = 0
        sd = []

        if len(data) < 500:
            print("Not enough data")
            return 1
            

        for row in data:
            summation = summation + int(row[3])
            print("test ="+row[3])
            sd.append(int(row[3]))

        sd = statistics.stdev(sd)
        oldmean = summation/(len(data))
        print("\n\n")
        print(summation)
        for rows in data2:
  
            summation2 = summation2 + int(rows[3])

        print(summation2)

        add_noti = ("INSERT INTO notification_tb"
					"(userId,userKey,content,type,datetime,isAck)"
					"VALUE (%s,%s,%s,%s,%s,%s)")

        if(summation2 <  oldmean + (2*sd)):
            print("Anomaly usage detected")
            time_now = str(datetime.now())
            noti =('1',userKey,'ใช้ไฟเกินมาตราฐานนะคะ','warning',time_now,'false')
            insertCloud(add_noti,noti)

         



if __name__ == '__main__':

    anomaly_detection()



    



            

            












