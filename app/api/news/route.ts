import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parámetros opcionales que el frontend puede mandar
  const query = searchParams.get('q') || 'technology';
  const category = searchParams.get('category'); // ej: sports, business
  const country = searchParams.get('country') || 'us';

  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key no configurada en el servidor' },
      { status: 500 }
    );
  }

  // GNews tiene dos endpoints: /search (por palabra clave) y /top-headlines (por categoría)
  const baseUrl = category
    ? 'https://gnews.io/api/v4/top-headlines'
    : 'https://gnews.io/api/v4/search';

  const params = new URLSearchParams({
    apikey: apiKey,
    lang: 'en',
    country,
  });

  if (category) {
    params.set('category', category);
  } else {
    params.set('q', query);
  }

  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.errors?.[0] || 'Error al obtener noticias' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'No se pudo conectar con la API de noticias' },
      { status: 500 }
    );
  }
}