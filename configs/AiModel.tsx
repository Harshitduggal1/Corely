import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Check if the API key is defined
if (!apiKey) {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined in the environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "write a script to generate 30 seconds video on topic : Interesting historical story along with AI image prompt in realistic format for each scene and give me the result in JSON format with imagePrompt and ContextText as field",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '## 30-Second Historical Story Video Script (JSON Format)\n\n```json\n[\n  {\n    "imagePrompt": "A bustling marketplace in ancient Rome, with people selling food, clothes, and pottery. The sun is shining brightly, and there are many lively conversations happening.",\n    "contextText": "In the heart of ancient Rome, a bustling marketplace buzzed with activity. Merchants hawked their wares, haggling with customers over the price of fresh fruit and exotic spices."\n  },\n  {\n    "imagePrompt": "A young woman, dressed in a simple tunic, nervously holding a small scroll. She is looking around the marketplace, searching for someone.",\n    "contextText": "Among the crowds, a young woman named Livia searched desperately for her brother, Marcus. He had promised to meet her here after his lessons, but he was nowhere to be found."\n  },\n  {\n    "imagePrompt": "A weathered, muscular man, with a scar across his cheek, standing beside a stall selling maps. He is looking at Livia with a knowing smile.",\n    "contextText": "Suddenly, a gruff voice broke through the din.  “Looking for someone, little one?” A man with a weathered face and a single scar across his cheek stood beside a stall of intricately drawn maps."\n  },\n  {\n    "imagePrompt": "Livia, looking confused, holding the scroll out to the man. The man looks at the scroll and nods his head.",\n    "contextText": "Livia, desperate, held out the scroll with Marcus’s likeness to the man. The man took it, examined it briefly, and then nodded, his eyes twinkling with a mischievous glint."\n  },\n  {\n    "imagePrompt": "The man points to a narrow alleyway. Livia, with a look of hope, rushes towards the alley.",\n    "contextText": "Without a word, the man pointed to a narrow, shadowy alleyway. Hope surged through Livia as she raced towards it, her heart pounding with anticipation."\n  },\n  {\n    "imagePrompt": "Livia finds Marcus, tied up and gagged, in the alleyway. He looks scared and confused.",\n    "contextText": "The alley was dark and damp, but Livia’s eyes quickly found her brother, bound and gagged, his face etched with fear and confusion."\n  },\n  {\n    "imagePrompt": "Livia frees Marcus, tears of relief streaming down her face. They embrace tightly.",\n    "contextText": "With trembling hands, Livia untied Marcus, tears of relief streaming down her face. They embraced tightly, their reunion a moment of pure joy amidst the chaos."\n  },\n  {\n    "imagePrompt": "A group of Roman soldiers, looking stern and determined, walk into the alleyway, stopping in front of Livia and Marcus.",\n    "contextText": "Their reunion was cut short by the sound of heavy footsteps. Roman soldiers, stern and disciplined, strode into the alleyway, their presence a stark contrast to the vibrant marketplace beyond."\n  },\n  {\n    "imagePrompt": "The man from the marketplace, now standing with the soldiers, points at Livia and Marcus. The soldiers take them into custody.",\n    "contextText": "The man who had pointed out the alleyway stood with the soldiers, his mischievous glint replaced by a cold, calculating gaze. He pointed to Livia and Marcus, and the soldiers moved swiftly to take them into custody."\n  },\n  {\n    "imagePrompt": "Livia and Marcus, walking in chains, being escorted away from the marketplace by the soldiers. The marketplace is still bustling with activity, but they are now at its periphery.",\n    "contextText": "Livia and Marcus, their hands bound with heavy chains, were escorted away from the marketplace, their brief moment of freedom extinguished by the harsh reality of their situation."\n  }\n]\n```\n\n**Explanation:**\n\nThis script creates a short narrative in 10 scenes, each with an image prompt and context text. \n\n* **Image Prompts:** These are detailed descriptions for AI image generation tools like Midjourney, DALL-E 2, or Stable Diffusion. They provide specific instructions to create visually appealing images that align with the story.\n* **Context Text:** These provide the narration for each scene. They can be used as voice-over text or as captions during the video.\n\n**Note:** This script is intended to be a base structure. You can modify it by:\n\n* **Adding more scenes:** You can extend the story by adding scenes to provide more details and intrigue.\n* **Adjusting the image prompts:** Change the specific details in the prompts to get different visual styles and perspectives.\n* **Adding sound and music:** Include sound effects and music to enhance the storytelling experience.\n\nBy following these steps, you can create a captivating 30-second video that brings this historical story to life! \n',
        },
      ],
    },
  ],
});
