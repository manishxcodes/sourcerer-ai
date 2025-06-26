import { NextRequest, NextResponse } from "next/server"
import axios from 'axios'

export async function POST(req: NextRequest) {
    const {searchInput, searchType} = await req.json();
    console.log("POST /api/search hit");


    if(!searchInput) {
        return NextResponse.json({message: "searchInput required"});
    }

    const result = await axios.get(`${process.env.GOOGLE_SEARCH_API_ENDPOINT}?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_ENGINE_ID}&q=${searchInput}`);

    console.log(result.data)

    return NextResponse.json({data: result.data});
}

export async function GET() {
    return NextResponse.json({"hello": "there"});
}