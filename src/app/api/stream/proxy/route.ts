import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
      return NextResponse.json({ error: 'Missing target url parameter' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Prepare outbound proxy headers
    const headers: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
    };

    // Forward range header if present (crucial for video scrubbing/streaming)
    const clientRange = request.headers.get('range');
    if (clientRange) {
      headers['Range'] = clientRange;
    }

    // Dynamic spoofing based on target host
    const refererParam = searchParams.get('referer');
    if (refererParam) {
      headers['Referer'] = refererParam;
      try {
        const refUrl = new URL(refererParam);
        headers['Origin'] = refUrl.origin;
      } catch {
        // Ignore
      }
    } else {
      headers['Referer'] = `${parsedUrl.protocol}//${parsedUrl.host}/`;
      headers['Origin'] = `${parsedUrl.protocol}//${parsedUrl.host}`;
    }

    const upstreamResponse = await fetch(targetUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
      redirect: 'follow',
    });

    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Range, Content-Type, Accept');
    responseHeaders.set('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');

    // Forward essential media streaming headers
    const contentType = upstreamResponse.headers.get('content-type') || 'application/octet-stream';
    responseHeaders.set('Content-Type', contentType);

    const contentLength = upstreamResponse.headers.get('content-length');
    if (contentLength) responseHeaders.set('Content-Length', contentLength);

    const contentRange = upstreamResponse.headers.get('content-range');
    if (contentRange) responseHeaders.set('Content-Range', contentRange);

    const acceptRanges = upstreamResponse.headers.get('accept-ranges') || 'bytes';
    responseHeaders.set('Accept-Ranges', acceptRanges);

    responseHeaders.set('Cache-Control', 'public, max-age=3600');

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Proxy request failed', message: err.message },
      { status: 502 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type, Accept',
    },
  });
}
