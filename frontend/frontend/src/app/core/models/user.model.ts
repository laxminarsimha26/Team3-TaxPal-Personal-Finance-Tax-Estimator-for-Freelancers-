export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // week 1: plain text mock only — never do this in real backend
  country: string;
  incomeBracket?: 'low' | 'middle' | 'high';
}