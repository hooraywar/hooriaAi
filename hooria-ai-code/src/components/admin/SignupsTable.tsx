import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Signup = Tables<"webinar_signups">;

async function fetchSignups(): Promise<Signup[]> {
  const { data, error } = await supabase
    .from("webinar_signups")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function SignupsTable() {
  const { data: signups = [], isLoading } = useQuery({
    queryKey: ["admin-signups"],
    queryFn: fetchSignups,
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {signups.length} webinar signup{signups.length === 1 ? "" : "s"}.
      </p>
      <div className="rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && signups.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No signups yet.
                </TableCell>
              </TableRow>
            )}
            {signups.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.whatsapp}</TableCell>
                <TableCell>{s.university}</TableCell>
                <TableCell>{new Date(s.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
