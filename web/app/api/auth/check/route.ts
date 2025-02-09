import { NextResponse } from "next/server";
import { getSession } from "@/lib/sessions";

export async function GET() {
    try {
        const session = await getSession();
        return NextResponse.json({ isAuthenticated: !!session });
    } catch (error) {
        return NextResponse.json({ isAuthenticated: false });
    }
}
