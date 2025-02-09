import { getSession } from "@/lib/sessions";

export async function ServerLayout() {
    const session = await getSession();
    const isAuthenticated = !!session;
    return { isAuthenticated };
}
