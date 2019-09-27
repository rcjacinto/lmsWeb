export interface Class {
  name: string;
  description: string;
  color: string;
  date: {
    created: Date;
    modified: Date;
  };
  code: string;
  instructor: {
    id: string;
    name: string;
  };
}
