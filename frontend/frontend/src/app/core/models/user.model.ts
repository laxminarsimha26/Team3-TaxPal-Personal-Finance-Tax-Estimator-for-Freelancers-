export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  country: string;
  incomeBracket?: 'low' | 'middle' | 'high';
}