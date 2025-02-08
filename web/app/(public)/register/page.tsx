import Link from "next/link";
import { RegisterForm } from "@/components/RegisterForm";

export default function Register() {
    return (
        <div>
            <h1>Register</h1>
            <RegisterForm />
            <p>
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500">
                    Login
                </Link>
            </p>
        </div>
    );
}
