import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDb } from '@/lib/mongodb';
import type { HarvestRecord } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const records = await db.collection('harvestRecords')
      .find({})
      .sort({ date: -1 }) // Sort by date descending
      .toArray();

    // Map _id to id and convert date back to ISO string if it's a Date object
    const formattedRecords = records.map(record => ({
      ...record,
      id: record._id.toString(),
      date: record.date instanceof Date ? record.date.toISOString() : record.date,
    }));
    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error('Failed to fetch harvest records:', error);
    return NextResponse.json({ message: 'Failed to fetch harvest records' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const record = await request.json() as Omit<HarvestRecord, '_id'>;

    if (!record.id || !record.date || record.coconutCount === undefined || record.totalWeight === undefined || record.salesPrice === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    
    const documentToInsert = {
      ...record,
      _id: new ObjectId(record.id), // Use client-generated ID as MongoDB's _id
      date: new Date(record.date), // Store date as BSON Date
    };

    await db.collection('harvestRecords').insertOne(documentToInsert as any);
    
    // Return the original record structure with string ID and ISO date
    return NextResponse.json({ ...record, date: new Date(record.date).toISOString() }, { status: 201 });

  } catch (error) {
    console.error('Failed to add harvest record:', error);
    // Check for duplicate key error (if using client-generated ID as _id and it collides)
    if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
        return NextResponse.json({ message: 'Duplicate ID provided for harvest record.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to add harvest record' }, { status: 500 });
  }
}
