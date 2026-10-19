import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'cinelog-store.json');

interface UserStoreData {
  profiles: any[];
  watchProgress: Record<string, any>;
  myList: Record<string, string[]>;
  settings: Record<string, any>;
  debridConfig?: {
    apiKey?: string;
    provider?: string;
    enabled?: boolean;
  };
  lastSyncedAt: string;
}

let memoryStore: Record<string, UserStoreData> = {};

function getStoreData(): Record<string, UserStoreData> {
  try {
    if (Object.keys(memoryStore).length > 0) {
      return memoryStore;
    }
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      memoryStore = JSON.parse(content);
      return memoryStore;
    }
  } catch (err) {
    // Fall back to memory store
  }
  return memoryStore;
}

function saveStoreData(data: Record<string, UserStoreData>): void {
  memoryStore = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Non-blocking in serverless environments
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';

    const store = getStoreData();
    const userData = store[userId] || {
      profiles: [],
      watchProgress: {},
      myList: {},
      settings: {},
      lastSyncedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      userId,
      data: userData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Sync failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || 'default-user';
    const store = getStoreData();

    const current = store[userId] || {
      profiles: [],
      watchProgress: {},
      myList: {},
      settings: {},
      lastSyncedAt: new Date().toISOString(),
    };

    // Deep merge incoming updates
    const updated: UserStoreData = {
      profiles: body.profiles && Array.isArray(body.profiles) ? body.profiles : current.profiles,
      watchProgress: body.watchProgress
        ? { ...current.watchProgress, ...body.watchProgress }
        : current.watchProgress,
      myList: body.myList ? { ...current.myList, ...body.myList } : current.myList,
      settings: body.settings ? { ...current.settings, ...body.settings } : current.settings,
      debridConfig: body.debridConfig ? { ...current.debridConfig, ...body.debridConfig } : current.debridConfig,
      lastSyncedAt: new Date().toISOString(),
    };

    store[userId] = updated;
    saveStoreData(store);

    return NextResponse.json({
      success: true,
      userId,
      data: updated,
      message: 'User state persisted and synchronized across devices',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Save sync failed' },
      { status: 500 }
    );
  }
}
