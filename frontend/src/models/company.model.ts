export interface Company {
  id:        string;
  name:      string;
  taxCode:   string;
  email:     string;
  phone:     string;
  address:   string;
  city:      string;
  zipCode:   string;
  country:   string;
  website:   string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyData {
  name:    string;
  taxCode: string;
  email:   string;
  phone:   string;
  address: string;
  city:    string;
  zipCode: string;
  country: string;
  website: string;
}
