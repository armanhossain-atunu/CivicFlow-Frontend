import { type NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function findToken(
  value: unknown,
  key: keyof Tokens,
  depth = 0,
): string | undefined {
  if (!isRecord(value) || depth > 5) {
    return undefined;
  }

  const token = value[key];

  if (typeof token === "string" && token.length > 0) {
    return token;
  }

  for (const child of Object.values(value)) {
    const nestedToken = findToken(child, key, depth + 1);

    if (nestedToken) {
      return nestedToken;
    }
  }

  return undefined;
}

function omitTokens(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(omitTokens);
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== "accessToken" && key !== "refreshToken")
      .map(([key, child]) => [key, omitTokens(child)]),
  );
}

async function handleRequest(request: NextRequest, context: RouteContext) {
  const apiBaseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return NextResponse.json(
      { message: "API_BASE_URL is not configured." },
      { status: 500 },
    );
  }

  let upstreamUrl: URL;

  try {
    const { path } = await context.params;
    const apiUrl = new URL(apiBaseUrl);
    const apiPath = path
      .map((segment) => encodeURIComponent(segment))
      .join("/");

    apiUrl.pathname = `${apiUrl.pathname.replace(/\/+$/, "")}/${apiPath}`;
    apiUrl.search = request.nextUrl.search;
    upstreamUrl = apiUrl;
  } catch {
    return NextResponse.json(
      { message: "API_BASE_URL is invalid." },
      { status: 500 },
    );
  }

  if (upstreamUrl.origin === request.nextUrl.origin) {
    return NextResponse.json(
      {
        message:
          "API_BASE_URL points to this frontend deployment. Set it to the backend API URL.",
      },
      { status: 500 },
    );
  }

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (accept) {
    headers.set("accept", accept);
  }

  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  const sessionCookies = [
    accessToken && `accessToken=${encodeURIComponent(accessToken)}`,
    refreshToken && `refreshToken=${encodeURIComponent(refreshToken)}`,
  ].filter(Boolean);

  if (sessionCookies.length > 0) {
    headers.set("cookie", sessionCookies.join("; "));
  }

  const method = request.method.toUpperCase();
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the API server." },
      { status: 502 },
    );
  }

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("set-cookie");
  responseHeaders.delete("transfer-encoding");
  responseHeaders.set("cache-control", "no-store");

  const responseText = await upstreamResponse.text();
  const { path } = await context.params;
  const isLogin =
    path[0] === "auth" && (path[1] === "login" || path[1] === "google");
  const isLogout = path[0] === "auth" && path[1] === "logout";
  let responseBody: BodyInit | null = responseText;
  let tokens: Tokens | undefined;

  if (upstreamResponse.ok && isLogin) {
    let result: unknown;

    try {
      result = JSON.parse(responseText) as unknown;
    } catch {
      return NextResponse.json(
        { message: "The authentication server returned an invalid response." },
        { status: 502 },
      );
    }

    const accessToken = findToken(result, "accessToken");
    const refreshToken = findToken(result, "refreshToken");

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        {
          message:
            "The authentication server response did not contain both tokens.",
        },
        { status: 502 },
      );
    }

    tokens = { accessToken, refreshToken };
    responseBody = JSON.stringify(omitTokens(result));
    responseHeaders.set("content-type", "application/json");
  }

  if ([204, 205, 304].includes(upstreamResponse.status)) {
    responseBody = null;
  }

  const response = new NextResponse(responseBody, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });

  if (tokens) {
    const secure = process.env.NODE_ENV === "production";

    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  if (isLogout && upstreamResponse.ok) {
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
export const HEAD = handleRequest;
