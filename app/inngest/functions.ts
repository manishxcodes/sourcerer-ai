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
                            parts: [{
                                text: `Using the user input below, summarize and search for the main topic. Return output in well-formatted markdown. User input is: ${event.data.searchInput}

                                Here are some related search results:
                                ${JSON.stringify(event.data.searchResult)}

                                Summarize the topic and return a properly formatted Markdown article with:
                                - A title
                                - Subheadings like "Overview", "Key Features"
                                - Bullet points
                                - Links (if available)
                                - Avoid repetition.
                                `
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

            console.log("markdownText: ",markdownText);

            return data;
        })

        return aiResponse;
    }
)