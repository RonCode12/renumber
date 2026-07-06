"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, TextField } from "@/components/ui";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "שם משתמש או סיסמה שגויים");
        return;
      }
      router.push(next || "/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <h1 className="mb-1 text-lg font-extrabold text-slate-800">כניסה למערכת</h1>
      <p className="mb-6 text-sm text-slate-500">מערכת תוכניות עבודה לקמפיינים</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="שם משתמש"
          required
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="סיסמה"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "מתחבר..." : "כניסה"}
        </Button>
      </form>
    </Card>
  );
}
