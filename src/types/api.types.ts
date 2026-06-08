export interface APIResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}