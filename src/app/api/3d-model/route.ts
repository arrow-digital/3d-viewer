import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return new NextResponse(JSON.stringify({ error: 'is missing url on query params' }), {
      status: 400,
    });
  }

  try {
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    const fileData = response.data;

    return new NextResponse(fileData, { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify(error), { status: 400 });
  }
}
