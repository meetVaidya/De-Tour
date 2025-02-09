import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Make sure to use a consistent secret key
const SECRET_KEY = process.env.SESSION_SECRET || "your-secure-secret-key";
const secret = new TextEncoder().encode(SECRET_KEY);

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) return null;
    return await decrypt(session.value);
}

export async function encrypt(payload: any) {
    try {
        return await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);
    } catch (error) {
        console.error('Encryption error:', error);
        throw error;
    }
}

export async function decrypt(token: string | undefined) {
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        console.error('Session decryption error:', error);
        return null;
    }
}

export async function createSession(userId: string) {
    try {
        const session = await encrypt({ userId });
        const cookieStore = await cookies();
        cookieStore.set("session", session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });
    } catch (error) {
        console.error('Create session error:', error);
        throw error;
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}
