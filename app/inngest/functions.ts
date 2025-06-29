import { supabase } from "../services/supabase";
import { inngest } from "./client";

// export const helloWorld = inngest.createFunction(
//   { id: "hello-world" },
//   { event: "test/hello.world" },
//   async ({ event, step }) => {
//     await step.sleep("wait-a-moment", "1s");
//     return { message: `Hello ${event.data.email}!` };
//   },
// );


export const llmModel = inngest.createFunction(
    {id: 'llm-model'},
    {event: 'llm-model'},
    async ({event, step}) => {
        const aiResponse = await step.ai.infer(
            'generate-ai-llm-model-call', {
                model:step.ai.models.gemini({
                    model: 'gemini-1.5-flash',
                    apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY
                }),
                body: {
                    contents: [
                        {
                            role: 'system',
                            parts: [{
                                text: `You are a helpful research assistant.

                                The user searched for: "${event.data.searchInput}"

                                Below is a list of search result summaries. Your task:
                                - Analyze the content and summarize the topic.
                                - Output a clean and accurate explanation in well-formatted **Markdown**.
                                - Use headings, bullet points, and links where appropriate.
                                - Include a short **TL;DR** at the top.

                                Respond ONLY with the final Markdown summary.

                                Search Results:
                                ${JSON.stringify(event.data.searchResult, null, 2)}`
                            }]
                        }, {
                            role: "user",
                            parts: [{
                                text: JSON.stringify(event.data.searchResult)
                            }]
                        }
                    ]
                }
            }
        )

        const parts = aiResponse?.candidates?.[0].content?.parts?.[0];

        let markdownText: string
        if(parts && 'text' in parts) {
            markdownText = parts.text
        }

        // save airesponse in db/chats
        const saveResponse = await step.run('saveResponse', async() => {
            const { data, error: updateError} = await supabase
            .from('Chats')
            .update({ai_response: markdownText})
            .eq("id", event.data.chatId)
            .select();

            if(updateError) {
                console.log("error whle updating aireponse", {details: updateError});
            }

            return data;
        })

        return aiResponse;
    }
)