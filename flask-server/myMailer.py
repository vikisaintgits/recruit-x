import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os
load_dotenv()

fremail = os.getenv("EMAIL_ID")
api_key = os.getenv("EMAIL_API_KEY")

def mailto(to_addr,subject,content):
    for email in to_addr:
        print("current email=",email)
        msg = MIMEMultipart()
        msg['From'] = fremail
        msg['To'] = email
        msg['Subject'] = subject
        body = MIMEText(content, 'plain')
        msg.attach(body)

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.ehlo()
        server.starttls()
        server.login(fremail, api_key)
        server.send_message(msg, from_addr=fremail, to_addrs=[email])


