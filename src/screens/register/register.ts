import { dispatch } from "../../store";
import { navigate } from "../../store/actions";
import { Screens } from "../../types/navigation";
import Firebase from "../../utils/firebase";

const credentials = { email: "", password: "" };

export default class Register extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async handleRegisterButton() {
    Firebase.register(credentials);
    dispatch(navigate(Screens.DASHBOARD));
  }

  render() {
    const container = this.ownerDocument.createElement("section")

    const title = this.ownerDocument.createElement("h1");
    title.innerText = "Register your user";
    container.appendChild(title)

    const email = this.ownerDocument.createElement("input");
    email.placeholder = "email";
    email.type = "email";
    email.addEventListener(
      "change",
      (e: any) => (credentials.email = e.target.value)
    );
    container.appendChild(email)

    const password = this.ownerDocument.createElement("input");
    password.placeholder = "password";
    password.type = "password";
    password.addEventListener(
      "change",
      (e: any) => (credentials.password = e.target.value)
    );
    container.appendChild(password)

    const RegisterBtn = this.ownerDocument.createElement("button");
    RegisterBtn.innerText = "Register";
    RegisterBtn.addEventListener("click", this.handleRegisterButton);
    container.appendChild(RegisterBtn)

    const accountBtn = this.ownerDocument.createElement("button")
    accountBtn.innerText = "Already have an account? Login"
    accountBtn.addEventListener("click", ()=>{
        dispatch(navigate(Screens.LOGIN))
    })
    container.appendChild(accountBtn)

    this.shadowRoot?.appendChild(container)
  }
}

customElements.define("app-register", Register);