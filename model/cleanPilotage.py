import json

# Load your JSON data (replace with actual file or string)
with open("Pilotage.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Filter entries where LadjaTipOznaka is "CT"
filtered_data = {
    "data": [entry for entry in data["data"] if entry.get("LadjaTipOznaka") == "CT"]
}

# Save the cleaned data
with open("filter_Pilotage.json", "w", encoding="utf-8") as f:
    json.dump(filtered_data, f, ensure_ascii=False, indent=4)

print(f"Filtered {len(filtered_data['data'])} entries containing Tovor = 'KONTEJNERJI'")
