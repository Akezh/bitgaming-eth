## Walrus for NFT Upload

This project contains a Python script, script.py, designed to upload NFTs to the Walrus blob storage service. Additionally, the script generates and uploads a JSON file (info_blob_id.json) that maintains a collection of blob IDs associated with the uploaded NFTs, which serves like a folder of the NFT address.

## Structure

- script.py                  # Main script to upload NFTs and generate metadata
- utils.py                  # Some utility functions provided by Walrus
- assets/                # Folder for local storage of the output files
- README.md                   # This README file
- CONFIG                   # Configuration file for Walrus

## Features

	1.	NFT Upload to Walrus Blob:
	•	The script can upload individual NFTs (image files) to the Walrus blob storage.
	•	Each uploaded file will return a unique blob_id which is stored in a local JSON file (info_blob_id.json).
	2.	Metadata Upload:
	•	After all NFTs are uploaded, the script generates a JSON file (info_blob_id.json), which contains all the blob_ids and related metadata.
	•	The JSON file is then uploaded to the Walrus blob as well, preserving the collection of NFTs and their identifiers.
	3.	info_blob_id.json:
	•	This file tracks the blob_id and associated metadata for each uploaded NFT. It ensures the mapping between the NFT files and their Walrus blob_ids is stored and accessible. It is stored in BitGaming server for serving and retrieving NFTs and is key for our NFT displaying page. 
