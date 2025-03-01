import { NeynarAPIClient, Configuration, isApiErrorResponse } from "@neynar/nodejs-sdk";
import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 });
  }

  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-neynar-experimental': 'false',
        'x-api-key': process.env.NEYNER_API_KEY
      }
    };
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/by_username?username=${username}`, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const user = await response.json();
    
    return NextResponse.json(user.user.fid, { status: 200 });
  } catch (error) {
    if (isApiErrorResponse(error)) {
      return NextResponse.json({ error: error.response.data }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Generic Error' }, { status: 500 });
    }
  }
}