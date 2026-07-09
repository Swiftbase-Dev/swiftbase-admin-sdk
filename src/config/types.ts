export interface Configuration {
  id: string;
  project_id: string;
  allow_registration: boolean;
  allow_password_reset: boolean;
  mfa_required: boolean;
  access_expiry: string;
  refresh_expiry: string;
  google_enabled: boolean;
  microsoft_enabled: boolean;
  github_enabled: boolean;
  facebook_enabled: boolean;
  apple_enabled: boolean;
  totp_enabled: boolean;
  totp_required: boolean;
  passkeys_enabled: boolean;
  universal_login_enabled: boolean;
  request_beta_access: boolean;
  beta_access_button_text: string;
  brand_name: string;
  brand_logo_url?: string;
  primary_color: string;
  redirect_uris?: string[];
  created_at: string;
  updated_at: string;
}

export type ConfigurationInput = Partial<Omit<Configuration, "id" | "project_id" | "created_at" | "updated_at">>;
