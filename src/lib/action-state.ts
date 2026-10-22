export interface ActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
  ok?: boolean;
  data?: Record<string, string>;
  nonce?: number;
}
