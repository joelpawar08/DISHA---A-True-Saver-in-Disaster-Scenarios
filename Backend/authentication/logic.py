# authentication/logic.py - Main business logic


from dotenv import load_dotenv
import os

load_dotenv()

# authentication/logic.py - Main business logic

import os
import random
import time
from typing import Dict
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

# Twilio credentials from environment variables
TWILIO_SID = os.environ.get("TWILIO_SID")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER")

client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)

# OTP expiration time in seconds
OTP_EXPIRY = 300  # 5 minutes

def generate_otp() -> str:
    return str(random.randint(100000, 999999))

def send_otp(phone: str, otp_storage: Dict[str, Dict[str, any]]):
    otp = generate_otp()
    expiry = time.time() + OTP_EXPIRY
    otp_storage[phone] = {"otp": otp, "expiry": expiry}
    
    try:
        client.messages.create(
            body=f"Your OTP is {otp}",
            from_=TWILIO_PHONE_NUMBER,
            to=phone
        )
    except TwilioRestException as e:
        raise ValueError(f"Failed to send OTP: {e.msg}")

def verify_otp_and_register(phone: str, otp: str, otp_storage: Dict[str, Dict[str, any]], registered_users: Dict[str, bool]) -> bool:
    if phone not in otp_storage:
        return False
    
    stored = otp_storage[phone]
    if time.time() > stored["expiry"]:
        del otp_storage[phone]
        return False
    
    if stored["otp"] != otp:
        return False
    
    # Removed Twilio API registration due to trial limitations.
    # Manually add the number in Twilio console (Verified Caller IDs) using SMS method to enable calls.
    # If account is upgraded, you can add: client.outgoing_caller_ids.create(phone_number=phone, friendly_name=phone)
    # This would trigger a voice verification (user enters code), but not supported in trial.
    
    # Mark as registered in memory
    registered_users[phone] = True
    del otp_storage[phone]
    return True