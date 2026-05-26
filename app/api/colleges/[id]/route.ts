import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const collegeId = resolvedParams.id;

    if (!collegeId) {
      return NextResponse.json({ error: "ID parameter missing" }, { status: 400 });
    }

    const sql = neon("postgresql://neondb_owner:npg_xlCK1vkj7hXE@ep-odd-thunder-aoauylyg-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

   
    const rows = await sql`SELECT * FROM "College" WHERE id = ${collegeId}`;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "College not found in database" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);

  } catch (error: any) {
    console.error("CRITICAL BACKEND FAILURE:", error.message);
    return NextResponse.json(
      { error: "Database mapping error", details: error.message }, 
      { status: 500 }
    );
  }
}