import { useAccount } from "wagmi";
import { VerticalNavigationTemplate } from "components/VerticalNavigationTemplate";
import { useCoinsContext } from "config/context";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { GameTemplate } from "components/GameTemplate";
import ReactMarkdown from 'react-markdown';
import ApiIcon from '@mui/icons-material/Api';
import { Button, TextField} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

// Define types for server responses
interface GameResponse {
  message: string;
  choices: string[];
  imageUrl?: string;
}

enum MODES {
    INIT,
    GAMING,
    WATING,
    END
}

interface Message {
    type: "text" | "img";
    content: string;
    speaker: "client" | "server";
  }

const icon = <ApiIcon />;
const REWARD = 100;

export const DndGame: React.FC = () => {

    const localTheme = createTheme({
        palette: {
            primary: {
                main: '#6c757d',  // Grayish primary color
              },
              secondary: {
                main: '#adb5bd',  // Lighter grayish secondary color
              },
        },
      });

  // State hooks
  const { address } = useAccount(); 
  const [turns, setTurns] = useState(5);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [gameState, setGameState] = useState({
    mode: MODES.INIT,
    turns: 0
  });
  const [activeGame, setActiveGame] = useState(false);
  const { setCoins } = useCoinsContext();
  const [choice, setChoice] = useState("");
  const navigate = useNavigate();


  const server_url = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

  useEffect(() => {
    if (gameState.turns === turns) {
        setGameState((gameState) => ({
            ...gameState, 
            mode: MODES.END
        }))
        
      setCoins((coins: number) => {
        localStorage.setItem(
          "coins",
          (coins + REWARD).toString()
        );
        return coins + REWARD;
      });
    }
  }, [gameState.turns, setCoins]);


  // Function to start the game
  const startGame = async () => {
    try {
        setGameState((gameState) => ({
            ...gameState, 
            mode: MODES.WATING,
            }));
        setChoice( "Waiting for AI to response..." );

      const response = await fetch(server_url+"/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gptVersion: "gpt-4o-mini",
          language: "English",
          genre: "Dungeons",
          turns: turns,
          wallet_address: address
        }),
      });

      setGameState((gameState) => ({
        ...gameState, 
        mode: MODES.GAMING,
        turns: gameState.turns+1
        }));

      const data: GameResponse = await response.json();

        const extractedText = data.message.split('1.')[0];
      
      updateChat("server", extractedText);
      setChoices(data.choices);
      console.log(data.choices);
      
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  // Function to send user input
  const sendUserInput = async () => {
    console.log("userinput", choice)
    if (!choice) return;

    updateChat("client", `**You**: 
        ${choice}`);

    let userInput;
    console.log(typeof choice);
    if (typeof choice === 'object') {
        userInput = choice[0];
    } else {
      userInput = choice;
    }
    
    try {
        setGameState((gameState) => ({
            ...gameState, 
            mode: MODES.WATING,
            }));
        setChoice( "Waiting for AI to response..." );
      const response = await fetch(server_url+"/continue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: userInput, wallet_address: address }),
      });

      setGameState((gameState) => ({
        ...gameState, 
        mode: MODES.GAMING,
        turns: gameState.turns+1
        }));
      const data: GameResponse = await response.json();
      const extractedText = data.message.split('1.')[0];
      
      if (data.imageUrl) displayImage(data.imageUrl);
      updateChat("server", extractedText);
      setChoices(data.choices);
    } catch (error) {
      console.error("Error sending user input:", error);
    }
  };

  // Function to update chat log
  const updateChat = (speaker:"client" | "server", message: string) => {
    setChatLog((prevLog) => [...prevLog, {speaker: speaker, type:"text", content: message}]);
  };

  // Function to display an image in chat (can be improved based on design)
  const displayImage = (imageUrl: string) => {
    setChatLog((prevLog) => [...prevLog, {speaker: "server", type: "img", content: imageUrl}]);
  };

  const pregameText = (
    <>
      <div className="flex items-center mt-2 text-white">
        
        <ApiIcon style={{ fontSize: '6rem' }} />

        <div>
          <h2 className="text-4xl font-bold text-white fade">Dungeons & Dragons Challenge</h2>
          <p className="mt-2 text-xl text-white">
            Are You Ready for an Epic Adventure?
          </p>
        </div>
      </div>
      <div className="mt-4 mb-4 text-white">
        <p className="mb-5 text-xl font-bold text-white">Description</p>
        <p className="mb-4 text-white">
          Step into the shoes of a legendary hero, embarking on a dangerous quest full of mystery and magic. Your decisions will shape the world around you as you battle fierce enemies, navigate treacherous landscapes, and uncover hidden secrets.
        </p>
        <p className="text-white">
          The challenge starts easy, but each turn brings tougher encounters, cunning traps, and new allies. Your courage and wisdom will be tested with every step you take. Fail too many times, and your journey may come to a tragic end, but succeed, and your name will echo in the halls of legends!
        </p>
        <div className="mt-4">
          <p>
            <b>Difficulty: </b>Varying by encounter
          </p>
          <p>
            <b>Reward per victory: </b>
            {REWARD} BIT
          </p>
        </div>
      </div>
    </>
  );

  const gameDesc = (
    <div className="text-center animate-smooth-appear">
      <ApiIcon style={{ fontSize: '6rem' }} />

      <h2 className="text-4xl font-bold text-white fade">Dungeons & Dragons</h2>
      <p className="mt-5 text-2xl text-white">
        Choose your path wisely as you embark on a grand adventure.
      </p>
      <p className="mt-2 text-2xl text-white">
        Each decision will shape your fate, and the journey will grow more challenging with every step.
      </p>
    </div>
  );

  return (
    <VerticalNavigationTemplate>
        <div className="flex flex-col h-full overflow-y-auto text-white gap-4">
        <GameTemplate
            name="DnD"
            description="DnD game with AI chatbot"
            icon={icon}
            activeGame={activeGame}
            setActiveGame={setActiveGame}
            className="px-4"
            pregameText={pregameText}
            gameDesc={gameDesc}
            >
    <ThemeProvider theme={localTheme}>
    {gameState.mode === MODES.INIT && (
      <div className="flex flex-col items-center flex-grow overflow-scroll p-4 text-white gap-2">
        <div className="field text">
            <label htmlFor="turns">Number of Turns:</label> &nbsp;
            <input
            type="number"
            id="turns"
            value={turns}
            min="2"
            max="20"
            onChange={(e) => setTurns(Number(e.target.value))}
            />
        </div>
        <div className="mx-2">
                <Button 
            variant="contained"
            onClick={startGame}
            >Start Game</Button>
        </div>

    </div>

    )}
    {(gameState.mode !== MODES.INIT) && (
    <div className="flex flex-col h-full overflow-y-auto p-4 text-white gap-4">
        <div id="chat-log" className="flex flex-col gap-4">
          {chatLog.map((message, index) => (
            <div
            key={index}
            className={`p-3 rounded-lg m-2 text-justify border-2 ${
            message.speaker === "client"
                ? "self-end ml-24 text-white"  // User message styles
                : "mr-24 text-white"               // Server message styles
            }`}
            >
            {message.type === "text" && <ReactMarkdown>{message.content}</ReactMarkdown>}
            {message.type === "img" && (
            <img src={message.content} alt={`content-${index}`} className="rounded-md" />
            )}
            </div>


          ))}
        </div>

    {gameState.mode !== MODES.END && (
        <div>
            <div className="flex items-center justify-between mt-4 gap-4">
                <TextField
                    placeholder={"Enter your choice..."}
                    value={choice}
                    color="primary"
                    multiline
                    minRows={2}
                    fullWidth
                    onChange={e => setChoice(e.target.value)}
                    disabled={gameState.mode===MODES.WATING}

                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendUserInput();
                    }}
                    InputProps={{
                        sx: {
                        color: 'white',  // Change the text color
                        },
                    }}

                    sx = {{color:"white"}}
                />

                
                <Button 
                className="mt-4"
                    disabled={gameState.mode===MODES.WATING}
                    variant="contained"
                    onClick={() => sendUserInput()}
                    sx={{
                        '&.Mui-disabled': {
                        backgroundColor: '#6c757d',  // Color when disabled
                        color: 'lightgray',           // Text color when disabled
                        }
                    }}
                >
                    Send
                </Button>
            </div>

            <div className="gap-4 flex flex-col">
                {choices.map((choice, index) => (
                <Button 
                variant="contained"
                key={index} onClick={() => { setChoice(choice);}}>
                    {choice}
                </Button>
                ))}
            </div>
        </div>
    )}

    {gameState.mode === MODES.END && (
        <div className="flex flex-col gap-4 p-4">
            <h2>
            Wow! You got {REWARD} BIT tokens!
            </h2>
            <Button
                variant="contained"
                onClick={()=>{navigate("/")}}>
                Back to Main page
            </Button>
        </div>
        
    )} 
      
    </div>
    )}
    </ThemeProvider>
    
        </GameTemplate>
        </div>
    </VerticalNavigationTemplate>
    
  );
};

export default DndGame;