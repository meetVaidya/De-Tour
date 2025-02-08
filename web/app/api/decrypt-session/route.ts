import { NextResponse } from "next/server";
import { decrypt } from "@/lib/sessions"; // this still uses next/headers safely on the server

// We'll use a small helper to parse cookies from the request headers.
export function GET(request: Request) {
    const cookieHeader = request.headers.get("cookie") || "";
    // A simple cookie parser. (You can also use a library like 'cookie')
    const match = cookieHeader.match(/session=([^;]+)/);
    const token = match ? match[1] : undefined;

    if (!token) {
        return NextResponse.json(
            { error: "No session token found" },
            { status: 401 },
        );
    }

    return decrypt(token)
        .then((payload) => {
            if (!payload || !payload.userId) {
                return NextResponse.json(
                    { error: "Invalid session" },
                    { status: 401 },
                );
            }
            return NextResponse.json({ userId: payload.userId });
        })
        .catch((error) => {
            return NextResponse.json(
                { error: "Session decryption error" },
                { status: 500 },
            );
        });
}
