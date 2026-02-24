# app.py - FastAPI entry point

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict
from authentication.logic import send_otp, verify_otp_and_register
from dotenv import load_dotenv
import os
from Maps.safeloc import get_nearest_safe_locations
load_dotenv()

app = FastAPI()

class PhoneNumber(BaseModel):
    phone: str

class OTPVerification(BaseModel):
    phone: str
    otp: str

# In-memory storage for OTPs (not production-ready, loses data on restart)
otp_storage: Dict[str, Dict[str, any]] = {}  # Fixed typing to Dict[str, Dict[str, any]]

# In-memory storage for registered users (demo only)
registered_users: Dict[str, bool] = {}


from pydantic import BaseModel


class LocationRequest(BaseModel):
    latitude: float
    longitude: float



@app.post("/safe-locations")
async def safe_locations(data: LocationRequest):
    try:
        results = get_nearest_safe_locations(
            lat=data.latitude,
            lon=data.longitude
        )
        return {"locations": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        

@app.post("/register")
async def register_user(data: PhoneNumber):
    try:
        send_otp(data.phone, otp_storage)
        return {"message": "OTP sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/verify")
async def verify_user(data: OTPVerification):
    try:
        if verify_otp_and_register(data.phone, data.otp, otp_storage, registered_users):
            return {"message": "Registration and verification successful. For calling features, manually add this number as a verified caller ID in Twilio console via SMS."}
        else:
            raise HTTPException(status_code=400, detail="Invalid OTP")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))