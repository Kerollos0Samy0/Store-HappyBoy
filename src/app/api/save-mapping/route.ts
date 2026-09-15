import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const data = await request.json();
  const mappingPath = path.join(process.cwd(), 'public', 'mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: true });
}