import json

# Load merged data
with open("merged_filtered_data.json", "r", encoding="utf-8") as f:
    merged_data = json.load(f)["data"]

# Mapping: old field -> new field name
field_map = {
    "Ticanje": "Vessel Code",
    "ImeLadje": "Vessel Name",
    "DolzinaLadje": "Vessel Length",
    "TicanjeStatus": "Vessel Status",
    "DatumPrihoda": "Vessel Arrival Date",
    "CasPrihoda": "Vessel ETA",
    "TovorTeza": "Cargo Weight",
    "Tovor": "Cargo Type",
    "GazLadje": "Draft",
    "BrutoTeza": "Total Vessel Weight",
    "oznaka": "Berth Code/Label",
    "Naziv1": "Berth Description",
    "sifraticanja": "Vessel Code",  # same as Ticanje
    "TrajanjePriveza": "Berthing Time",
    "CasPilotaze": "Date and Time of Action",
    "Akcija": "Action",
    "ugrez": "Draft",  # same as GazLadje
    "dolzina": "Vessel Length",  # same as DolzinaLadje
    "brutoregistersketone": "Total Vessel Weight",  # same
    "VezNaziv": "Berth Description",  # same as Naziv1
    "LadjaTipOznaka": "Label",
    "LadjaTipNaziv": "Vessel type for cargo",
    "VezSifra": "Berth Code/Label",  # same as oznaka
}

duplicate_fields = {
    "sifraticanja",
    "LadjaIme",
    "ugrez",
    "dolzina",
    "brutoregistersketone",
    "VezNaziv",
    "VezSifra",
}

cleaned_data = []

for entry in merged_data:
    cleaned_entry = {}

    # Apply field mapping
    for original_key, new_key in field_map.items():
        if original_key in duplicate_fields:
            continue
        value = entry.get(original_key)
        if value is not None:
            cleaned_entry[new_key] = value

    # Handle additional logic for "Odvez"
    if cleaned_entry.get("Action") == "Odvez":
        berthing_time = cleaned_entry.get("Berthing Time")

        if berthing_time is not None:
            try:
                berthing_time_int = int(berthing_time)
                unberthing_time = berthing_time_int / 2
                print("this is the berthing time", berthing_time)
                print("this is unberthing time", unberthing_time)
                cleaned_entry.pop("Vessel ETA", None)
                cleaned_entry["Unberthing Time"] = str(int(unberthing_time))
            except ValueError:
                cleaned_entry["Unberthing Time"] = None  # or skip/raise warning

        # Remove unwanted fields
        cleaned_entry.pop("Berthing Time", None)

    # Leave "Privez" untouched
    cleaned_data.append(cleaned_entry)

# Save cleaned data
with open("cleaned_merged_data.json", "w", encoding="utf-8") as f:
    json.dump({"data": cleaned_data}, f, ensure_ascii=False, indent=4)

# Print result
print(f"✅ Cleaned records saved: {len(cleaned_data)}")
