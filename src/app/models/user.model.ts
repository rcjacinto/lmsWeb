export interface User {
  _id?: string;
  id: string;
  name: {
    first: string;
    last: string;
    mi: string;
  };
  gender: string;
  dob: string;
  address: string;
  mobile: number;
  email: string;
  image: string;
  role: string;
  date: {
    created: string;
    modified: string;
  };
}
