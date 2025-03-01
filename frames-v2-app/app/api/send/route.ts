import { NextRequest, NextResponse } from 'next/server';
import { Potato } from '../../../models/potato';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const filePath = path.resolve('./data/potatoes.json');

function readPotatoes(): Potato[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const data = fs.readFileSync(filePath, 'utf8');
  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return [];
  }
}

function writePotatoes(potatoes: Potato[]) {
  fs.writeFileSync(filePath, JSON.stringify(potatoes, null, 2));
}

async function resolveUsernameToAddress(username: string): Promise<string | null> {
  try {
    const response = await axios.get(`https://warpcast-api-url/users/${username}`);
    return response.data.walletAddress;
  } catch (error) {
    console.error("Failed to resolve username:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  console.log("Received POST request to /api/send");
  try {
    const { potatoId, sender, receiver } = await req.json();
    console.log("Request body:", { potatoId, sender, receiver });

    if (!potatoId || !sender || !receiver) {
      console.log("Missing required fields");
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const receiverAddress = await resolveUsernameToAddress(receiver);
    if (!receiverAddress) {
      console.log("Invalid receiver username");
      return NextResponse.json({ error: 'Invalid receiver username' }, { status: 400 });
    }

    if (sender === receiverAddress) {
      console.log("Cannot send potato to yourself");
      return NextResponse.json({ error: 'Cannot send potato to yourself' }, { status: 400 });
    }

    const potatoes = readPotatoes();
    const potato = potatoes.find((p) => p.id === potatoId);
    if (potato && potato.currentHolder === sender) {
      const lastSender = potato.chain[potato.chain.length - 2];
      if (lastSender === receiverAddress) {
        console.log("Cannot send potato to the last person who sent it to you");
        return NextResponse.json({ error: 'Cannot send potato to the last person who sent it to you' }, { status: 400 });
      }

      potato.currentHolder = receiverAddress;
      potato.chain.push(receiverAddress);
      writePotatoes(potatoes);
      console.log("Potato updated:", potato);
      return NextResponse.json(potato);
    } else {
      console.log("Invalid potato or sender");
      return NextResponse.json({ error: 'Invalid potato or sender' }, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to process request:", error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}