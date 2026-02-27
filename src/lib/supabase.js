import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

export async function getCitizen(codename) {
    const { data, error } = await supabase
        .from('citizens')
        .select('*')
        .eq('codename', codename)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function getLatestCitizen() {
    const { data, error } = await supabase
        .from('citizens')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

export async function createCitizen(codename, specialization) {
    const { data, error } = await supabase
        .from('citizens')
        .insert({
            codename: codename.trim().toUpperCase(),
            specialization: specialization.toUpperCase(),
            achievements: {},
            xp_points: 0,
            level: 1,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateCitizenActivity(codename) {
    const { error } = await supabase
        .from('citizens')
        .update({ last_active: new Date().toISOString() })
        .eq('codename', codename);

    if (error) throw error;
}

export async function addAchievement(codename, achievementId) {
    const citizen = await getCitizen(codename);
    if (!citizen) return;

    const achievements = citizen.achievements || {};
    if (achievements[achievementId]) return;

    achievements[achievementId] = Date.now();
    const xpBonus = 100;

    const { error } = await supabase
        .from('citizens')
        .update({
            achievements,
            xp_points: citizen.xp_points + xpBonus,
            level: Math.floor((citizen.xp_points + xpBonus) / 500) + 1,
        })
        .eq('codename', codename);

    if (error) throw error;
}

export async function getNewsCache(category = 'ALL') {
    const { data, error } = await supabase
        .from('news_cache')
        .select('*')
        .eq('category', category)
        .gt('expires_at', new Date().toISOString())
        .order('fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

export async function setNewsCache(category, newsData) {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error } = await supabase
        .from('news_cache')
        .insert({
            category,
            data: newsData,
            expires_at: expiresAt,
        });

    if (error) throw error;
}

export async function cleanExpiredCache() {
    const { error } = await supabase
        .from('news_cache')
        .delete()
        .lt('expires_at', new Date().toISOString());

    if (error) console.error('Cache cleanup error:', error);
}

export async function getIdeas(category = 'ALL', limit = 20) {
    let query = supabase
        .from('idea_forge')
        .select('*')
        .order('flames', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

    if (category !== 'ALL') {
        query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}

export async function createIdea(title, description, category, authorId = null) {
    const { data, error } = await supabase
        .from('idea_forge')
        .insert({
            title: title.toUpperCase(),
            description,
            category,
            author_id: authorId,
            flames: 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function upvoteIdea(ideaId) {
    const { data: idea, error: fetchError } = await supabase
        .from('idea_forge')
        .select('flames')
        .eq('id', ideaId)
        .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
        .from('idea_forge')
        .update({ flames: idea.flames + 1 })
        .eq('id', ideaId);

    if (error) throw error;
}

export async function getPredictions(category = 'ALL', limit = 20) {
    let query = supabase
        .from('predictions')
        .select('*')
        .order('votes', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

    if (category !== 'ALL') {
        query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}

export async function createPrediction(content, category, authorId = null) {
    const { data, error } = await supabase
        .from('predictions')
        .insert({
            content,
            category,
            author_id: authorId,
            votes: 0,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function votePrediction(predictionId, delta = 1) {
    const { data: prediction, error: fetchError } = await supabase
        .from('predictions')
        .select('votes')
        .eq('id', predictionId)
        .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
        .from('predictions')
        .update({ votes: prediction.votes + delta })
        .eq('id', predictionId);

    if (error) throw error;
}
