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
        const result = await axios.get(`http://localhost:8288/v1/events/${runId}/runs`);

        return NextResponse.json(result.data);
    } catch(err) {
        console.log("error: while gettng inngest status", {details: err});
        return NextResponse.json({error: "while gettng inngest status", details: err})
    }


} 