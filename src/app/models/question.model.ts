export interface Question {
  number: number;
  type: string;
  text: string;
  options: any[];
  points: number;
  answer?: any;
}
