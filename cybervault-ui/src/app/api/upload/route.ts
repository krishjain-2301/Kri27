import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const journalId = formData.get('journalId') as string || 'unassigned';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Structure: CyberVault_Data/assets/<journalId>/<uuid>-<filename>
    const assetsDir = path.resolve(process.cwd(), 'CyberVault_Data', 'assets', journalId);
    
    if (!fs.existsSync(assetsDir)) {
      await mkdir(assetsDir, { recursive: true });
    }

    // Clean filename
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const uniqueFilename = `${randomUUID()}-${originalName}`;
    const filePath = path.join(assetsDir, uniqueFilename);

    await writeFile(filePath, buffer);

    // Return the URL that can be used to serve this file
    // We will need another API route to serve the file: /api/assets?path=...
    const fileUrl = `/api/assets?journalId=${journalId}&filename=${uniqueFilename}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
