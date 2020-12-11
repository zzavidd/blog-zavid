import { PostType } from "./post.interface";

// TODO: Rename to EntityDAO
export interface GenericDAO {
  id?: number
}

export interface ResultEntityDAO {
  index?: number
  title: string
  type: PostType | 'Diary Entry'
  content: string
  date: string | Date
  slug: string
  image?: string
}

export interface GenericForm {
  confirmFunction?: () => void;
  confirmButtonText: string;
  cancelFunction?: () => void;
  isRequestPending: boolean;
}