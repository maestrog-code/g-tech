import { openDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = await openDb();
        const result = await db.execute(
            'SELECT * FROM citizens ORDER BY registered_at DESC LIMIT 1'
        );
        const citizen = result.rows[0] || {};
        return NextResponse.json(citizen);
    } catch {
        return NextResponse.json({});
    }
}

export async function POST(req) {
    const { codename, specialization } = await req.json();

    if (!codename?.trim() || !specialization?.trim()) {
        return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    try {
        const db = await openDb();
        await db.execute({
            sql: 'INSERT INTO citizens (codename, specialization) VALUES (?, ?)',
            args: [codename.trim(), specialization.trim()],
        });
        return NextResponse.json({ success: true, message: 'Identity Secured' });
    } catch (err) {
        if (err.message?.includes('UNIQUE constraint failed')) {
            return NextResponse.json(
                { success: false, message: 'Codename already exists in the vault.' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: 'Registry offline' },
            { status: 500 }
        );
    }
}
