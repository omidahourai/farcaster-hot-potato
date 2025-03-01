import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
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

function writePotatoes(potatoes: Potato[]) {
  fs.writeFileSync(filePath, JSON.stringify(potatoes, null, 2));
}

export async function POST(req: NextRequest) {
  const { creator } = await req.json();
  const newPotato: Potato = {
    id: uuidv4(),
    creator,
    currentHolder: creator,
    createdAt: new Date(),
    chain: [creator],
  };

  const potatoes = readPotatoes();
  potatoes.push(newPotato);
  writePotatoes(potatoes);

  return NextResponse.json(newPotato);
}