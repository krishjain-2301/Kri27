import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { readFile } from 'fs/promises';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const journalId = searchParams.get('journalId');
  const filename = searchParams.get('filename');

  if (!journalId || !filename) {
    return new NextResponse('Missing parameters', { status: 400 });
  }

  // Prevent directory traversal attacks
  const safeJournalId = path.basename(journalId);
  const safeFilename = path.basename(filename);

  const filePath = path.resolve(process.cwd(), 'CyberVault_Data', 'assets', safeJournalId, safeFilename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  try {
    const fileBuffer = await readFile(filePath);
    
    // Guess mime type roughly for images
    let mimeType = 'application/octet-stream';
    if (safeFilename.endsWith('.png')) mimeType = 'image/png';
    else if (safeFilename.endsWith('.jpg') || safeFilename.endsWith('.jpeg')) mimeType = 'image/jpeg';
    else if (safeFilename.endsWith('.gif')) mimeType = 'image/gif';
    else if (safeFilename.endsWith('.webp')) mimeType = 'image/webp';
    else if (safeFilename.endsWith('.svg')) mimeType = 'image/svg+xml';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving asset:', error);
    return new NextResponse('Error reading file', { status: 500 });
  }
}
