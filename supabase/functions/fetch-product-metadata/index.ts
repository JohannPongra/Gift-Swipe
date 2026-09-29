import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}

function isAllowedUrl(value: unknown): value is string {
    if (typeof value !== 'string' || value.length > 2048) {
        return false;
    }

    try {
        const url = new URL(value);
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
        return false;
    }
}

function decodeHtml(value: string) {
    return value
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .trim();
}

function metaContent(html: string, target: string) {
    const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

    for (const tag of metaTags) {
        const nameMatch = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i);
        const contentMatch = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i);

        if (nameMatch?.[1].toLowerCase() === target && contentMatch?.[1]) {
            return decodeHtml(contentMatch[1]);
        }
    }

    return null;
}

function pageTitle(html: string) {
    const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    return titleMatch?.[1] ? decodeHtml(titleMatch[1]) : null;
}

function extractImageUrls(html: string, baseUrl: string) {
    const imageUrls = new Set<string>();
    const addImage = (value: unknown) => {
        if (typeof value !== 'string' || !value.trim()) {
            return;
        }
        try {
            imageUrls.add(new URL(value.trim(), baseUrl).toString());
        } catch {
            // Ignore malformed image URLs from external pages.
        }
    };

    addImage(metaContent(html, 'og:image'));
    addImage(metaContent(html, 'twitter:image'));

    const jsonLdBlocks = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) ?? [];
    for (const block of jsonLdBlocks) {
        const jsonText = block.replace(/^.*?>/s, '').replace(/<\/script>\s*$/i, '').trim();
        try {
            const parsed = JSON.parse(jsonText);
            const visit = (value: unknown) => {
                if (!value || typeof value !== 'object') {
                    return;
                }
                if (Array.isArray(value)) {
                    value.forEach(visit);
                    return;
                }
                const object = value as Record<string, unknown>;
                const image = object.image;
                if (typeof image === 'string') {
                    addImage(image);
                } else if (Array.isArray(image)) {
                    image.forEach(addImage);
                } else if (image && typeof image === 'object') {
                    addImage((image as Record<string, unknown>).url);
                }
                visit(object['@graph']);
            };
            visit(parsed);
        } catch {
            // Ignore invalid JSON-LD blocks and keep other metadata.
        }
    }

    return [...imageUrls].slice(0, 8);
}

Deno.serve(async (request) => {
    if (request.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
        return jsonResponse({ error: 'Only POST is supported.' }, 405);
    }

    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: request.headers.get('Authorization') ?? '' } } }
    );
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return jsonResponse({ error: 'Admin login required.' }, 401);
    }

    let payload: { url?: unknown };
    try {
        payload = await request.json();
    } catch {
        return jsonResponse({ error: 'Invalid JSON body.' }, 400);
    }

    if (!isAllowedUrl(payload.url)) {
        return jsonResponse({ error: 'Please provide a valid http(s) product URL.' }, 400);
    }

    let pageResponse: Response;
    try {
        pageResponse = await fetch(payload.url, {
            headers: {
                'User-Agent': 'GiftSwipeMetadataBot/1.0',
                Accept: 'text/html,application/xhtml+xml'
            },
            redirect: 'follow'
        });
    } catch {
        return jsonResponse({ error: 'The product page could not be reached.' }, 502);
    }

    if (!pageResponse.ok) {
        return jsonResponse({ error: `The product page returned HTTP ${pageResponse.status}.` }, 502);
    }

    const contentType = pageResponse.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) {
        return jsonResponse({ error: 'The URL does not point to an HTML product page.' }, 400);
    }

    const html = await pageResponse.text();
    if (html.length > 2_000_000) {
        return jsonResponse({ error: 'The product page is too large to analyze.' }, 413);
    }

    const title = metaContent(html, 'og:title')
        ?? metaContent(html, 'twitter:title')
        ?? pageTitle(html)
        ?? '';
    const description = metaContent(html, 'og:description')
        ?? metaContent(html, 'description')
        ?? '';
    const imageUrls = extractImageUrls(html, payload.url);

    return jsonResponse({
        title: title.slice(0, 240),
        description: description.slice(0, 1000),
        imageUrl: imageUrls[0] ?? null,
        imageUrls,
        sourceUrl: payload.url
    });
});
