import React, { useEffect, useState } from "react";

interface Props {
  imageUrl: string;
  name: string;
  desc: string;
  contentLeft: string;
  contentRight: string;
  contentMain: string;
  handleClick?: () => void;
  insufficient: boolean;
  owned?: boolean;
  baseAggregatorUrl: string; // The base URL for fetching the blob
}

export const NFTCard: React.FC<Props> = ({
  imageUrl,
  name,
  desc,
  contentLeft,
  contentRight,
  contentMain,
  handleClick,
  insufficient,
  owned,
  baseAggregatorUrl,
}: Props) => {

  const [fetchedImageUrl, setFetchedImageUrl] = useState<string | null>(null);
  // const [loadingImage, setLoadingImage] = useState<boolean>(true);

  // Fetch the image if imageUrl is a blob ID
  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Assuming imageUrl is a blob ID, fetch the actual image URL
        const blobUrl = `${baseAggregatorUrl}/v1/${imageUrl}`;
        
        // Fetch the image and set the URL once loaded
        setFetchedImageUrl(blobUrl);
        // setLoadingImage(false);
      } catch (error) {
        console.error("Error fetching image:", error);
        // setLoadingImage(false); // Set loading to false in case of error
      }
    };

    // Fetch the image if imageUrl is present
    if (imageUrl) {
      fetchImage();
    }
  }, [imageUrl, baseAggregatorUrl]);


  return (
    <div style={{ border: "1px solid #2c3a43" }} className="rounded-2xl">
      <div className="relative">
        <div
          className="rounded-lg h-60"
          style={{
            // backgroundImage: loadingImage
            //   ? "url(/placeholder-image.jpg)" // Show a placeholder while loading
            //   : `url(${fetchedImageUrl})`, // Show the fetched image once loaded
            backgroundImage: `url(${fetchedImageUrl})`,
            backgroundSize: "contain",
            backgroundRepeat: "none",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute z-10 bottom-4 left-4">
          <p className="text-xl font-bold text-black">{name}</p>
          <p className="text-xs text-black">{desc}</p>
        </div>
        <button
          className="absolute z-10 hidden w-12 h-12 rounded-full top-4 right-4"
          onClick={handleClick}
        >
          <img alt="icon" src="/hammer.svg" />
        </button>
      </div>
      <hr
        style={{
          borderColor: "#2c3a43",
        }}
      />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-300 uppercase">{contentLeft}</p>
          <p className="text-xs text-gray-300 uppercase">{contentRight}</p>
        </div>
        <p className="my-4 overflow-hidden text-xs italic text-gray-300">
          {contentMain}
        </p>

        {!insufficient && !owned && (
          <button
            style={{ width: "100%" }}
            onClick={handleClick}
            className="block px-4 py-3 my-2 mt-2 font-bold text-white rounded focus:outline-none bg-purple-950 ring-purple-800 transition-all hover:ring-2"
          >
            Mint NFT Card
          </button>
        )}
        {insufficient && !owned && (
          <div className="px-4 py-3 my-2 mt-2 font-bold text-center text-white rounded focus:outline-none transition-all bg-gray-750">
            <p>Insufficient BIT tokens</p>
          </div>
        )}
        {owned && (
          <div className="px-4 py-3 my-2 mt-2 font-bold text-center text-white rounded focus:outline-none transition-all bg-gray-750">
            <p>Already owned</p>
          </div>
        )}
      </div>
    </div>
  );
};