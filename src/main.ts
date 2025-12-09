function form(element: HTMLFormElement) {
  const mesError: Map<string, Record<string, string>>  = new Map()

  const inputs = element.querySelectorAll("input");
  for (const input of inputs) {
    if (!input.labels || input.labels.length === 0) {
      throw new Error("У поля нет своего лейбла");
    }
    if (!input.name) {
      throw new Error("У инпута нет имени");
    }
    const atributeAria = input.getAttribute('aria-describedby')
    if (!atributeAria) {
      throw new Error('Отсутствует поле ввода с атрибутом aria-describedby')
    } 
    const output = element.querySelector(`#${atributeAria}`)
    if (!output) {
      throw new Error('Нет output')
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

      mesError.set(fieldName, {})

      const methods = {
        min(message: string) {
          if (field.type === 'number' || field.type === 'range') {
            if (field.min === '') {
              throw new Error('Отсутствует атрибут min')
            }
          } else {
            if (field.minLength === -1) {
              throw new Error('Отсутствует атрибут min')
            }
          }
          const fieldErrors = mesError.get(fieldName)
          if (fieldErrors) {
            fieldErrors['min'] = message
            mesError.set(fieldName, fieldErrors)
          }
          
          return methods
        },
        max(message: string) {
          if (field.type === 'number' || field.type === 'range') {
            if (field.max === '') {
              throw new Error('Отсутствует атрибут max')
            }
          } else {
            if (field.maxLength === -1) {
              throw new Error('Отсутствует атрибут max')
            }
          }
          const fieldErrors = mesError.get(fieldName)
          if (fieldErrors) {
            fieldErrors['max'] = message
            mesError.set(fieldName, fieldErrors)
          }

          return methods
        },
        string() {
          if (field.type !== 'text') {
            throw new Error('В поле должен быть текст')
          }
          field.setAttribute('pattern', '[a-zA-Zа-яА-Я]')
          return methods
        },
        number() {
          if (field.type !== 'number' && field.type !== 'text') {
            throw new Error(`Поле ${fieldName} не соответствует вызванному методу number`)
          }
          if (field.type === 'text') {
            field.setAttribute('pattern', '[0-9]+')
          }
          return methods
        },
      }

      return methods
    },

    validate(){
      element.addEventListener('submit', (event) => {
        event.preventDefault()
        inputs.forEach((input) => {
          const atributeAria = input.getAttribute('aria-describedby')
          if (!atributeAria) {
            throw new Error('Отсутствует поле ввода с атрибутом aria-describedby')
          } 
          const output = element.querySelector(`#${atributeAria}`)
          if (!output) {
            throw new Error('Нет output')
          }
          const validity = input.validity
          if (!validity.valid) {
            if (validity.rangeOverflow) {
              output.textContent = mesError.get(input.name)!['min'] ? mesError.get(input.name)!['min'] : input.validationMessage
              return
            }
            if (validity.rangeUnderflow) {
              output.textContent = mesError.get(input.name)!['max'] ? mesError.get(input.name)!['min'] : input.validationMessage
              return
            }
            if (validity.tooLong) {
              output.textContent = mesError.get(input.name)!['max'] ? mesError.get(input.name)!['min'] : input.validationMessage
              return
            }
            if (validity.tooShort) {
              output.textContent = mesError.get(input.name)!['min'] ? mesError.get(input.name)!['min'] : input.validationMessage
              return
            }
            output.textContent = input.validationMessage
          }
        })
      })
    }
  };
}