export interface GoogleLoginDto {
  type: 'auth-code' | 'credential';
  value: string;
}
