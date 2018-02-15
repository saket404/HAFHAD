import imaplib
import email
import re
from dateutil import parser
from tts import tts



def getSender(email):
    """
        email -- the email whose sender is desired
        Returns:
        Sender of the email.
    """
    sender = email['From']
    m = re.match(r'(.*)\s<.*>', sender)
    if m:
        return m.group(1)
    return sender


def getDate(email):
    return parser.parse(email.get('date'))


def getMostRecentDate(emails):
    """
        Returns the most recent date of any email in the list provided.
        Arguments:
        emails -- a list of emails to check
        Returns:
        Date of the most recent email.
    """
    dates = [getDate(e) for e in emails]
    dates.sort(reverse=True)
    if dates:
        return dates[0]
    return None


def fetchUnreadEmails(since=None, markRead=False, limit=None):
    """
        Fetches a list of unread email objects from a user's Gmail inbox.
        Arguments:
        profile -- contains information related to the user (e.g., Gmail
                   address)
        since -- if provided, no emails before this date will be returned
        markRead -- if True, marks all returned emails as read in target inbox
        Returns:
        A list of unread email objects.
    """
    conn = imaplib.IMAP4_SSL('imap.gmail.com')
    conn.debug = 0
    conn.login("hafhadcpe@gmail.com", "test12345678")
    conn.select(readonly=(not markRead))

    msgs = []
    (retcode, messages) = conn.search(None, '(UNSEEN)')

    if retcode == 'OK' and messages != ['']:
        numUnread = len(messages[0].split())
        if limit and numUnread > limit:
            return numUnread

        for num in messages[0].split():
            # parse email RFC822 format
            ret, data = conn.fetch(num, '(RFC822)')
            raw_email = data[0][1]
            raw_email_string = raw_email.decode('utf-8')
            msg = email.message_from_string(raw_email_string)

            if not since or getDate(msg) > since:
                msgs.append(msg)
    conn.close()
    conn.logout()

    return msgs


def checkemail():
    """
        Responds to user-input, typically speech text, with a summary of
        the user's Gmail inbox, reporting on the number of unread emails
        in the inbox, as well as their senders.
        Arguments:
        text -- user-input, typically transcribed speech
        mic -- used to interact with the user (for both input and output)
        profile -- contains information related to the user (e.g., Gmail
                   address)
    """
    try:
        msgs = fetchUnreadEmails(limit=5)


        senders = [getSender(e) for e in msgs]
    except imaplib.IMAP4.error:
        print(
            "I'm sorry. I'm not authenticated to work with your Gmail.")
        return

    if not senders:
        tts("คุณไม่มีอีเมลใหม่ค่ะ")
    elif len(senders) == 1:
        tts("คุณมีอีเมลใหม่จาก " + senders[0] + "ค่ะ")
    else:
        response = "คุณมี %d อีเมลใหม่" % len(senders)
        unique_senders = list(set(senders))
        if len(unique_senders) > 1:
            unique_senders[-1] = 'เเละ' + unique_senders[-1]
            response += "จาก "
            response += ' เเละ '.join(senders)
        else:
            response += "จาก" + unique_senders[0]

        response = response +"ค่ะ"
        tts(response)
        print("\nCheck Email Done\n")
        
        

