function form(element: HTMLFormElement) {
  // Ваши проверки структуры
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

  // Добавляем возвращаемый объект с методами
  return {
    field(fieldName: string) {
      const field = element.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
      if (!field) {
        throw new Error(`Поле ${fieldName} не найдено`);
      }
      return {
        string() {
          return {
            min(length: number, message?: string) {
              // Пока просто сохраняем правило
              return this; //чейним методы
            },
            max(length: number, message?: string) {
              return this;
            },
            required(message?: string) {
              return this;
            }
          };
        },
        number() {
          return {
            min(value: number, message?: string) {
              return this;
            },
            max(value: number, message?: string) {
              return this;
            },
            required(message?: string) {
              return this;
            }
          };
        },
        array() {
          return {
            min(length: number, message?: string) {
              return this;
            },
            required(message?: string) {
              return this;
            }
          };
        }
      };
    },

    validate(): boolean {
      // Здесь будет логика валидации
      return true;
    }
  };
}