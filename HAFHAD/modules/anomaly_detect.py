# Import database module.
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
from statistics import stdev
from statistics import mean
from pprint import pprint
from tts import tts

#creditial and initial


cred = credentials.Certificate("sa_key/SA_key.json")
firebase_admin.initialize_app(cred ,{
    'databaseURL' : 'https://dashboard-2f5e4.firebaseio.com/'
})

ref = db.reference('/')
ref1 = ref.get()
element = ref1.get('Days')

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

    if last_use > anomaly:
        tts("Alert Use more than Usaul")
    elif last_use < anomaly:
        tts("Alert Use better than Usual")

        
        






