// app/api/colleges/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || 'All Locations';
    const maxFees = parseInt(searchParams.get('maxFees') || '100000');
    const coursesStr = searchParams.get('courses') || '';

const sql = neon("postgresql://neondb_owner:npg_xlCK1vkj7hXE@ep-odd-thunder-aoauylyg-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");


    let query = 'SELECT * FROM "College" WHERE 1=1';
    const params: any[] = [];

    // 1. Search Query
    if (search.trim() !== '') {
      params.push(`%${search}%`);
      query += ` AND ("name" ILIKE $${params.length} OR "overview" ILIKE $${params.length})`;
    }

    // 2. Location Dropdown
    if (location && location !== 'All Locations') {
      params.push(`%${location}%`);
      query += ` AND "location" ILIKE $${params.length}`;
    }

    // 3. Fees Slider Limit
    params.push(maxFees);
    query += ` AND "fees" <= $${params.length}`;

    query += ' ORDER BY "ranking" ASC';

    // Query Execute using standard Neon Driver syntax
    const colleges = await sql.query(query, params);

    return NextResponse.json(colleges);
  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


















    
  