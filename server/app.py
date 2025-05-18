from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
import pandas as pd
import pickle
from datetime import datetime
import joblib
from pydantic import BaseModel, Field


class VesselInput(BaseModel):
    vessel_length: str = Field(..., alias="Vessel Length")
    draft: str = Field(..., alias="Draft")
    cargo_weight: str = Field(..., alias="Cargo Weight")
    total_vessel_weight: str = Field(..., alias="Total Vessel Weight")
    arrival_hour: int = Field(..., alias="Arrival_Hour")
    arrival_day: int = Field(..., alias="Arrival_Day")

    class Config:
        allow_population_by_field_name = True



app = FastAPI()
model = joblib.load("model2_2.pkl")




def convert_comma_number(value):
    if isinstance(value, str):
        return float(value.replace(",", "."))
    return value

# Enable CORS for your frontend origin (adjust port if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def convert_to_vessel(vessel_json):
    try:
        length = float(vessel_json["Vessel Length"].replace(",", "."))
        draft = float(vessel_json["Draft"].replace(",", "."))
        cargo_weight = float(vessel_json["Cargo Weight"])
        total_weight = float(vessel_json["Total Vessel Weight"])
        eta_str = vessel_json.get("Arrival Date and Time ETA")
        dt = datetime.strptime(eta_str, "%d. %m. %Y %H:%M:%S")
        arrival_hour = dt.hour
        arrival_day = dt.day

        return {
            "length": length,
            "draft": draft,
            "cargo_weight": cargo_weight,
            "total_weight": total_weight,
            "arrival_hour": arrival_hour,
            "arrival_day": arrival_day,
        }
    except Exception as e:
        raise ValueError(f"Error converting vessel data: {e}")

@app.get("/get-data/")
async def get_data():
    try:
        with open("k.json", "r") as f:
            data = json.load(f)

        if isinstance(data, dict):
            for key, value in data.items():
                if isinstance(value, list):
                    # Filter only "Privezana" records
                    filtered = [item for item in value if item.get("Action") == "Privez"]
                    return {"data": filtered[:100]}
            return {"error": "No list found in JSON dict values"}
        elif isinstance(data, list):
            filtered = [item for item in data if item.get("Action") == "Privezana"]
            return {"data": filtered[:100]}
        else:
            return {"error": "Unsupported JSON structure"}
    except Exception as e:
        return {"error": str(e)}


@app.post("/predict/")
async def predict_berth(data: VesselInput):
    processed = {
        "Vessel Length": convert_comma_number(data.vessel_length),
        "Draft": convert_comma_number(data.draft),
        "Cargo Weight": convert_comma_number(data.cargo_weight),
        "Total Vessel Weight": convert_comma_number(data.total_vessel_weight),
        "Arrival_Hour": data.arrival_hour,
        "Arrival_Day": data.arrival_day,
    }

    df = pd.DataFrame([processed])
    predicted_berth = model.predict(df)
    return {"predicted_berth": predicted_berth[0]}



@app.get("/")
async def root():
    return {"message": "Berth Management API. Use /docs for API docs."}
