import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { prompt,user } = (await req.json()) as {
    prompt?: string;
    user?: string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  if (!user) {
    return new Response("No user in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.8,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1800,
    stream: true,
    n: 1,
    user
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
