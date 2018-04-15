# Import database module.
import firebase_admin
import mysql.connector
from firebase_admin import credentials

from firebase_admin import db

from statistics import stdev

from statistics import mean

from pprint import pprint
from cloudConnect import gcloudConnect
from cloudConnect import insertCloud

from datetime import date, datetime, timedelta


#from tts import tts



def anomaly_detection():

    

    #creditial and initial

    cred = credentials.Certificate("sa_key/SA_key.json")

    firebase_admin.initialize_app(cred ,{

        'databaseURL' : 'https://dashboard-2f5e4.firebaseio.com/'

    })



    # get data from firebase



    ref = db.reference('/')

    ref1 = ref.get()

    element = ref1.get('Days')



    # check data

    size = 8

    if len(element) < 8 :

        print("Need more data")

    else:

        last_use = element.pop()

        element = element[-7:]

        list_sd = stdev(element)

        list_mean = mean(element)

        anomaly = list_mean + 2*(list_sd)

        print("Mean + 2 SD = ",anomaly)

        add_noti = ("INSERT INTO notification"
					"(userId,content,type)"
					"VALUE (%s,%s,%s)")

        if last_use > anomaly:
			#print('Alert Use more than Usaul')
            noti =('1','Alert Use more than Usaul','warning')

        #    tts("Alert Use more than Usaul")

        elif last_use < anomaly:
			#print('Alert Use better than Usual')
            noti =('1','Alert Use better than Usual','info')

           # tts("Alert Use better than Usual")
        insertCloud(add_noti,noti)




if __name__ == '__main__':

    anomaly_detection()

    



            

            












