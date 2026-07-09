import { NextRequest, NextResponse } from 'next/server';

/**
 * HTB API Proxy — forwards requests to labs.hackthebox.com to avoid CORS.
 * The client passes the Bearer token in the Authorization header.
 * Usage: GET /api/htb/user/info  → proxies to https://labs.hackthebox.com/api/v4/user/info
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const endpoint = path.join('/');
  const targetUrl = `https://labs.hackthebox.com/api/v4/${endpoint}`;

  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No Authorization header' }, { status: 401 });
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        Accept: 'application/json, text/plain, */*',
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
    return NextResponse.json({ error: 'Proxy error', message: err.message }, { status: 502 });
  }
}
