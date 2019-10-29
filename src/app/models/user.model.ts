export interface User {
  id: string;
  name: {
    first: string;
    last: string;
    mi: string;
  };
  gender: string;
  dob: any;
  address: string;
  mobile: number;
  email: string;
  image: string;
  role: string;
  date: {
    created: Date;
    modified: Date;
  };
  status: number;
}
