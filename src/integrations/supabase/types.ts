export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_drafts: {
        Row: {
          created_at: string
          id: string
          parsed: Json
          raw_input: string | null
          source: string
          status: Database["public"]["Enums"]["draft_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          parsed?: Json
          raw_input?: string | null
          source?: string
          status?: Database["public"]["Enums"]["draft_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          parsed?: Json
          raw_input?: string | null
          source?: string
          status?: Database["public"]["Enums"]["draft_status"]
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity: string | null
          entity_id: string | null
          id: string
          payload: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name_ar: string
          name_en: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          id: string
          map_link: string | null
          name: string
          notes: string | null
          phone: string | null
          pickup: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          map_link?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          pickup?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          map_link?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          pickup?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          id: string
          notes: string | null
          occurred_at: string
          title: string
        }
        Insert: {
          amount?: number
          category?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          occurred_at?: string
          title: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          occurred_at?: string
          title?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          battery: number | null
          color: string | null
          condition: string | null
          cost_price: number
          created_at: string
          id: string
          imei: string | null
          notes: string | null
          product_id: string
          serial: string | null
          status: Database["public"]["Enums"]["inventory_status"]
          storage: string | null
          updated_at: string
        }
        Insert: {
          battery?: number | null
          color?: string | null
          condition?: string | null
          cost_price?: number
          created_at?: string
          id?: string
          imei?: string | null
          notes?: string | null
          product_id: string
          serial?: string | null
          status?: Database["public"]["Enums"]["inventory_status"]
          storage?: string | null
          updated_at?: string
        }
        Update: {
          battery?: number | null
          color?: string | null
          condition?: string | null
          cost_price?: number
          created_at?: string
          id?: string
          imei?: string | null
          notes?: string | null
          product_id?: string
          serial?: string | null
          status?: Database["public"]["Enums"]["inventory_status"]
          storage?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          cost_price: number
          created_at: string
          id: string
          inventory_item_id: string | null
          name_snapshot: string
          order_id: string
          product_id: string | null
          qty: number
          unit_price: number
        }
        Insert: {
          cost_price?: number
          created_at?: string
          id?: string
          inventory_item_id?: string | null
          name_snapshot: string
          order_id: string
          product_id?: string | null
          qty?: number
          unit_price?: number
        }
        Update: {
          cost_price?: number
          created_at?: string
          id?: string
          inventory_item_id?: string | null
          name_snapshot?: string
          order_id?: string
          product_id?: string | null
          qty?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          code: string
          created_at: string
          customer_id: string | null
          id: string
          notes: string | null
          packaging_fee: number
          paid_amount: number
          payment_status: Database["public"]["Enums"]["payment_status"]
          service_fee: number
          shipping_fee: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          code?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          packaging_fee?: number
          paid_amount?: number
          payment_status?: Database["public"]["Enums"]["payment_status"]
          service_fee?: number
          shipping_fee?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          packaging_fee?: number
          paid_amount?: number
          payment_status?: Database["public"]["Enums"]["payment_status"]
          service_fee?: number
          shipping_fee?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          available: boolean
          brand: string | null
          category_id: string | null
          color_options: string[]
          condition: string | null
          cost_price: number
          created_at: string
          description: string | null
          id: string
          images: string[]
          name_ar: string
          name_en: string | null
          notes: string | null
          old_price: number | null
          price: number
          quantity: number
          slug: string
          storage_options: string[]
          updated_at: string
        }
        Insert: {
          available?: boolean
          brand?: string | null
          category_id?: string | null
          color_options?: string[]
          condition?: string | null
          cost_price?: number
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          name_ar: string
          name_en?: string | null
          notes?: string | null
          old_price?: number | null
          price?: number
          quantity?: number
          slug: string
          storage_options?: string[]
          updated_at?: string
        }
        Update: {
          available?: boolean
          brand?: string | null
          category_id?: string | null
          color_options?: string[]
          condition?: string | null
          cost_price?: number
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          name_ar?: string
          name_en?: string | null
          notes?: string | null
          old_price?: number | null
          price?: number
          quantity?: number
          slug?: string
          storage_options?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      recount_product_quantity: { Args: { _pid: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin"
      draft_status: "pending" | "approved" | "rejected"
      inventory_status: "in_stock" | "reserved" | "sold" | "unavailable"
      order_status: "new" | "in_progress" | "ready" | "delivered" | "cancelled"
      payment_status: "unpaid" | "partial" | "paid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      draft_status: ["pending", "approved", "rejected"],
      inventory_status: ["in_stock", "reserved", "sold", "unavailable"],
      order_status: ["new", "in_progress", "ready", "delivered", "cancelled"],
      payment_status: ["unpaid", "partial", "paid"],
    },
  },
} as const
