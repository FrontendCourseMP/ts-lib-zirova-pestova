function form(element: HTMLFormElement) {
  const mesError: Map<string, Record<string, string>> = new Map();

  const inputs = element.querySelectorAll("input");
  
  for (const input of inputs) {
    if (!input.labels || input.labels.length === 0) {
      throw new Error("У поля нет своего лейбла");
    }
    if (!input.name) {
      throw new Error("У инпута нет имени");
    }
    const atributeAria = input.getAttribute('aria-describedby');
    if (!atributeAria) {
      throw new Error('Отсутствует поле ввода с атрибутом aria-describedby');
    }
    const output = element.querySelector(`#${atributeAria}`);
    if (!output) {
      throw new Error('Нет output');
    }
  }

  if (inputs.length === 0) {
    throw new Error("В форме нет инпутов");
  }

  return {
    field(fieldName: string) {
      const field = element.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
      if (!field) {
        throw new Error(`Поле ${fieldName} не найдено`);
      }

      if (!mesError.has(fieldName)) {
        mesError.set(fieldName, {});
      }

      const methods = {
        min(message: string) {
          if (field.type === 'number' || field.type === 'range') {
            if (field.min === '') {
              throw new Error('Отсутствует атрибут min');
            }
          } else {
            if (!field.hasAttribute('minlength')) {
              throw new Error('Отсутствует атрибут minlength');
            }
          }
          const fieldErrors = mesError.get(fieldName);
          if (fieldErrors) {
            fieldErrors['min'] = message;
            mesError.set(fieldName, fieldErrors);
          }
          return methods;
        },
        
        max(message: string) {
          if (field.type === 'number' || field.type === 'range') {
            if (field.max === '') {
              throw new Error('Отсутствует атрибут max');
            }
          } else {
            if (!field.hasAttribute('maxlength')) {
              throw new Error('Отсутствует атрибут maxlength');
            }
          }
          const fieldErrors = mesError.get(fieldName);
          if (fieldErrors) {
            fieldErrors['max'] = message;
            mesError.set(fieldName, fieldErrors);
          }
          return methods;
        },
        
        string() {
          if (field.type !== 'text') {
            throw new Error('В поле должен быть текст');
          }
          field.setAttribute('pattern', '[a-zA-Zа-яА-Я]+');
          return methods;
        },
        
        number() {
          if (field.type !== 'number' && field.type !== 'text') {
            throw new Error(`Поле ${fieldName} не соответствует вызванному методу number`);
          }
          if (field.type === 'text') {
            field.setAttribute('pattern', '[0-9]+');
          }
          return methods;
        },
      };

      return methods;
    },

    validate() {
      element.addEventListener('submit', (event) => {
        event.preventDefault();
        
        let hasErrors = false;
        
        inputs.forEach((input) => {
          const atributeAria = input.getAttribute('aria-describedby');
          if (!atributeAria) {
            throw new Error('Отсутствует поле ввода с атрибутом aria-describedby');
          }
          
          const output = element.querySelector(`#${atributeAria}`) as HTMLElement;
          if (!output) {
            throw new Error('Нет output');
          }

          // Очищаем предыдущие ошибки
          output.textContent = '';

          const validity = input.validity;
          const errors = mesError.get(input.name);

          if (!validity.valid) {
            hasErrors = true;
            
            if (validity.rangeOverflow || validity.tooLong) {
              output.textContent = errors?.['max'] || input.validationMessage;
            } else if (validity.rangeUnderflow || validity.tooShort) {
              output.textContent = errors?.['min'] || input.validationMessage;
            } else if (validity.patternMismatch) {
              output.textContent = 'Неверный формат данных';
            } else if (validity.valueMissing) {
              output.textContent = 'Поле обязательно для заполнения';
            } else {
              output.textContent = input.validationMessage;
            }
          }
        });

        if (!hasErrors) {
          console.log('Форма валидна!');
          element.reset();
        }
      });
    }
  };
}
const inp = document.querySelector('form') as HTMLFormElement;
const validator = form(inp);
validator.field('name').string().min('Имя слишком короткое').max('Имя слишком длинное');
validator.field('age').number().min('Возраст должен быть больше 0').max('Возраст не может быть больше 100');
validator.validate();