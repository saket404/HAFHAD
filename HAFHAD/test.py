import httplib2
import sys
import datetime
import re



from dateutil import tz
from apiclient.discovery import build
from oauth2client.file import Storage
from oauth2client.client import AccessTokenRefreshError
from oauth2client.client import OAuth2WebServerFlow
from oauth2client.tools import *






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



def addEvent():

    try:
        event = {
      'summary': 'Google I/O 2015',
      'start': {
        'dateTime': '2018-03-28T09:00:00',
        'timeZone': 'Asia/Bangkok',
      },
      'end': {
        'dateTime': '2018-03-28T17:00:00',
        'timeZone': 'Asia/Bangkok',
      },
    } 
    
        
        service.events().insert(calendarId='primary',sendNotifications = True, body = event).execute()
        
        
    except Exception as e:
        print("Error")
        
    except KeyError:
        print("google error")
                    

					
			       
			
			

            
            











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



