export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      curriculums: {
        Row: {
          created_at: string;
          id: string;
          is_published: boolean;
          sort_order: number;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_published?: boolean;
          sort_order?: number;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_published?: boolean;
          sort_order?: number;
          title?: string;
        };
        Relationships: [];
      };
      curriculum_preview: {
        Row: {
          created_at: string;
          curriculum_id: string;
          description: string;
          id: string;
          module_number: string;
          sort_order: number;
          title: string;
        };
        Insert: {
          created_at?: string;
          curriculum_id: string;
          description: string;
          id?: string;
          module_number: string;
          sort_order?: number;
          title: string;
        };
        Update: {
          created_at?: string;
          curriculum_id?: string;
          description?: string;
          id?: string;
          module_number?: string;
          sort_order?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "curriculum_preview_curriculum_id_fkey";
            columns: ["curriculum_id"];
            isOneToOne: false;
            referencedRelation: "curriculums";
            referencedColumns: ["id"];
          },
        ];
      };
      curriculum_modules: {
        Row: {
          created_at: string;
          curriculum_id: string;
          deliverable: string | null;
          icon: string;
          id: string;
          intro: string | null;
          module_number: string;
          sessions: Json;
          sort_order: number;
          title: string;
          weeks: string;
        };
        Insert: {
          created_at?: string;
          curriculum_id: string;
          deliverable?: string | null;
          icon?: string;
          id?: string;
          intro?: string | null;
          module_number: string;
          sessions?: Json;
          sort_order?: number;
          title: string;
          weeks: string;
        };
        Update: {
          created_at?: string;
          curriculum_id?: string;
          deliverable?: string | null;
          icon?: string;
          id?: string;
          intro?: string | null;
          module_number?: string;
          sessions?: Json;
          sort_order?: number;
          title?: string;
          weeks?: string;
        };
        Relationships: [
          {
            foreignKeyName: "curriculum_modules_curriculum_id_fkey";
            columns: ["curriculum_id"];
            isOneToOne: false;
            referencedRelation: "curriculums";
            referencedColumns: ["id"];
          },
        ];
      };
      instructor: {
        Row: {
          bio: string;
          created_at: string;
          highlights: Json;
          id: string;
          image_url: string;
          linkedin_url: string;
          name: string;
          role: string;
          stack: Json;
          stats: Json;
        };
        Insert: {
          bio: string;
          created_at?: string;
          highlights?: Json;
          id?: string;
          image_url?: string;
          linkedin_url?: string;
          name: string;
          role: string;
          stack?: Json;
          stats?: Json;
        };
        Update: {
          bio?: string;
          created_at?: string;
          highlights?: Json;
          id?: string;
          image_url?: string;
          linkedin_url?: string;
          name?: string;
          role?: string;
          stack?: Json;
          stats?: Json;
        };
        Relationships: [];
      };
      portfolio_items: {
        Row: {
          created_at: string;
          icon: string;
          id: string;
          sort_order: number;
          tag: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          icon?: string;
          id?: string;
          sort_order?: number;
          tag?: string;
          title: string;
        };
        Update: {
          created_at?: string;
          icon?: string;
          id?: string;
          sort_order?: number;
          tag?: string;
          title?: string;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          answer: string;
          created_at: string;
          id: string;
          question: string;
          sort_order: number;
        };
        Insert: {
          answer: string;
          created_at?: string;
          id?: string;
          question: string;
          sort_order?: number;
        };
        Update: {
          answer?: string;
          created_at?: string;
          id?: string;
          question?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      services: {
        Row: {
          created_at: string;
          description: string;
          discount_percentage: number;
          icon: string;
          id: string;
          is_active: boolean;
          is_coming_soon: boolean;
          is_highlighted: boolean;
          price_label: string;
          sort_order: number;
          title: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          discount_percentage?: number;
          icon?: string;
          id?: string;
          is_active?: boolean;
          is_coming_soon?: boolean;
          is_highlighted?: boolean;
          price_label?: string;
          sort_order?: number;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          discount_percentage?: number;
          icon?: string;
          id?: string;
          is_active?: boolean;
          is_coming_soon?: boolean;
          is_highlighted?: boolean;
          price_label?: string;
          sort_order?: number;
          title?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      webinar_signups: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string;
          university: string;
          whatsapp: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          name: string;
          university: string;
          whatsapp: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          university?: string;
          whatsapp?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
