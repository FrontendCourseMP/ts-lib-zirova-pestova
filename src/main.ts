function form(element: HTMLFormElement) {
  const inputs = element.querySelectorAll("input");
  for (const input of inputs) {
    if (!input.labels || input.labels.length === 0) {
      throw new Error("У поля нет своего лейбла");
    }
    if (!input.name) {
      throw new Error("У инпута нет имени");
    }
    if (inputs.length === 0) {
      throw new Error("В форме нет полей для ввода");
    }
  }
  const ariaElements = element.querySelectorAll("[aria-live]");
  if (ariaElements.length !== inputs.length) {
    throw new Error("Нет поля для вывода ошибки");
  }
  if (inputs.length === 0) {
    throw new Error("В форме нет инпутов");
  }
}
