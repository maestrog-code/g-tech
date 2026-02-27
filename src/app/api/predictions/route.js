import { getPredictions, createPrediction, votePrediction } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category') || 'ALL';
        const limit = parseInt(searchParams.get('limit') || '20');

        const predictions = await getPredictions(category, limit);

        return NextResponse.json({
            predictions,
            count: predictions.length,
            category,
        });
    } catch (error) {
        console.error('Predictions fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch predictions' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const { content, category } = await req.json();

        if (!content?.trim() || !category) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const prediction = await createPrediction(content, category);

        return NextResponse.json({
            success: true,
            prediction,
        });
    } catch (error) {
        console.error('Prediction creation error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create prediction' },
            { status: 500 }
        );
    }
}

export async function PATCH(req) {
    try {
        const { id, delta } = await req.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Missing prediction ID' },
                { status: 400 }
            );
        }

        await votePrediction(id, delta || 1);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Vote error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to vote on prediction' },
            { status: 500 }
        );
    }
}
