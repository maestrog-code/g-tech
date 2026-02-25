import { openDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const db = await openDb();
    const citizen = await db.get('SELECT * FROM citizens ORDER BY registered_at DESC LIMIT 1');
    return NextResponse.json(citizen || {});
}

export async function POST(req) {
    const { codename, specialization } = await req.json();
    const db = await openDb();

    try {
        await db.run(
            'INSERT INTO citizens (codename, specialization) VALUES (?, ?)',
            [codename, specialization]
        );
        return NextResponse.json({ success: true, message: 'Identity Secured' });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return NextResponse.json({ success: false, message: 'Codename already exists in the vault.' }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: 'Registry offline' }, { status: 500 });
    }
}
