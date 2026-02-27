import { getIdeas, createIdea, upvoteIdea } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category') || 'ALL';
        const limit = parseInt(searchParams.get('limit') || '20');

        const ideas = await getIdeas(category, limit);

        return NextResponse.json({
            ideas,
            count: ideas.length,
            category,
        });
    } catch (error) {
        console.error('Ideas fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ideas' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const { title, description, category } = await req.json();

        if (!title?.trim() || !description?.trim() || !category) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const idea = await createIdea(title, description, category);

        return NextResponse.json({
            success: true,
            idea,
        });
    } catch (error) {
        console.error('Idea creation error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create idea' },
            { status: 500 }
        );
    }
}

export async function PATCH(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Missing idea ID' },
                { status: 400 }
            );
        }

        await upvoteIdea(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Upvote error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to upvote idea' },
            { status: 500 }
        );
    }
}
