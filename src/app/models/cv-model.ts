export interface CV {
  id?: string;
  templateType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  profilePicture?: string;
  summary: string;
  experiences: Experience[];
  educations: Education[];
  skills: string[];
  languages: Language[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Experience {
  id?: string;
  position: string;
  company: string;
  location: string;
  startDate: Date | string;
  endDate?: Date | string;
  description: string;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  location: string;
  startDate: Date | string;
  endDate?: Date | string;
  description: string;
}

export interface Language {
  id?: string;
  name: string;
  level: string;
}

export interface CVTemplate {
  id: string;
  name: string;
  preview: string;
  description: string;
  color?: string;
}
