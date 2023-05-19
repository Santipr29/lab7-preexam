import { Product } from "../../types/product";
import Firebase from "../../utils/firebase";
import { appState, addObserver, dispatch } from "../../store";
import { navigate } from "../../store/actions";
import { setUserCredentials } from "../../store/actions";
import { Screens } from "../../types/navigation";

const formData: Omit<Product, "id"> = {
  name: "",
  price: 0,
  createdAt: "",
};

export default class Dashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    addObserver(this);
  }

  connectedCallback() {
    this.render();
  }

  validateLogin(){
    console.log(appState.user);
    if(appState.user !== ''){
      Firebase.addProduct(formData);
    } else {
      dispatch(navigate(Screens.REGISTER));
    }
    
  }

  logOut(){
    if(appState.user !== null || ''){
      dispatch(setUserCredentials(''))
    }
    
  }
  
  changeName(e: any) {
    formData.name = e?.target?.value;
  }

  changePrice(e: any) {
    formData.price = Number(e?.target?.value);
  }

  async render() {

    const logOut = this.ownerDocument.createElement("button");
    logOut.innerText = "Log Out";
    logOut.addEventListener("click", this.logOut)
    this.shadowRoot?.appendChild(logOut);

    const title = this.ownerDocument.createElement("h1");
    title.innerText = "Añade producto";
    this.shadowRoot?.appendChild(title);

    const pName = this.ownerDocument.createElement("input");
    pName.placeholder = "nombre del producto";
    pName.addEventListener("change", this.changeName);
    this.shadowRoot?.appendChild(pName);

    const pPrice = this.ownerDocument.createElement("input");
    pPrice.placeholder = "price";
    pPrice.addEventListener("change", this.changePrice);
    this.shadowRoot?.appendChild(pPrice);

    const save = this.ownerDocument.createElement("button");
    save.innerText = "New Product";
    save.addEventListener("click", this.validateLogin)
    this.shadowRoot?.appendChild(save);

    const productsList = this.ownerDocument.createElement("section");
    this.shadowRoot?.appendChild(productsList);
    
    Firebase.getProductsListener((products) => {
      const oldOnesIds: String[] = [];
      productsList.childNodes.forEach((i) => {
        if (i instanceof HTMLElement) oldOnesIds.push(i.dataset.pid || "");
      });
      const newOnes = products.filter((prod) => !oldOnesIds.includes(prod.id));
      console.log(newOnes);

      newOnes.forEach((p: Product) => {
        const container = this.ownerDocument.createElement("section");
        container.setAttribute("data-pid", p.id);
        const name = this.ownerDocument.createElement("h3");
        name.innerText = p.name;
        container.appendChild(name);

        const price = this.ownerDocument.createElement("h3");
        price.innerText = String(p.price);
        container.appendChild(price);

        productsList.prepend(container);
      });

    });
  }
}

customElements.define("app-dashboard", Dashboard);