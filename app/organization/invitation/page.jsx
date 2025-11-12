"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconCheck, IconAlertCircle, IconLogin, IconMail } from "@tabler/icons-react";
import api from "@/lib/api";

export default function InvitationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState("pending");
    const [message, setMessage] = useState("");
    const [orgName, setOrgName] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setStatus("error");
            setMessage("No invitation token found.");
            return;
        }
        setStatus("loading");
        api.post("/org/members/accept-invitation", { token })
            .then((res) => {
                setStatus("success");
                setOrgName(res.data?.org?.name || "Organization");
                setMessage("Invitation accepted! You can now log in to access the organization.");
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err?.response?.data?.message || "Failed to accept invitation.");
            });
    }, [searchParams]);

        return (
            <div className="flex items-center justify-center min-h-screen w-full bg-background p-4">
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-card rounded-xl shadow-lg p-6 flex flex-col items-center gap-6">
                        <div className="w-full text-center mb-2">
                            <div className="text-2xl font-bold flex items-center justify-center gap-2">
                                <IconMail className="h-7 w-7 text-primary" />
                                Invitation
                            </div>
                        </div>
                        <div className="w-full flex flex-col items-center gap-4">
                            {status === "loading" && (
                                <Badge variant="secondary" className="text-base px-4 py-2">Processing invitation...</Badge>
                            )}
                            {status === "success" && (
                                <>
                                    <IconCheck className="h-12 w-12 text-green-600 mb-2" />
                                    <h2 className="text-xl font-semibold text-center">Welcome to <span className="text-primary">{orgName}</span>!</h2>
                                    <p className="text-muted-foreground text-center">{message}</p>
                                    <Button className="mt-4 w-full flex gap-2" onClick={() => router.push("/auth")}> <IconLogin className="h-5 w-5" /> Log in to access </Button>
                                </>
                            )}
                            {status === "error" && (
                                <>
                                    <IconAlertCircle className="h-12 w-12 text-red-500 mb-2" />
                                    <h2 className="text-xl font-semibold text-center text-destructive">Invitation Error</h2>
                                    <p className="text-muted-foreground text-center">{message}</p>
                                    <Button className="mt-4 w-full flex gap-2" variant="outline" onClick={() => router.push("/")}>Go to Home</Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    );
}
