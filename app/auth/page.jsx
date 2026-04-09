"use client";

import { useEffect } from "react";

export default function AuthPage() {
  useEffect(() => {
    const origin = window.location.origin;
    //TODO: Change this to the actual login URL of your authentication service
    const target = `https://iamabhi.me/login?redirect=${encodeURIComponent(origin)}`;
    window.location.replace(target);
  }, []);

  return null;
}
