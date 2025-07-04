import { NextRequest, NextResponse } from "next/server"
import axios from 'axios'
import { supabase } from "@/app/services/supabase";

export async function POST(req: NextRequest) {
    const {searchInput, searchType, library_id} = await req.json();

    if(!searchInput) {
        return NextResponse.json({message: "searchInput required"});
    }

    try {
        const {data: existingSearchResult, error: fetchError} = await supabase
        .from("Chats")
        .select("*")
        .eq("library_id", library_id)
        .eq("search_query", searchInput)
        .maybeSingle();

        if(existingSearchResult) {
            console.log("Search result already exist");
            return NextResponse.json({data: existingSearchResult.search_result,
                chatId: existingSearchResult.id,
                ai_response: existingSearchResult.ai_response
            });
        }

        const result = await axios.get(`${process.env.GOOGLE_SEARCH_API_ENDPOINT}?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_ENGINE_ID}&q=${searchInput}`);

        console.log(result.data)

        const items = result.data.items || [];
        
        const cleanedResponse = items.map((item: any) => (
            {
                title: item.title,
                snippet: item.snippet,
                link: item.link,
                displayLink: item.displayLink,
                ogImage: item.pagemap?.metatags?.[0]?.["og:image"],
                cseImage: item.pagemap?.cse_image?.[0]?.src
            }
        ));
        console.log("insertion start");

        const {data, error: insertError} = await supabase
        .from("Chats")
        .insert([
            {
                library_id: library_id,
                search_result: cleanedResponse,
                search_query: searchInput
            }
        ]).select("*");
        console.log("inserton end")
        console.log("chat:", data);

        if (insertError) {
            return NextResponse.json({
                message: "Error while saving to database",
                details: insertError.message,
            }, { status: 500 });
        }


        console.log("data saved db", data);

        return NextResponse.json({
            data: cleanedResponse,
            chatData: data?.[0]?.id
        });
    } catch(err) {
        console.log("error whle fetching answer++++++++++++++++++++++++++++++++++++++++++++++++++++++==",{details: err});
        return NextResponse.json({message: "Something went wrong while fetching answer", details: err});
    }
}


export async function GET() {
    const searchInput = 'latest news on sport, tech and politics in india'

    try {
        const result = await axios.get(`${process.env.GOOGLE_SEARCH_API_ENDPOINT}?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_ENGINE_ID}&q=${searchInput}`);

        const items = result.data.items || [];

        const cleanedResponse = items.map((item: any) => (
            {
                title: item.title,
                snippet: item.snippet,
                link: item.link,
                displayLink: item.displayLink,
                ogImage: item.pagemap?.metatags?.[0]?.["og:image"],
                cseImage: item.pagemap?.cse_image?.[0]?.src
            }
        ));

        return NextResponse.json(cleanedResponse);
    } catch(err) {
        console.log('Error while fetching news', {details: err});
        return NextResponse.json({message: "error whilre fetching news", details: err});

    }

}