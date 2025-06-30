import { inngest } from "@/app/inngest/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {searchInput, searchResult, chatId} = await req.json();

    if (!searchInput || !searchResult || !chatId) {
        return NextResponse.json(
            { error: "Missing required fields: searchInput, searchResult, or chatId" },
            { status: 400 }
        );
    }

    try {
        const inngestRunId = await inngest.send({
        name: "llm-model",
        data: {searchInput, searchResult, chatId}
        });;

        return NextResponse.json(inngestRunId.ids[0])
    } catch(err) {
        return NextResponse.json({error: "faild to trigger inngest function", details: err})
    }

}