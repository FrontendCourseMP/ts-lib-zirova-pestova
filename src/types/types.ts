export interface IFormField {
    field(fieldName: string): {
      isValid(): boolean;
      errors(): string[];
    };
  }
  
  export type FormFunction = (element: HTMLFormElement) => IFormField;