import { NextResponse } from "next/server";

export async function GET() {
  try {
    const agentId = process.env.ELEVENLABS_AGENT_ID;

    if (!agentId) {
      console.error("ELEVENLABS_AGENT_ID is not set in environment variables");
      return NextResponse.json(
        { error: "Agent ID not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      agentId,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!agentId || !apiKey) {
      return NextResponse.json(
        { error: "Missing configuration" },
        { status: 500 }
      );
    }

    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (!signedUrlResponse.ok) {
      const errorText = await signedUrlResponse.text();
      console.error("Failed to get signed URL:", errorText);
      return NextResponse.json(
        { error: "Failed to authenticate with ElevenLabs" },
        { status: 500 }
      );
    }

    const data = await signedUrlResponse.json();

    return NextResponse.json({
      signedUrl: data.signed_url,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
