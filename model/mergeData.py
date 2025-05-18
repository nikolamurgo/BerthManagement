import json

# Load arrivals data
with open("filtered_Arrivals.json", "r", encoding="utf-8") as f:
    arrivals = json.load(f)["data"]

# Load pilotage data
with open("filtered_Pilotage.json", "r", encoding="utf-8") as f:
    pilotage = json.load(f)["data"]

# Convert arrivals into a dictionary for fast lookup by Ticanje
arrivals_dict = {entry["Ticanje"]: entry for entry in arrivals}

# Prepare merged result
merged_data = []

for p in pilotage:
    ticanje_id = p.get("sifraticanja")
    if ticanje_id in arrivals_dict:
        # Merge both records (Ticanje only kept once)
        merged_record = {"Ticanje": ticanje_id, **arrivals_dict[ticanje_id], **p}
        merged_data.append(merged_record)

# Save merged data
with open("merged_filtered_data.json", "w", encoding="utf-8") as f:
    json.dump({"data": merged_data}, f, ensure_ascii=False, indent=4)

print(f"✅ Total merged records: {len(merged_data)}")
