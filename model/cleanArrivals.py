import json

# Load your JSON data
with open("Arrivals.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Filter the list
filtered_data = {
    "data": [
        entry
        for entry in data.get("data", [])
        if entry.get("Tovor", "").strip() == "KONTEJNERJI"
    ]
}

# Save filtered data
with open("filtered_Arrivals.json", "w", encoding="utf-8") as f:
    json.dump(filtered_data, f, ensure_ascii=False, indent=4)

print(f"Filtered {len(filtered_data['data'])} entries containing Tovor = 'KONTEJNERJI'")
