import { NextRequest, NextResponse } from "next/server"
import axios from 'axios'

export async function POST(req: NextRequest) {
    const {searchInput, searchType} = await req.json();
    console.log("POST /api/search hit");

    if(!searchInput) {
        return NextResponse.json({message: "searchInput required"});
    }

    try {
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

        return NextResponse.json({data: cleanedResponse});
    } catch(err) {
        console.log("error whle fetching answer");
        return NextResponse.json({message: "Something went wrong while fetching answer", details: err});
    }
}
