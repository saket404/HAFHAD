import httplib2
import sys
import datetime
import re
import pytz
from pythainlp.tag import pos_tag
from pythainlp.corpus import stopwords
from pythainlp.tokenize import word_tokenize
from dateutil import tz
from dateutil import parser
from apiclient.discovery import build
from oauth2client.file import Storage
from oauth2client.client import AccessTokenRefreshError
from oauth2client.client import OAuth2WebServerFlow
from oauth2client.tools import *
from modules.cloudConnect import insertCloud
from tts import tts





client_id = '720601142023-f22luipmdr4l4h0qgp0d2o4lahnuj9cm.apps.googleusercontent.com'
client_secret = 'ocKT7kdIC8QuD35QDvBItBPc'
CALENDAR_ID = 'primary'

# The scope URL for read/write access to a user's calendar data
scope = 'https://www.googleapis.com/auth/calendar'

flow = OAuth2WebServerFlow(client_id, client_secret, scope)
storage = Storage('credentials.dat')
credentials = storage.get()
if credentials is None or credentials.invalid:
    credentials = run_flow(flow, storage)

http = httplib2.Http()

http = credentials.authorize(http)
service = build('calendar', 'v3', http=http)







def getEventsDate(date):

	tz = pytz.timezone(('Asia/Bangkok'))

	# Get Present Start Time and End Time in RFC3339 Format
	d = datetime.datetime.now(tz=tz);d = d.replace(day = date)
	utcString = d.isoformat()	
	m = re.search('((\+|\-)[0-9]{2}\:[0-9]{2})', str(utcString))
	utcString = str(m.group(0))
	todayStartTime = str(d.strftime("%Y-%m-%d")) + "T00:00:00" + utcString
	todayEndTime = str(d.strftime("%Y-%m-%d")) + "T23:59:59" + utcString
	page_token = None
	
	while True:

		# Gets events from primary calender from each page in present day boundaries
		events = service.events().list(calendarId='primary', pageToken=page_token, timeMin=todayStartTime, timeMax=todayEndTime).execute() 
		
		if(len(events['items']) == 0):
			tts("คุณไม่มีการแจ้งเตือนอะไรในวันที่ %d ค่ะ"%date)
			return
		tts("คุณมี %d การแจ้งเตือนค่ะ" % len(events['items']))
		print("คุณมี %d การแจ้งเตือนค่ะ" % len(events['items']))
		count = 0
		for event in events['items']:

			try:
				eventTitle = event['summary']
				eventTitle = str(eventTitle)
				eventRawStartTime = event['start']
				eventRawStartTime = eventRawStartTime['dateTime'].split("T")
				temp = eventRawStartTime[1]
				startHour, startMinute, temp = temp.split(":", 2)
				startHour = int(startHour)
				startMinute = str(startMinute)
				startHour = str(startHour)
				if(count == 0):
					response = eventTitle + " ตอน " + startHour + ":" + startMinute
				if(count > 0):
					response = response +"กับ"+ eventTitle + " ตอน " + startHour + ":" + startMinute
				count = count+1

			except (KeyError):
				count = 500
				tts("มีปัญหาในการต่อปฏิทิน Google ค่ะ")
			
		page_token = events.get('nextPageToken')
		if count != 500:
			tts(response + "ค่ะ")

		if not page_token:
			return



def getEventsToday():

	tz = pytz.timezone(('Asia/Bangkok'))

	# Get Present Start Time and End Time in RFC3339 Format
	d = datetime.datetime.now(tz=tz)
	utcString = d.isoformat()	
	m = re.search('((\+|\-)[0-9]{2}\:[0-9]{2})', str(utcString))
	utcString = str(m.group(0))
	todayStartTime = str(d.strftime("%Y-%m-%d")) + "T00:00:00" + utcString
	todayEndTime = str(d.strftime("%Y-%m-%d")) + "T23:59:59" + utcString
	page_token = None
	
	while True:

		# Gets events from primary calender from each page in present day boundaries
		events = service.events().list(calendarId='primary', pageToken=page_token, timeMin=todayStartTime, timeMax=todayEndTime).execute() 
		
		if(len(events['items']) == 0):
			tts("คุณไม่มีการแจ้งเตือนอะไรในวันนี้")
			return
		tts("คุณมี %d การแจ้งเตือนค่ะ" % len(events['items']))
		print("คุณมี %d การแจ้งเตือนค่ะ" % len(events['items']))
		count = 0
		for event in events['items']:

			try:
				eventTitle = event['summary']
				eventTitle = str(eventTitle)
				eventRawStartTime = event['start']
				eventRawStartTime = eventRawStartTime['dateTime'].split("T")              
				temp = eventRawStartTime[1]
				startHour, startMinute, temp = temp.split(":", 2)
				startHour = int(startHour)
				startMinute = str(startMinute)
				startHour = str(startHour)
				if(count == 0):
					response = eventTitle + " ตอน " + startHour + ":" + startMinute
				if(count > 0):
					response = response +"กับ"+ eventTitle + " ตอน " + startHour + ":" + startMinute
				count = count+1

			except (KeyError):
				count = 500
				tts("มีปัญหาในการต่อปฏิทิน Google ค่ะ")
			
		page_token = events.get('nextPageToken')
		if count != 500:
			tts(response + "ค่ะ")

		if not page_token:
			return


def getEventsTomorrow():

	# Time Delta function for adding one day 
	
	one_day = datetime.timedelta(days=1)
	tz = pytz.timezone('Asia/Bangkok')
	
	# Gets tomorrows Start and End Time in RFC3339 Format

	d = datetime.datetime.now(tz=tz) + one_day
	utcString = d.isoformat()
	m = re.search('((\+|\-)[0-9]{2}\:[0-9]{2})', str(utcString))
	utcString = m.group(0)
	tomorrowStartTime = str(d.strftime("%Y-%m-%d")) + "T00:00:00" + utcString
	tomorrowEndTime = str(d.strftime("%Y-%m-%d")) + "T23:59:59" + utcString

	page_token = None

	while True:

		# Gets events from primary calender from each page in tomorrow day boundaries

		events = service.events().list(calendarId='primary', pageToken=page_token, timeMin=tomorrowStartTime, timeMax=tomorrowEndTime).execute()
		if(len(events['items']) == 0):
			tts("คุณไม่มีการแจ้งเตือนอะไรในวันพรุ่งนี้")
			return
		tts("คุณมี %d การแจ้งเตือนค่ะ" % len(events['items']))
		print("คุณมี %d การแจ้งเตือนค่ะ" % len(events['items']))
		count = 0
		for event in events['items']:
			
			try:
				eventTitle = event['summary']
				eventTitle = str(eventTitle)
				eventRawStartTime = event['start']
				eventRawStartTime = eventRawStartTime['dateTime'].split("T")
				temp = eventRawStartTime[1]
				startHour, startMinute, temp = temp.split(":", 2)
				startHour = int(startHour)
				startMinute = str(startMinute)
				startHour = str(startHour)
				if(count == 0):
					response = eventTitle + " ตอน " + startHour + ":" + startMinute
				if(count > 0):
					response = response +"กับ"+ eventTitle + " ตอน " + startHour + ":" + startMinute
				count = count +1

			except (KeyError):
				count = 500
				tts("มีปัญหาในการต่อปฏิทิน Google ค่ะ")
			
		page_token = events.get('nextPageToken')
		if count != 500:
			tts(response + "ค่ะ")
		
		if not page_token:
			return


def checkcalendar(token,text):
    e=token 
    if("วันนี้" in text and e[0] != "วันนี้"):
        getEventsToday()
    elif("พรุ่งนี้" in text and "พรุ่งนี้" not in e[0]):
        getEventsTomorrow()
    elif("วันที่" in e):
        stopwords2 = stopwords.words('thai')
        stopwords1 = ['สิ','ดิ','หน่อย']

        filter_word1 = e
        for word in e:
            if word in stopwords2:
                filter_word1.remove(word)
        
        filter_word = [word1 for word1 in filter_word1 if word1 not in stopwords1]

        pos_list = pos_tag(filter_word,engine='artagger')
        index = filter_word.index('วันที่')
    
        if(pos_list[index+1][1] == "DCNM" or pos_list[index+1][0] == "31"):
            checkdate = pos_list[index+1][0]
            tz = pytz.timezone(('Asia/Bangkok'))
            d = datetime.datetime.now(tz=tz)
            date = d.strftime("%d")
            try:
                newDate = datetime.datetime(int(d.year),int(d.month),int(checkdate))
                correctDate = True
            except ValueError:
                correctDate = False
        
        
            if(correctDate == False):
                tts("วันที่ไม่ถูกต้องค่ะ")
            elif(int(checkdate) < int(date)):
                tts("วันที่ไม่ถูกต้องค่ะ")
            else:
                getEventsDate(int(checkdate))
                return 1
        
        
        else:
            tts("วันที่ไม่ถูกต้องค่ะ")
            return 1
        
    else:
        tts("โปรดระบุวันที่ด้วยค่ะ")
        return 1
    
    
    
def check_event():

        
    tz = pytz.timezone(('Asia/Bangkok'))
    print(datetime.datetime.now(tz=tz).replace(microsecond=0), 'Getting next event')
    now = datetime.datetime.now(tz=tz).replace(microsecond=0)
    then = now + datetime.timedelta(minutes=5)
    
    
 
    try:
    # ask Google for the calendar entries
        events = service.events().list(calendarId=CALENDAR_ID,timeMin=now.isoformat("T"),timeMax=then.isoformat("T"),singleEvents=True,pageToken = None,orderBy='startTime').execute()
        count = 0
        response = ""
            
        if(len(events['items']) == 0):
            print("No Notification to Report\n")
            return;
            
            
        for event in events['items']:

            try:
                eventTitle = event['summary']
                eventTitle = str(eventTitle)
                eventRawStartTime = event['start']
                start = event['start']['dateTime']
                    
                    
                    
                currentTime = datetime.datetime.now(tz=tz).replace(microsecond=0) 
                eventTime = parser.parse(start)
                
                    
                if currentTime < eventTime:
                    eventRawStartTime = eventRawStartTime['dateTime'].split("T")
                    temp = eventRawStartTime[1]
                    startHour, startMinute, temp = temp.split(":", 2)
                    startHour = int(startHour)
                    startMinute = str(startMinute)
                    startHour = str(startHour)
                    if(count == 0):
                        response = eventTitle + " เวลา " + startHour + ":" + startMinute
                    if(count > 0):
                        response = response +"กับ"+ eventTitle + " เวลา " + startHour + ":" + startMinute
                    count = count+1
                else:
                    print("Exceed Starting Time SKipping...........\n")
                    


            except (KeyError):
                count = 500
                tts("มีปัญหาในการต่อปฏิทิน Google ค่ะ")
                return
			
        if response == "":
            return
        
        if count != 500:
            phrase = "มีการแจ้งเตือนเรื่อง"+response + "ค่ะ"
            tts(phrase)
            
            try:
                add_noti = ("INSERT INTO notification_tb (userId,userKey,content,type,datetime,isAck) VALUE (%s,%s,%s,%s,%s,%s)")
                time_now = datetime.datetime.now(tz=tz).replace(microsecond=0)
                noti =('1','OWERTY1234',response,'alarm',time_now,'false')
                insertCloud(add_noti,noti)
            
            except Exception as e:
                tts("มีปัญหาในการต่อ Database ค่ะ")

                
                    
    except:
        tts("มีปัญหาในการต่อปฏิทินค่ะ")
        return



if __name__ == '__main__':
    getEventsToday()
    #checkcalendar(text)
