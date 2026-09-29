const supabaseConfig = window.GIFTSWIPE_CONFIG;
const hatSupabaseKonfiguration = Boolean(
    supabaseConfig &&
    supabaseConfig.supabaseUrl &&
    supabaseConfig.supabaseAnonKey &&
    !supabaseConfig.supabaseUrl.includes('DEIN-') &&
    !supabaseConfig.supabaseAnonKey.includes('DEIN-')
);

const supabaseClient = hatSupabaseKonfiguration
    ? window.supabase.createClient(
        supabaseConfig.supabaseUrl,
        supabaseConfig.supabaseAnonKey
    )
    : null;

const sessionToken = new URLSearchParams(window.location.search).get('token');

window.giftSwipeSupabaseClient = supabaseClient;

async function ladeGeschenkideenOnline() {
    if (!supabaseClient) {
        throw new Error('SUPABASE_KONFIGURATION_FEHLT');
    }

    if (!sessionToken) {
        throw new Error('SESSION_TOKEN_FEHLT');
    }

    const { data, error } = await supabaseClient
        .from('gift_ideas')
        .select('id, title, price, description, image_url, product_url')
        .order('created_at', { ascending: true });

    if (error) {
        throw error;
    }

    return data.map(function (geschenkidee) {
        return {
            id: geschenkidee.id,
            titel: geschenkidee.title,
            preis: geschenkidee.price,
            beschreibung: geschenkidee.description,
            bildUrl: geschenkidee.image_url,
            bildAlt: geschenkidee.title,
            produktUrl: geschenkidee.product_url
        };
    });
}

async function speichereEntscheidungOnline(geschenkideeId, entscheidung) {
    if (!supabaseClient || !sessionToken) {
        throw new Error('SESSION_NICHT_BEREIT');
    }

    const { error } = await supabaseClient.rpc('submit_decision', {
        p_access_token: sessionToken,
        p_gift_idea_id: geschenkideeId,
        p_choice: entscheidung
    });

    if (error) {
        throw error;
    }
}

window.giftSwipeApi = {
    ladeGeschenkideen: ladeGeschenkideenOnline,
    speichereEntscheidung: speichereEntscheidungOnline
};
