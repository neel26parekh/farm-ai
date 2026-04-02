import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const key = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing lat/lon query params' }, { status: 400 });
  }

  if (!key || key.includes('your_openweather_api_key_here')) {
    return NextResponse.json(
      {
        status: 'fallback',
        message: 'OpenWeather key missing. Returning fallback payload.',
        current: null,
        daily: [],
      },
      { status: 200 }
    );
  }

  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
    const res = await fetch(apiUrl, {
      next: { revalidate: 600 },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      return NextResponse.json(
        {
          status: 'error',
          message: 'OpenWeather request failed',
          providerStatus: res.status,
          providerBody: errorBody,
        },
        { status: 502 }
      );
    }

    const payload = await res.json();
    return NextResponse.json({ status: 'live', source: 'openweather', payload });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'fallback',
        message: 'Weather provider unavailable. Returning fallback payload.',
        error: error instanceof Error ? error.message : 'Unknown weather error',
        current: null,
        daily: [],
      },
      { status: 200 }
    );
  }
}
