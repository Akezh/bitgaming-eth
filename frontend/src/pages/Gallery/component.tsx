import { useEffect, useState } from "react";
import { VerticalNavigationTemplate } from "components/VerticalNavigationTemplate";

import { toast } from "react-toastify";

const baseAggregatorUrl = "https://aggregator.walrus-testnet.walrus.space";

export const GalleryPage = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const server_url = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";


  // Recursive function to extract blob IDs from nested JSON
  const extractBlobData = (data, result = []) => {
    if (typeof data === "object" && data !== null) {
      for (const [key, value] of Object.entries(data)) {
        if (value && typeof value === "object") {
          // If the object has a blob_id, push it to the result
          if (value.blob_id) {
            result.push({ filename: key, ...value });
          }
          // Recurse deeper into the object
          extractBlobData(value, result);
        }
      }
    }
    return result;
  };

  // Fetch gallery images from Walrus and recursively extract blob IDs
  useEffect(() => {

    fetch(server_url+"/gallery", {method: "GET"})
      .then((response) => response.json())
      .then((data) => {
        const images = extractBlobData(data); // Recursively extract blob data
        setGalleryImages(images); // Store the extracted images in state
      })
      .catch((error) => {
        console.error("Failed to fetch gallery images:", error);
        toast.error("Failed to load gallery images.");
      });
  }, []);

  return (
    <VerticalNavigationTemplate>
      <div className="py-4 mx-auto mt-4">
        <h2 className="text-3xl font-bold text-center text-white">Gallery</h2>
        <p className="text-center text-white opacity-80">
            Relive the Epic Moments of Your Dungeons & Dragons Quest
        </p>

        <div className="mt-8">
          <ImageSection title="Gallery Images" images={galleryImages} />
        </div>
      </div>
    </VerticalNavigationTemplate>
  );
};

const ImageSection = ({ title, images }) => (
    <div className="mt-6">
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {images.length === 0 ? (
          <p className="text-white">No images available.</p>
        ) : (
          images.slice(0,12).map((image, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={`${baseAggregatorUrl}/v1/${image.blob_id}`}
                alt={image.filename}
                className="w-full h-48 object-contain"
              />
              <div className="p-2 flex justify-center align-center items-center">
                <h3 className="text-white place-self-center">{image.filename}</h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
