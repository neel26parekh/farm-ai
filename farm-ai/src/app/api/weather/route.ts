import { NextResponse } from 'next/server';

// Placeholder for real OpenWeather APIs
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  // TODO: Implement actual OpenWeather API fetch here once key is provided
  // const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`);

  return NextResponse.json({ 
    status: "mock", 
    message: "Weather API route scaffolded. Awaiting OpenWeather API Key inside .env.local"
  });
}
