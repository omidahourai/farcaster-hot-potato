import { NeynarAPIClient, Configuration, isApiErrorResponse } from "@neynar/nodejs-sdk";
import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');

  if (!fid) {
    return NextResponse.json({ error: 'Missing fid' }, { status: 400 });
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
    const response = await fetch(`https://api.neynar.com/v2/farcaster/following?fid=${fid}&limit=100`, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const user = await response.json();

    const usernames = user.users.map((u: any) => ({ username: u.user.username, fid: u.user.fid }));
    console.log(usernames);
    
    return NextResponse.json(usernames, { status: 200 });
  } catch (error) {
    if (isApiErrorResponse(error)) {
      return NextResponse.json({ error: error.response.data }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Generic Error' }, { status: 500 });
    }
  }
}