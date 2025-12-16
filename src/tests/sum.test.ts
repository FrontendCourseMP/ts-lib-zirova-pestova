// @vitest-environment jsdom

import { describe, test, expect } from "vitest";
import form from "../main";

function setupForm({ name = "", age = "" } = {}) {
  document.body.innerHTML = `
    <form>
      <label for="name">Имя</label>
      <input
        id="name"
        name="name"
        type="text"
        aria-describedby="name-error"
        value="${name}"
        required
      />
      <span id="name-error"></span>

      <label for="age">Возраст</label>
      <input
        id="age"
        name="age"
        type="text"
        aria-describedby="age-error"
        value="${age}"
        required
      />
      <span id="age-error"></span>
    </form>
  `;

  return document.querySelector("form");
}

describe("form()", () => {
  test("если форма не передана — выбрасывается ошибка", () => {
    expect(() => form()).toThrow();
  });

  test("валидная форма — validate не падает", () => {
    const formEl = setupForm({ name: "Anna", age: "20" });
    const validator = form(formEl);

    expect(() => {
      validator.validate();
    }).not.toThrow();
  });

  test("пустые значения — validate не падает", () => {
    const formEl = setupForm();
    const validator = form(formEl);

    expect(() => {
      validator.validate();
    }).not.toThrow();
  });

  test("при невалидных данных поле помечается aria-invalid", () => {
    const formEl = setupForm({ name: "", age: "" });
    const validator = form(formEl);

    validator.validate();
    formEl.dispatchEvent(new Event("submit"));

    const input = formEl.querySelector("#name");
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });
});