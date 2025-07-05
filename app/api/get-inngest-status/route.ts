import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { runId } = await req.json();

    if (!runId) {
        return NextResponse.json(
            { error: "Missing required field: runId" }
        );
    }

    try {
        const result = await axios.get(`https://api.inngest.com/v1/events/${runId}/runs`, {
        headers: {
            Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
        },
    });

        return NextResponse.json(result.data);
    } catch(err) {
        //console.log("error: while gettng inngest status", {details: err});
        return NextResponse.json({error: "while gettng inngest status", details: err})
    }


} 