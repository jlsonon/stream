import { NextRequest, NextResponse } from 'next/server';
import { GET as tmdbSyncHandler } from '@/app/api/tmdb/sync/route';

export const dynamic = 'force-dynamic';

/**
 * Scheduled Cron Sync Endpoint for Cinemix
 * Configured in vercel.json or triggered by external schedulers (GitHub Actions / cron-job.org)
 * Validates CRON_SECRET if configured in environment variables.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  const vercelCronHeader = req.headers.get('x-vercel-cron');
  const keyParam = req.nextUrl.searchParams.get('key');

  if (cronSecret) {
    const isBearerValid = authHeader === `Bearer ${cronSecret}`;
    const isKeyParamValid = keyParam === cronSecret;
    const isVercelCron = Boolean(vercelCronHeader);

    if (!isBearerValid && !isKeyParamValid && !isVercelCron) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid cron authorization token' },
        { status: 401 }
      );
    }
  }

  try {
    const syncRes = await tmdbSyncHandler(req);
    const syncData = await syncRes.json();

    return NextResponse.json({
      success: true,
      job: 'cinemix_automated_catalog_sync',
      syncedAt: new Date().toISOString(),
      itemCount: syncData.count || syncData.items?.length || 0,
      status: 'HEALTHY'
    });
  } catch (error: any) {
    console.error('Automated cron sync failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Cron sync execution failed',
        status: 'ERROR'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
