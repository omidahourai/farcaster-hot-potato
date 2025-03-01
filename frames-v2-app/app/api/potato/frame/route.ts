import { NextResponse } from "next/server";

export async function POST() {
  try {
    // You can validate the frame action here if needed
    // const body = await req.json();
    // console.log("Frame action received:", body);

    // Redirect to the potato game
    return NextResponse.json({
      status: 302, // HTTP redirect status
      location: process.env.NEXT_PUBLIC_HOST 
        ? `${process.env.NEXT_PUBLIC_HOST}/potato` 
        : "https://your-deployment-url.com/potato", // Update with your actual deployment URL
    });
  } catch (error) {
    console.error("Error processing frame action:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
