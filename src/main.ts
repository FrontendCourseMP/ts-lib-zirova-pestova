function form(element: HTMLFormElement) {
  if (!element) {
    throw new Error("Форма не передана");
  }

  const mesError: Map<string, Record<string, string>> = new Map();
  const inputs = element.querySelectorAll("input");

  if (inputs.length === 0) {
    throw new Error("В форме нет инпутов");
  }

  for (const input of inputs) {
    if (!input.labels || input.labels.length === 0) {
      throw new Error("У поля нет своего лейбла");
    }
    if (!input.name) {
      throw new Error("У инпута нет имени");
    }

    const atributeAria = input.getAttribute("aria-describedby");
    if (!atributeAria) {
      throw new Error("Отсутствует поле ввода с атрибутом aria-describedby");
    }

    const output = element.querySelector(`#${atributeAria}`);
    if (!output) {
      throw new Error("Нет output");
    }
  }

  return {
    field(fieldName: string) {
      const field = element.querySelector(
        `[name="${fieldName}"]`
      ) as HTMLInputElement;

      if (!field) {
        throw new Error(`Поле ${fieldName} не найдено`);
      }

      if (!mesError.has(fieldName)) {
        mesError.set(fieldName, {});
      }

      const methods = {
        min(message: string) {
          mesError.get(fieldName)!.min = message;
          return methods;
        },

        max(message: string) {
          mesError.get(fieldName)!.max = message;
          return methods;
        },

        string() {
          if (field.type !== "text") {
            throw new Error("В поле должен быть текст");
          }
          field.setAttribute("pattern", "[a-zA-Zа-яА-Я]+");
          return methods;
        },

        number() {
          field.setAttribute("pattern", "[0-9]+");
          return methods;
        },
      };

      return methods;
    },

    validate() {
      element.addEventListener("submit", (event) => {
        event.preventDefault();

        let hasErrors = false;

        inputs.forEach((input) => {
          const aria = input.getAttribute("aria-describedby")!;
          const output = element.querySelector(`#${aria}`)!;
          output.textContent = "";

          if (!input.checkValidity()) {
            hasErrors = true;
            output.textContent = "Ошибка";
            input.setAttribute("aria-invalid", "true");
          } else {
            input.removeAttribute("aria-invalid");
          }
        });

        if (!hasErrors) {
          element.reset();
        }
      });
    },
  };
}

const inp = document.querySelector("form");

if (inp) {
  const validator = form(inp as HTMLFormElement);
  validator.field("name").string().min("Имя короткое").max("Имя длинное");
  validator.field("age").number().min("Возраст мал").max("Возраст велик");
  validator.validate();
}

export default form;
