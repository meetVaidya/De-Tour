import { getSession } from "@/lib/sessions";
import { supabase } from "@/lib/supabaseClient";

export async function getCurrentUser() {
    // Get the session which contains userId
    const session = await getSession();

    if (!session?.userId) {
        return null;
    }

    // Query Supabase for user details
    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.userId)
        .maybeSingle();

    if (error || !user) {
        console.error("Error fetching user:", error);
        return null;
    }

    return user;
}
