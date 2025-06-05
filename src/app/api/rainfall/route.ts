import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import type { RainfallData } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const records = await db.collection('rainfallData')
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    const formattedRecords = records.map(record => ({
      ...record,
      id: record._id.toString(),
      date: record.date instanceof Date ? record.date.toISOString() : record.date,
    }));
    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error('Failed to fetch rainfall data:', error);
    return NextResponse.json({ message: 'Failed to fetch rainfall data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as Omit<RainfallData, '_id'>;

    if (!data.id || !data.date || data.amount === undefined ) {
         return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const documentToInsert = {
      ...data,
      _id: new ObjectId(data.id),
      date: new Date(data.date),
    };

    await db.collection('rainfallData').insertOne(documentToInsert as any);
    return NextResponse.json({ ...data, date: new Date(data.date).toISOString() }, { status: 201 });
  } catch (error) {
    console.error('Failed to add rainfall data:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
        return NextResponse.json({ message: 'Duplicate ID provided for rainfall data.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to add rainfall data' }, { status: 500 });
  }
}
