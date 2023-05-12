const firebaseConfig = {
    apiKey: "AIzaSyCI1veTV4rnpeg-Fn220rwVvDh1ihOpf4U",
    authDomain: "dca-perez.firebaseapp.com",
    projectId: "dca-perez",
    storageBucket: "dca-perez.appspot.com",
    messagingSenderId: "116722604539",
    appId: "1:116722604539:web:62b7afc51095347ef1535e",
    measurementId: "G-M6EX5SP9ML"
  };

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs,onSnapshot, doc, serverTimestamp,query,orderBy} from "firebase/firestore";
import { Publication } from "../types/publication";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence,
  
} from "firebase/auth";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


const register = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<boolean> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    setPersistence(auth, browserSessionPersistence)
    .then(() => {
    return signInWithEmailAndPassword(auth, email, password);
  })
    console.log(userCredential.user);
    return true;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return false;
  }
};

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  setPersistence(auth, browserSessionPersistence)
  .then(() => {
    return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
};


const db = getFirestore(app);

const addPublication = async (publication: Omit<Publication, "id">) => {
  try {
    const where = collection(db, "publications");
    await addDoc(where, publication);
    console.log("se añadió con éxito");
  } catch (error) {
    console.error(error);
  }
};

const getPublication = async () => {
  const querySnapshot = await getDocs(collection(db, "publications"));
  const transformed: Array<Publication> = [];

  querySnapshot.forEach((doc) => {
    const data: Omit<Publication, "id"> = doc.data() as any;
    transformed.push({ id: doc.id, ...data });
  });

  return transformed;
};

const getPublicationsListener = (cb: (docs: Publication[]) => void) => {
  const ref = collection(db, "publications");
  onSnapshot(ref, (collection) => {
    const docs: Publication[] = collection.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Publication[];
    cb(docs);
  });
};


export default {
  addPublication,
  getPublication,
  register,
  getPublicationsListener,
  login,
  serverTimestamp,
};