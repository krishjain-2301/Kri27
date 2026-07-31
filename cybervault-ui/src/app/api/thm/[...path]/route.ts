import { NextRequest, NextResponse } from 'next/server';

/**
 * THM API Proxy — forwards requests to tryhackme.com to avoid CORS.
 * Usage: GET /api/thm/user/public-profile?username=foo -> proxies to https://tryhackme.com/api/user/public-profile?username=foo
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const endpoint = path.join('/');
  
  const searchParams = req.nextUrl.search;
  const targetUrl = `https://tryhackme.com/api/${endpoint}${searchParams}`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'CyberVault/1.0 (Mozilla/5.0)',
        'Accept': 'application/json, text/plain, */*',
      },
      cache: 'no-store',
    });

    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'THM Proxy error', message: err.message }, { status: 502 });
  }
}
