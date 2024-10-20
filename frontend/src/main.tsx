import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import {
  DynamicContextProvider,
  EvmNetwork,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { morphHolesky } from "viem/chains";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CoinsProvider } from "config/context";
import {
  MainPage,
  ChimpGame,
  LeaderboardPage,
  ReactionGame,
  NumberMemory,
  DndGame
} from "./pages";
import { GalleryPage } from "./pages/Gallery"; // Correct import here
import { ChainId } from "config/chains";

const evmNetworks: EvmNetwork[] = [
  {
    blockExplorerUrls: [morphHolesky.blockExplorers.default.url],
    chainId: ChainId.Morph,
    chainName: "Morph Holesky Testnet",
    name: "Morph Holesky Testnet",
    iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
    nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
    networkId: morphHolesky.id,
    privateCustomerRpcUrls: [],
    rpcUrls: [morphHolesky.rpcUrls.default.http[0]],
    vanityName: "Morph Holesky",
  },
];

const config = createConfig({
  chains: [morphHolesky],
  multiInjectedProviderDiscovery: false,
  transports: {
    [morphHolesky.id]: http(),
  },
});

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/leaderboard",
    element: <LeaderboardPage />,
  },
  {
    path: "/chimpTest",
    element: <ChimpGame />,
  },
  {
    path: "/reactionTime",
    element: <ReactionGame />,
  },
  {
    path: "/numberMemory",
    element: <NumberMemory />,
  },
  {
    path: "/dndgame",
    element: <DndGame />,
  },
  {
    path: "/gallery",
    element: <GalleryPage />, // GalleryPage route
  }
]);

createRoot(document.getElementById("root")!).render(
  <DynamicContextProvider
    settings={{
      environmentId: import.meta.env.VITE_DYNAMIC_ENV_ID ?? "",
      walletConnectors: [EthereumWalletConnectors],
      overrides: { evmNetworks },
    }}
  >
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DynamicWagmiConnector>
          <CoinsProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </CoinsProvider>
        </DynamicWagmiConnector>
      </QueryClientProvider>
    </WagmiProvider>
  </DynamicContextProvider>
);
