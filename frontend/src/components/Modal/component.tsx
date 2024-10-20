import clsx from "clsx";
import { NFTContract } from "config/contracts";
import React from "react";

type Props = {
  content: string;
  handleClick?: () => void;
  showModal: boolean;
  setShowModal: (x: boolean) => void;
  mintedToken: number;
};

export const Modal: React.FC<Props> = ({
  showModal,
  setShowModal,
  mintedToken,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-center h-screen bg-gray-200 modal-body absolute",
        showModal && "modal-active"
      )}
    >
      <div
        className={clsx(
          "fixed top-0 left-0 flex items-center justify-center w-full h-full modal",
          !showModal && "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
          onClick={() => setShowModal(false)}
        ></div>

        <div className="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-lg">
          <div className="px-6 py-4 text-left modal-content">
            <div className="flex items-center justify-between pb-3">
              <p className="text-2xl font-bold">Congratulations!</p>
            </div>

            <p>You are now a part of our Brain DAO!</p>
            <p>You can checkout your new exclusive NFT on OpenSea.</p>

            <div className="flex justify-end pt-2">
              <a
                className="p-3 px-4 mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400"
                href={`${import.meta.env.VITE_OPENSEA}/${
                  NFTContract.address
                }/${mintedToken}`}
                target="_blank"
                rel="noreferrer"
              >
                Opensea
              </a>
              <button
                className="p-3 px-4 text-white bg-indigo-500 rounded-lg modal-close hover:bg-indigo-400"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
