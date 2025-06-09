
export interface Instruction {
  id: string;
  name: string;
  image_url?: string | null;
  type?: string | null;
  created_on?: string | null;
  updated_on?: string | null;
  units?: string | null;
}
