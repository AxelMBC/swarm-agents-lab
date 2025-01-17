import Groq from "groq-sdk";
import { ChatAnswers } from "../../dashboard/ChatWindow";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface RequestProps {
  json():
    | { answers: ChatAnswers[]; model: string }
    | PromiseLike<{ answers: ChatAnswers[]; model: string }>;
}

interface GroqReq {
  role: string;
  content: string;
}

export async function POST(request: RequestProps) {
  const { answers, model } = await request.json();

  const content: GroqReq[] = [];

  answers.map((item: ChatAnswers) =>
    content.push({
      role: item.author == "User" ? "user" : "assistant",
      content: item.message,
    })
  );
  console.log("coontent: ", content);

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: JSON.stringify(content) }],
    model,
  });

  console.log("response: ", response);
  return new Response(JSON.stringify({ message: "Groq Response", response }), {
    status: 200,
  });
}
