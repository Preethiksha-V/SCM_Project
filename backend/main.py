from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predictor import predict_demand, get_trends, get_weekly_data
from redistributor import get_redistribution

app = FastAPI(title="Food Waste Reduction AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class FoodInput(BaseModel):
    day: str
    event: str
    meal_type: str
    planned: int

@app.post("/predict")
def predict(data: FoodInput):
    prediction = predict_demand(
        data.day,
        data.event,
        data.meal_type,
        data.planned
    )
    redistribution = get_redistribution(prediction["expected_surplus"])
    return {
        "prediction": prediction,
        "redistribution": redistribution
    }

@app.get("/trends")
def trends():
    return {
        "day_trends": get_trends(),
        "weekly_data": get_weekly_data()
    }

@app.get("/ngos")
def get_ngos():
    import json
    with open("data/ngos.json") as f:
        return json.load(f)