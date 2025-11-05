// src/firebase/cuotas.js
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Obtener todas las cuotas
export async function obtenerCuotas() {
  const q = query(collection(db, "cuotas"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Obtener cuotas de un cliente (opcional)
export async function obtenerCuotasPorCliente(clienteId) {
  const q = query(collection(db, "cuotas"), where("clienteId", "==", clienteId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Agregar cuota
export async function agregarCuota(cuotaData) {
  const docRef = await addDoc(collection(db, "cuotas"), cuotaData);
  return docRef.id;
}

// Marcar como pagado / editar
export async function actualizarCuota(id, datos) {
  const ref = doc(db, "cuotas", id);
  await updateDoc(ref, datos);
}

// Eliminar cuota
export async function eliminarCuota(id) {
  const ref = doc(db, "cuotas", id);
  await deleteDoc(ref);
}
