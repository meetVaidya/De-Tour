"use server";

import { createSession, deleteSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .trim(),
});

const registerSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .trim(),
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .trim(),
});

export async function register(prevState: any, formData: FormData) {
    const result = registerSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    const { name, email, password } = result.data;

    // Check if a user with the given email already exists
    const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (existingUser) {
        return { errors: { email: ["User already exists"] } };
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert the new user into the Supabase "users" table
    const { data: user, error: insertError } = await supabase
        .from("users")
        .insert({ name, email, password_hash: passwordHash })
        .select() // To return the inserted row
        .maybeSingle();

    if (insertError || !user) {
        return {
            errors: { general: ["Failed to create user. Please try again."] },
        };
    }

    // Create a session and redirect to the dashboard page
    await createSession(user.id);
    redirect("/main");
}

export async function login(prevState: any, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return { errors: result.error.flatten().fieldErrors };
    }

    const { email, password } = result.data;

    // Fetch the user record by email from Supabase
    const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

    if (!user) {
        return { errors: { email: ["Invalid email or password"] } };
    }

    // Validate password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
        return { errors: { email: ["Invalid email or password"] } };
    }

    // Optionally, if you want to log the login event into a separate table
    // await supabase.from("logins").insert({ user_id: user.id, logged_in_at: new Date() });

    await createSession(user.id);
    redirect("/main");
}

export async function logout() {
    await deleteSession();
    redirect("/login");
}
