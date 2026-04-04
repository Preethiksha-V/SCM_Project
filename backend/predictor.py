import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder
import json

# Load data
df = pd.read_csv("data/food_consumption.csv")

# Load event multipliers
with open("data/events.json") as f:
    events_data = json.load(f)
event_multipliers = {e["event"]: e["multiplier"] for e in events_data}

# Encoders
day_encoder = LabelEncoder()
meal_encoder = LabelEncoder()

df["day_encoded"] = day_encoder.fit_transform(df["day"])
df["meal_encoded"] = meal_encoder.fit_transform(df["meal_type"])
df["event_encoded"] = df["event"].apply(lambda x: 0 if x == "None" else 1)

# Features & Target
X = df[["day_encoded", "event_encoded", "meal_encoded", "prepared"]]
y = df["consumed"]

# Train Model
model = LinearRegression()
model.fit(X, y)

def predict_demand(day: str, event: str, meal_type: str, planned: int):
    try:
        day_enc = day_encoder.transform([day])[0]
    except:
        day_enc = 0

    try:
        meal_enc = meal_encoder.transform([meal_type])[0]
    except:
        meal_enc = 0

    event_enc = 0 if event == "None" else 1
    multiplier = event_multipliers.get(event, 1.0)

    # Linear Regression prediction
    lr_prediction = model.predict([[day_enc, event_enc, meal_enc, planned]])[0]

    # Moving average (last 7 days same meal)
    same_meal = df[df["meal_type"] == meal_type].tail(7)
    moving_avg = np.mean(same_meal["consumed"].values) * multiplier

    # Final prediction = average of both
    final_prediction = round((lr_prediction + moving_avg) / 2)
    surplus = planned - final_prediction
    surplus_pct = (surplus / planned) * 100 if planned > 0 else 0

    return {
        "predicted_demand": final_prediction,
        "moving_avg_baseline": round(moving_avg),
        "lr_prediction": round(lr_prediction),
        "planned": planned,
        "expected_surplus": round(surplus),
        "surplus_percentage": round(surplus_pct, 1),
        "alert": surplus_pct > 20,
        "status": "Surplus" if surplus > 0 else "Shortage",
        "confidence": "High" if abs(lr_prediction - moving_avg) < 20 else "Medium"
    }

def get_trends():
    trends = df.groupby("day").agg(
        avg_prepared=("prepared", "mean"),
        avg_consumed=("consumed", "mean"),
        avg_wasted=("wasted", "mean")
    ).reset_index()
    return trends.to_dict(orient="records")

def get_weekly_data():
    weekly = df.groupby("date").agg(
        total_prepared=("prepared", "sum"),
        total_consumed=("consumed", "sum"),
        total_wasted=("wasted", "sum")
    ).reset_index()
    return weekly.to_dict(orient="records")