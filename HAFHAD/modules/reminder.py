import httplib2
import sys
import datetime
import re
from tts import tts
from stt import stt
import dateparser
import pytz

from dateutil import tz
from apiclient.discovery import build
from oauth2client.file import Storage
from oauth2client.client import AccessTokenRefreshError
from oauth2client.client import OAuth2WebServerFlow
from oauth2client.tools import *
from pythainlp.tokenize import word_tokenize






client_id = '720601142023-f22luipmdr4l4h0qgp0d2o4lahnuj9cm.apps.googleusercontent.com'
client_secret = 'ocKT7kdIC8QuD35QDvBItBPc'

monthDict = {'January': '01', 
		'February': '02', 
		'March': '03', 
		'April': '04', 
		'May': '05', 
		'June': '06', 
		'July': '07', 
		'August': '08', 
		'September': '09', 
		'October': '10', 
		'November': '11', 
	    'December': '12'}


# The scope URL for read/write access to a user's calendar data
scope = 'https://www.googleapis.com/auth/calendar'


def askDateTime():
    
    flag = 0
    while flag == 0:
        tts("กรุณาระบุวันที่")
        try:
            date = stt()
            if(date == "ไม่เข้าใจที่พูดออกมาค่ะ"):
                continue
        except Exception:
            tts("อินเทอร์เน็ตมีปัญหาค่ะ")
            continue
        
        tts("กรุณาระบุเวลา")
        try:
            text = stt()
            if(text == "ไม่เข้าใจที่พูดออกมาค่ะ"):
                continue
        except Exception:
            tts("อินเทอร์เน็ตมีปัญหาค่ะ")
            continue
        
        text1 = word_tokenize(text,engine="newmm")
        print(text1)
        
        try:    
            
            if(":" in text):
                time = text1[0] +":"+text1[2]
            elif("." in text):
                time = text1[0].replace(".",":")
            else:
                time = text1[0] +":"+ text1[4]
            
        
        
            if("วันนี้" in date):
                tz = pytz.timezone(('Asia/Bangkok'))
                d = datetime.datetime.now(tz=tz)
                date = d.date()
                
            if("พรุ่งนี้" in date):
                one_day = datetime.timedelta(days=1)
                tz = pytz.timezone('Asia/Bangkok')
                d = datetime.datetime.now(tz=tz) + one_day
                date = d.date()
        
            
            inputDate = date+","+time
        
            dateTime = dateparser.parse(inputDate)
            print(dateTime)
            
            if dateTime == None:
                tts("วันที่เเละเวลาผิดค่ะ")
                continue
            
            tz = pytz.timezone(('Asia/Bangkok'))
            d = datetime.datetime.now(tz=tz)
            
            if dateTime.date() < d.date() and dateTime.time() < d.time()  :
                tts("วันที่เเละเวลาผิดค่ะ")
                continue

            
            flag = 1
            return dateTime
    
        except Exception:
            tts("วันที่เเละเวลาผิดค่ะ")
            continue
    
    




def addEvent():

    # Create a flow object. This object holds the client_id, client_secret, and
# scope. It assists with OAuth 2.0 steps to get user authorization and
# credentials.

    flow = OAuth2WebServerFlow(client_id, client_secret, scope)


# Create a Storage object. This object holds the credentials that your
# application needs to authorize access to the user's data. The name of the
# credentials file is provided. If the file does not exist, it is
# created. This object can only hold credentials for a single user, so
# as-written, this script can only handle a single user.
    storage = Storage('credentials.dat')

# The get() function returns the credentials for the Storage object. If no
# credentials were found, None is returned.
    credentials = storage.get()

# If no credentials are found or the credentials are invalid due to
# expiration, new credentials need to be obtained from the authorization
# server. The oauth2client.tools.run_flow() function attempts to open an
# authorization server page in your default web browser. The server
# asks the user to grant your application access to the user's data.
# If the user grants access, the run_flow() function returns new credentials.
# The new credentials are also stored in the supplied Storage object,
# which updates the credentials.dat file.
    if credentials is None or credentials.invalid:
        credentials = run_flow(flow, storage)

# Create an httplib2.Http object to handle our HTTP requests, and authorize it
# using the credentials.authorize() function.
    http = httplib2.Http()

    http = credentials.authorize(http)

# The apiclient.discovery.build() function returns an instance of an API service
# object can be used to make API calls. The object is constructed with
# methods specific to the calendar API. The arguments provided are:
#   name of the API ('calendar')
#   version of the API you are using ('v3')
#   authorized httplib2.Http() object that can be used for API calls
    service = build('calendar', 'v3', http=http)
    
    

    try:
        event = {
      'summary': 'G',
      'start': {
        'dateTime': '2018-03-28T09:00:00',
        'timeZone': 'Asia/Bangkok',
      },
      'end': {
        'dateTime': '2018-03-28T09:00:00',
        'timeZone': 'Asia/Bangkok',
      },
    } 
        warning = 0
        while warning == 0:
        
            flag = 0
            while flag == 0:
                tts("แจ้งเตือนเรื่องอะไรค่ะ")
                try:
                    summary = stt()
                    if summary == "ไม่เข้าใจที่พูดออกมาค่ะ":
                        continue
                    flag = 1
                except Exception:
                    tts("อินเทอร์เน็ตมีปัญหาค่ะ")
        
    
            text = askDateTime()
            date = str(text)
            date = date.replace(" ","T")
            
            print("Test")
        
        
            event['summary'] = summary
            event['start']['dateTime'] = date
            event['end']['dateTime'] = date
        
            sayevent = "แจ้งเตือนเรื่อง"+summary+"วันที่"+str(text.day)+"เดือน"+str(text.month)+"ตอน"+str(text.time())
            
            flag = 0
            while flag == 0:
                tts(sayevent + "ถูกต้องหรือไม่ค่ะ")
                try:
                    inputsay = stt()
                    if(inputsay == "ไม่เข้าใจที่พูดออกมาค่ะ"):
                        continue
                    flag = 1
                except Exception:
                    tts("อินเทอร์เน็ตมีปัญหาค่ะ")
                    continue
                
            if any(["โอเค" in inputsay,"ครับ" in inputsay,"ค่ะ" in inputsay,"ถูก" in inputsay]):
                service.events().insert(calendarId='primary',sendNotifications = True, body = event).execute()
                
            
            warning = 1
                
        
        
    except Exception as e:
        tts("มีปัญหาในการต่อปฏิทินค่ะ")
        
    except KeyError:
        tts("มีปัญหาในการต่อปฏิทิน Google ค่ะ")
                    

					
			       
			
			

            
            











if __name__ == '__main__':
    # Create a flow object. This object holds the client_id, client_secret, and
# scope. It assists with OAuth 2.0 steps to get user authorization and
# credentials.

    flow = OAuth2WebServerFlow(client_id, client_secret, scope)


# Create a Storage object. This object holds the credentials that your
# application needs to authorize access to the user's data. The name of the
# credentials file is provided. If the file does not exist, it is
# created. This object can only hold credentials for a single user, so
# as-written, this script can only handle a single user.
    storage = Storage('credentials.dat')

# The get() function returns the credentials for the Storage object. If no
# credentials were found, None is returned.
    credentials = storage.get()

# If no credentials are found or the credentials are invalid due to
# expiration, new credentials need to be obtained from the authorization
# server. The oauth2client.tools.run_flow() function attempts to open an
# authorization server page in your default web browser. The server
# asks the user to grant your application access to the user's data.
# If the user grants access, the run_flow() function returns new credentials.
# The new credentials are also stored in the supplied Storage object,
# which updates the credentials.dat file.
    if credentials is None or credentials.invalid:
        credentials = run_flow(flow, storage)

# Create an httplib2.Http object to handle our HTTP requests, and authorize it
# using the credentials.authorize() function.
    http = httplib2.Http()

    http = credentials.authorize(http)

# The apiclient.discovery.build() function returns an instance of an API service
# object can be used to make API calls. The object is constructed with
# methods specific to the calendar API. The arguments provided are:
#   name of the API ('calendar')
#   version of the API you are using ('v3')
#   authorized httplib2.Http() object that can be used for API calls
    service = build('calendar', 'v3', http=http)
    addEvent()
    
    



