import { getLatestCitizen, createCitizen, getCitizen } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const codename = searchParams.get('codename');

        let citizen;
        if (codename) {
            citizen = await getCitizen(codename);
        } else {
            citizen = await getLatestCitizen();
        }

        return NextResponse.json(citizen || {});
    } catch (error) {
        console.error('Citizen fetch error:', error);
        return NextResponse.json({}, { status: 200 });
    }
}

export async function POST(req) {
    try {
        const { codename, specialization } = await req.json();

        if (!codename?.trim() || !specialization?.trim()) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const validSpecs = ['EXPLORER', 'ARCHITECT', 'HACKER', 'VOYAGER'];
        if (!validSpecs.includes(specialization.toUpperCase())) {
            return NextResponse.json(
                { success: false, message: 'Invalid specialization' },
                { status: 400 }
            );
        }

        const citizen = await createCitizen(codename, specialization);

        return NextResponse.json({
            success: true,
            message: 'Identity Secured',
            citizen,
        });
    } catch (error) {
        console.error('Citizen creation error:', error);

        if (error.code === '23505' || error.message?.includes('duplicate')) {
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
