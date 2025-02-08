"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "@/lib/actions";

export function RegisterForm() {
    const [state, registerAction] = useActionState(register, undefined);

    return (
        <form
            action={registerAction}
            className="flex max-w-[300px] flex-col gap-2"
        >
            <div className="flex flex-col gap-2">
                <input id="name" name="name" placeholder="Name" />
            </div>
            {state?.errors && "name" in state.errors && state.errors.name && (
                <p className="text-red-500">{state.errors.name.join(", ")}</p>
            )}

            <div className="flex flex-col gap-2">
                <input id="email" name="email" placeholder="Email" />
            </div>
            {state?.errors && "email" in state.errors && state.errors.email && (
                <p className="text-red-500">{state.errors.email.join(", ")}</p>
            )}

            <div className="flex flex-col gap-2">
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                />
            </div>
            {state?.errors &&
                "password" in state.errors &&
                state.errors.password && (
                    <p className="text-red-500">
                        {state.errors.password.join(", ")}
                    </p>
                )}
            <SubmitButton />
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending} type="submit">
            Register
        </button>
    );
}
