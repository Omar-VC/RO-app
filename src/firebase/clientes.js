import { collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";



// Obtener todos los clientes
export async function obtenerClientes() {
  const querySnapshot = await getDocs(collection(db, "clientes"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Obtener cliente por ID
export async function obtenerClientePorId(id) {
  const docRef = doc(db, "clientes", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  return null;
}

// Agregar cliente (retorna ID generado)
export async function agregarCliente(clienteData) {
  const docRef = await addDoc(collection(db, "clientes"), clienteData);
  return docRef.id;
}

// Editar cliente
export async function editarCliente(id, clienteData) {
  const docRef = doc(db, "clientes", id);
  await updateDoc(docRef, clienteData);
}

// Eliminar cliente
export async function eliminarCliente(id) {
  const docRef = doc(db, "clientes", id);
  await deleteDoc(docRef);
}
