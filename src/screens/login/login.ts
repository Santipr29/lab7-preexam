import { dispatch } from "../../store";
import { navigate } from "../../store/actions";
import { Screens } from "../../types/navigation";
import Firebase from "../../utils/firebase";

const credentials = { email: "", password: "" };

export default class Login extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async handleLoginButton() {
    Firebase.login(credentials);
    dispatch(navigate(Screens.DASHBOARD));

  }

  render() {
    const container = this.ownerDocument.createElement("section")

    const title = this.ownerDocument.createElement("h1");
    title.innerText = "Login";
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

    const loginBtn = this.ownerDocument.createElement("button");
    loginBtn.innerText = "login";
    loginBtn.addEventListener("click", this.handleLoginButton);
    container.appendChild(loginBtn)

    const accountBtn = this.ownerDocument.createElement("button")
    accountBtn.innerText = "Don't have an account yet? Register"
    accountBtn.addEventListener("click", ()=>{
        dispatch(navigate(Screens.REGISTER))
    })
    container.appendChild(accountBtn)

    this.shadowRoot?.appendChild(container);
  }
}

customElements.define("app-login", Login);