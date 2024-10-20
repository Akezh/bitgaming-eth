require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

// const userSessionDictionary = new Map<string, { assistantId: string; sessions: Record<string, string> }>();
const userSessionDictionary = new Map();

function generate_instruction(gameSettings) {
  const instructions = `You are the author of an interactive quest in a ${gameSettings.genre} setting. 
    Come up with an interesting story. Your message is a part of the story that forces the player(s) to make a choice.
    The game should consist of a short part (up to ${gameSettings.max_chars} characters) of your story and the options for player actions you propose.
    At the end of each of your messages, ask a question about how the player should act in the current situation, except the last turn. 
    Offer at minimum three options to choose from, but leave the opportunity to offer actions by player, the options should start with "1.", "2.", etc..
    The quest must be completed within ${gameSettings.turns} player turns.
    The game can be played by only one player. 
    Create a story. Players will respond with the structure {"user": "Response"}.
    With each turn the situation should become more intense and logically related to the previous turn.
    The player may encounter various dangers on theirs journey. 
    If the player chooses a bad answer, player may die and then the game will end.
    Use a speaking style that suits the chosen setting.
    Each time you would be notified with the current turn/round number.
        Make sure to finish the story within ${gameSettings.turns} rounds.
        Don't ask the user anything after the game finishes. Just congratulate.
    Communicate with players in (${gameSettings.language} language). Each response should be in the same language - ${gameSettings.language}.
    After the end of the game (due to the death of the player or due to the fact that all turns have ended), invite the player to start again`
  return instructions;
}

const startGameSession = async (
  wallet_address,
  session_id,
  gameSettings,
) => {
    if (!userSessionDictionary.has(wallet_address)) {
      const assistant = await openai.beta.assistants.create({
        name: 'Roleplaying game master',
        instructions: generate_instruction(gameSettings),
        model: 'gpt-4o',
      });

      // for each separate sessions, separate threads are created
      userSessionDictionary.set(wallet_address, { assistantId: assistant.id, sessions: {} });
    }
    
    const assistantId = userSessionDictionary.get(wallet_address)?.assistantId;
    const thread = await openai.beta.threads.create();

    // @ts-ignore
    userSessionDictionary.get(wallet_address).sessions[session_id] = thread.id;
    
    try {
      const run = await openai.beta.threads.runs.create(thread.id, { assistant_id: assistantId });
      
      const ai_message = await new Promise(resolve => {
        const timerLoopId = setInterval(async () => {
          const run_data = await openai.beta.threads.runs.retrieve(thread.id, run.id);
          if (run_data.status === 'completed') {
            clearInterval(timerLoopId);
            const messages = await openai.beta.threads.messages.list(thread.id);
            const ai_response = messages.data[0].content[0];
            resolve(ai_response.text.value);
          }
          if (run_data.status === 'failed' || run_data.status === 'expired' || run_data.status === 'cancelled') {
            clearInterval(timerLoopId);
            resolve('Sorry, I am having trouble understanding you. Could you please rephrase your question?');
          }
        }, 2000);
      });

      return ai_message;
    } catch (error) {
      console.error('Error fetching data from OpenAI:', error);
    }
};

const sendQuery = async (
  wallet_address,
  session_id,
  userPrompt) => {
    const assistantId = userSessionDictionary.get(wallet_address)?.assistantId;
    const threadId = userSessionDictionary.get(wallet_address)?.sessions[session_id];
    // console.log(userSessionDictionary, threadId)
    
    console.log(userPrompt)
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: userPrompt,
    });
    
    try {
      const run = await openai.beta.threads.runs.create(threadId, { assistant_id: assistantId });
      
      const ai_message = await new Promise(resolve => {
        const timerLoopId = setInterval(async () => {
          const run_data = await openai.beta.threads.runs.retrieve(threadId, run.id);
          if (run_data.status === 'completed') {
            clearInterval(timerLoopId);
            const messages = await openai.beta.threads.messages.list(threadId);
            const ai_response = messages.data[0].content[0];
            resolve(ai_response.text.value);
          }
          if (run_data.status === 'failed' || run_data.status === 'expired' || run_data.status === 'cancelled') {
            clearInterval(timerLoopId);
            resolve('Sorry, I am having trouble understanding you. Could you please rephrase your question?');
          }
        }, 2000);
      });

      return ai_message;
    } catch (error) {
      console.error('Error fetching data from OpenAI:', error);
    }
}

async function generateImageResponse(prompt) {
  const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
  });
  return response;
}

module.exports = {
  startGameSession,
  generateImageResponse,
  sendQuery
};
