import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import type { CustomInterval } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const intervals = await db.collection('customIntervals')
      .find({})
      .toArray();
    
    const formattedIntervals = intervals.map(interval => ({
      ...interval,
      id: interval._id.toString(),
    }));
    return NextResponse.json(formattedIntervals);
  } catch (error) {
    console.error('Failed to fetch custom intervals:', error);
    return NextResponse.json({ message: 'Failed to fetch custom intervals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const interval = await request.json() as Omit<CustomInterval, '_id'>;

    if (!interval.id || !interval.name || !interval.description) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    const db = await getDb();
    const documentToInsert = {
      ...interval,
      _id: new ObjectId(interval.id),
    };

    await db.collection('customIntervals').insertOne(documentToInsert as any);
    return NextResponse.json(interval, { status: 201 });
  } catch (error) {
    console.error('Failed to add custom interval:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
        return NextResponse.json({ message: 'Duplicate ID provided for custom interval.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to add custom interval' }, { status: 500 });
  }
}
