import { NextRequest, NextResponse } from 'next/server';
import { Potato } from '../../../models/potato';
import fs from 'fs';
import path from 'path';

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get('user');

  if (!user) {
    return NextResponse.json({ error: 'User not specified' }, { status: 400 });
  }

  const potatoes = readPotatoes();
  const createdPotatoes = potatoes.filter((potato) => potato.creator === user);
  const heldPotatoes = potatoes.filter((potato) => potato.currentHolder === user);

  return NextResponse.json({ createdPotatoes, heldPotatoes });
}