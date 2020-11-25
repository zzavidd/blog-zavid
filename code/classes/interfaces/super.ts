export interface GenericDAO {
  id?: number
}

export interface GenericForm {
  confirmFunction?: () => void;
  confirmButtonText: string;
  cancelFunction?: () => void;
  isRequestPending: boolean;
}