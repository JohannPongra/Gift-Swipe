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

function pruefeClientUndSession() {
    if (!supabaseClient) {
        throw new Error('SUPABASE_KONFIGURATION_FEHLT');
    }

    if (!sessionToken) {
        throw new Error('SESSION_TOKEN_FEHLT');
    }
}

async function ladeSessionKonfiguration() {
    pruefeClientUndSession();

    const { data, error } = await supabaseClient.rpc('get_session_config', {
        p_access_token: sessionToken
    });

    if (error) {
        throw error;
    }

    if (!data || !data.length) {
        throw new Error('SESSION_NICHT_GEFUNDEN');
    }

    return {
        id: data[0].session_id,
        modus: data[0].session_mode
    };
}

async function ladeKategorienOnline() {
    pruefeClientUndSession();

    const { data, error } = await supabaseClient.rpc('get_categories_for_session', {
        p_access_token: sessionToken
    });

    if (error) {
        throw error;
    }

    return data.map(function (kategorie) {
        return {
            id: kategorie.id,
            titel: kategorie.title,
            beschreibung: kategorie.description,
            bildUrl: kategorie.image_url,
            bildAlt: kategorie.title
        };
    });
}

async function ladeGeschenkideenOnline() {
    pruefeClientUndSession();

    const { data, error } = await supabaseClient
        .rpc('get_gifts_for_session', { p_access_token: sessionToken });

    if (error) {
        throw error;
    }

    return data.map(function (geschenkidee) {
        return {
            id: geschenkidee.id,
            titel: geschenkidee.title,
            beschreibung: geschenkidee.description,
            bildUrl: geschenkidee.image_url,
            bildAlt: geschenkidee.title,
            produktUrl: geschenkidee.product_url
        };
    });
}

async function speichereEntscheidungOnline(geschenkideeId, entscheidung) {
    pruefeClientUndSession();

    const { error } = await supabaseClient.rpc('submit_decision', {
        p_access_token: sessionToken,
        p_gift_idea_id: geschenkideeId,
        p_choice: entscheidung
    });

    if (error) {
        throw error;
    }
}

async function speichereKategorieEntscheidungOnline(kategorieId, entscheidung) {
    pruefeClientUndSession();

    const { error } = await supabaseClient.rpc('submit_category_decision', {
        p_access_token: sessionToken,
        p_category_id: kategorieId,
        p_choice: entscheidung
    });

    if (error) {
        throw error;
    }
}

window.giftSwipeApi = {
    ladeSessionKonfiguration,
    ladeKategorien: ladeKategorienOnline,
    ladeGeschenkideen: ladeGeschenkideenOnline,
    speichereEntscheidung: speichereEntscheidungOnline,
    speichereKategorieEntscheidung: speichereKategorieEntscheidungOnline
};
