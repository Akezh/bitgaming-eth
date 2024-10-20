import os
import subprocess
import json
import base64
from utils import num_to_blob_id, PATH_TO_WALRUS, PATH_TO_WALRUS_CONFIG, FULL_NODE_URL

# Configurations
assets = {
    "bronze": "assets/bronze",
    "silver": "assets/silver",
    "gold": "assets/gold"
}

# Function to upload file and return blobId and suiObjectId
def upload_file_to_walrus(file_path):
    store_json_command = f"""{{ "config" : "{PATH_TO_WALRUS_CONFIG}",
        "command" : {{ "store" :
        {{ "file" : "{file_path}", "epochs" : 25 }}}}
    }}"""
    result = subprocess.run(
        [PATH_TO_WALRUS, "json"],
        text=True,
        capture_output=True,
        input=store_json_command,
    )
    
    print(f"stdout: {result.stdout}")
    print(f"stderr: {result.stderr}")
    
    assert result.returncode == 0, f"Error uploading {file_path}, code: {result.returncode}"
    json_result_dict = json.loads(result.stdout.strip())

    if "newlyCreated" in json_result_dict:
        blob_id = json_result_dict["newlyCreated"]["blobObject"]["blobId"]
        endEpoch = json_result_dict["newlyCreated"]["blobObject"]["storage"]["endEpoch"]
    elif "alreadyCertified" in json_result_dict:
        blob_id = json_result_dict["alreadyCertified"]["blobId"]
        endEpoch = json_result_dict["alreadyCertified"]["endEpoch"]
        
    else:
        raise ValueError(f"Unexpected response from Walrus for {file_path}")
    
    return blob_id, endEpoch

# JSON structure to store new data with blobId
nft_data_with_blob = {
    "bronzeNFT": [],
    "silverNFT": [],
    "goldNFT": []
}

# Function to process all files in a directory and update JSON
def process_directory(nft_data_key, nft_assets_path):
    with open("./assets/brains_info.json", "r") as f:
        brains_info = json.load(f)
    brain_info = brains_info[f"{nft_key}NFT"]
    
    for i, file_name in enumerate(os.listdir(nft_assets_path)):
        file_path = os.path.join(nft_assets_path, file_name)

        if os.path.isfile(file_path):
            print(f"Uploading {file_path}")
            blob_id, endEpoch = upload_file_to_walrus(file_path)
            # Creating a new NFT dictionary
            data = brain_info[i]
            data["image"] = blob_id
            data["endEpoch"] = endEpoch
            nft_data_with_blob[nft_data_key].append(data)

# Process each directory and update the JSON structure
for nft_key, asset_dir in assets.items():
    process_directory(f"{nft_key}NFT", asset_dir)


# Save the updated JSON structure to a file
output_file = "assets/brains_info_uploaded.json"
with open(output_file, "w") as f:
    json.dump(nft_data_with_blob, f, indent=4)
print(f"New JSON file with blobIds saved to {output_file}")

blob_id, endEpoch = upload_file_to_walrus(output_file)
data = {"blob_id": blob_id, "endEpoch": endEpoch}
with open("assets/info_blob_id.json", "w") as f:
    json.dump(data, f)
print(f"Folder file saved to assets/info_blob_id.json")

