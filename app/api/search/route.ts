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
        .single();

        if(fetchError) {
            console.log("Something went wrong while checking existing search result")
        }

        console.log("mylibid", library_id);
        console.log("db libid", existingSearchResult.library_id);

        if(existingSearchResult) {
            console.log("Search result already exist");
            return NextResponse.json({data: existingSearchResult.search_result,
                chatData: existingSearchResult.id
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

        const {data, error: insertError} = await supabase
        .from("Chats")
        .insert([
            {
                library_id: library_id,
                search_result: cleanedResponse,
                search_query: searchInput
            }
        ]).select();
        console.log("chat:", data);

        if(insertError) {
            console.error("Error while saving user data", {detials: insertError});
            return;
        }

        console.log("data saved db", data);

        return NextResponse.json({
            data: cleanedResponse,
            chatData: data?.[0]?.id
        });
    } catch(err) {
        console.log("error whle fetching answer");
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