import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function Login() {
    return (
        <div>
            <h1>Login</h1>
            <LoginForm />
            <p>
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-500">
                    Register
                </Link>
            </p>
        </div>
    );
}
