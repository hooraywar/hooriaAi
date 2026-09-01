import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LogOut, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { FaqsManager } from "@/components/admin/FaqsManager";
import { SignupsTable } from "@/components/admin/SignupsTable";
import { CurriculumPreviewManager } from "@/components/admin/CurriculumPreviewManager";
import { CurriculumModulesManager } from "@/components/admin/CurriculumModulesManager";
import { InstructorManager } from "@/components/admin/InstructorManager";
import { PortfolioManager } from "@/components/admin/PortfolioManager";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Hooria AI" }],
  }),
  component: AdminPage,
});

type RoleStatus = "checking" | "admin" | "not-admin";

function useAdminSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [roleStatus, setRoleStatus] = useState<RoleStatus>("checking");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === undefined) return;
    if (session === null) {
      setRoleStatus("checking");
      return;
    }
    let cancelled = false;
    setRoleStatus("checking");
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setRoleStatus(data ? "admin" : "not-admin");
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  return { session, roleStatus };
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) toast.error(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border/60 bg-surface/60 p-8 space-y-4"
      >
        <div>
          <h1 className="text-xl font-bold">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hooria AI control panel
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-sm text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
        <h1 className="mt-4 text-xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account doesn't have admin access.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}

const ADMIN_TAB_STORAGE_KEY = "hooria-admin-active-tab";
const ADMIN_TAB_VALUES = [
  "services",
  "curriculum-preview",
  "curriculum-modules",
  "instructor",
  "portfolio",
  "faqs",
  "signups",
] as const;
type AdminTab = (typeof ADMIN_TAB_VALUES)[number];

function getStoredAdminTab(): AdminTab {
  if (typeof window === "undefined") return "services";
  const stored = window.localStorage.getItem(ADMIN_TAB_STORAGE_KEY);
  return (ADMIN_TAB_VALUES as readonly string[]).includes(stored ?? "")
    ? (stored as AdminTab)
    : "services";
}

function AdminDashboard({ email }: { email: string }) {
  const [activeTab, setActiveTab] = useState<AdminTab>(getStoredAdminTab);

  function handleTabChange(value: string) {
    setActiveTab(value as AdminTab);
    window.localStorage.setItem(ADMIN_TAB_STORAGE_KEY, value);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-surface/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
          <div>
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="h-auto flex-wrap justify-start">
            <TabsTrigger value="services">Programs</TabsTrigger>
            <TabsTrigger value="curriculum-preview">
              Curriculum Preview
            </TabsTrigger>
            <TabsTrigger value="curriculum-modules">
              Curriculum Page
            </TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="signups">Webinar Signups</TabsTrigger>
          </TabsList>
          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>
          <TabsContent value="curriculum-preview">
            <CurriculumPreviewManager />
          </TabsContent>
          <TabsContent value="curriculum-modules">
            <CurriculumModulesManager />
          </TabsContent>
          <TabsContent value="instructor">
            <InstructorManager />
          </TabsContent>
          <TabsContent value="portfolio">
            <PortfolioManager />
          </TabsContent>
          <TabsContent value="faqs">
            <FaqsManager />
          </TabsContent>
          <TabsContent value="signups">
            <SignupsTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function AdminPage() {
  const { session, roleStatus } = useAdminSession();

  return (
    <>
      <Toaster theme="dark" position="top-center" />
      {session === undefined ? null : session === null ? (
        <LoginForm />
      ) : roleStatus === "checking" ? null : roleStatus === "admin" ? (
        <AdminDashboard email={session.user.email ?? ""} />
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
