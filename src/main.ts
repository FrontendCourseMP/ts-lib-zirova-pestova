function form(element: HTMLFormElement) {
  const inputs = element.querySelectorAll("input");
  for (const input of inputs) {
    if (!input.labels || input.labels.length === 0) {
      throw new Error("У поля нет своего лейбла");
    }
    if (!input.name) {
      throw new Error("У инпута нет имени");
    }
  }
  
  if (inputs.length === 0) {
    throw new Error("В форме нет инпутов");
  }
  
  const ariaElements = element.querySelectorAll("[aria-live]");
  if (ariaElements.length !== inputs.length) {
    throw new Error("Нет поля для вывода ошибки");
  }

  return {
    field(fieldName: string) {
      const field = element.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
      if (!field) {
        throw new Error(`Поле ${fieldName} не найдено`);
      }

      const validationRules: Array<(value: string | number | string[]) => string | null> = [];
      const errors: string[] = [];

      const runValidation = (value: string | number | string[]) => {
        errors.length = 0;
        for (const rule of validationRules) {
          const error = rule(value);
          if (error) {
            errors.push(error);
          }
        }
        return errors.length === 0;
      };

      return {
        string() {
          const chainable = {
            min(length: number, message?: string) {
              validationRules.push((value: string | number | string[]) => 
                typeof value === 'string' && value.length < length ? message || `Минимальная длина ${length} символов` : null);
              return chainable;
            },
            max(length: number, message?: string) {
              validationRules.push((value: string | number | string[]) =>
                typeof value === 'string' && value.length > length ? message || `Максимальная длина ${length} символов` : null);
              return chainable;
            },
            required(message?: string) {
              validationRules.push((value: string | number | string[]) =>
                typeof value === 'string' && value.trim() === '' ? message || 'Поле обязательно для заполнения' : null);
              return chainable;
            },
            isValid: () => runValidation(field.value),
            errors: () => errors,
          };
          return chainable;
        },

        number() {
          const chainable = {
            min(minValue: number, message?: string) {
              validationRules.push((value: string | number | string[]) => {
                const num = typeof value === 'number' ? value : NaN;
                return isNaN(num) || num < minValue ? message || `Значение должно быть не менее ${minValue}` : null;
              });
              return chainable;
            },
            max(maxValue: number, message?: string) {
              validationRules.push((value: string | number | string[]) => {
                const num = typeof value === 'number' ? value : NaN;
                return isNaN(num) || num > maxValue ? message || `Значение должно быть не более ${maxValue}` : null;
              });
              return chainable;
            },
            required(message?: string) {
              validationRules.push((value: string | number | string[]) => {
                const num = typeof value === 'number' ? value : NaN;
                return isNaN(num) ? message || 'Поле обязательно для заполнения' : null;
              });
              return chainable;
            },
            integer(message?: string) {
              validationRules.push((value: string | number | string[]) => {
                const num = typeof value === 'number' ? value : NaN;
                return isNaN(num) || !Number.isInteger(num) ? message || 'Значение должно быть целым числом' : null;
              });
              return chainable;
            },
            isValid: () => runValidation(field.value),
            errors: () => errors,
          };
          return chainable;
        }
      }
    },

    validate(): boolean {
      return true;
    }
  };
}