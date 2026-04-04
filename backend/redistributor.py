import json

with open("data/ngos.json") as f:
    ngos = json.load(f)

def get_redistribution(surplus: float):
    if surplus <= 0:
        return {
            "message": "No surplus predicted — no redistribution needed",
            "suggestions": [],
            "total_surplus": 0
        }

    suggestions = []
    remaining = surplus

    for ngo in ngos:
        if remaining <= 0:
            break
        allocate = min(ngo["capacity"], remaining)
        suggestions.append({
            "ngo": ngo["name"],
            "contact": ngo["contact"],
            "area": ngo["area"],
            "allocated_meals": round(allocate)
        })
        remaining -= allocate

    return {
        "total_surplus": round(surplus),
        "suggestions": suggestions,
        "fully_allocated": remaining <= 0,
        "unallocated": round(max(remaining, 0))
    }