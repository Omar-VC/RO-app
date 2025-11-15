// src/firebase/usuarios.js
import { db } from "./config";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Crear nuevo usuario
export async function crearUsuario(usuario) {
  try {
    const usuarioRef = doc(db, "usuarios", usuario.uid);
    await setDoc(usuarioRef, {
      ...usuario,
      estado: "pendiente",  // 🔹 se agrega este campo
      rol: "cliente"         // 🔹 si querés, fijamos también el rol base
    });
    console.log("✅ Usuario guardado correctamente en Firestore con estado pendiente");
  } catch (error) {
    console.error("❌ Error al guardar usuario en Firestore:", error);
    throw error;
  }
}


// Obtener usuarios pendientes
export async function obtenerUsuariosPendientes() {
  try {
    const q = query(collection(db, "usuarios"), where("estado", "==", "pendiente"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error al obtener usuarios pendientes:", error);
    return [];
  }
}

// Aprobar usuario
export async function aprobarUsuario(uid) {
  try {
    const usuarioRef = doc(db, "usuarios", uid);
    await updateDoc(usuarioRef, { estado: "aprobado", rol: "cliente" });
    console.log(`✅ Usuario ${uid} aprobado`);
  } catch (error) {
    console.error("❌ Error al aprobar usuario:", error);
  }
}


// Rechazar usuario
export async function rechazarUsuario(uid) {
  try {
    const usuarioRef = doc(db, "usuarios", uid);
    await deleteDoc(usuarioRef);
    console.log(`🗑️ Usuario ${uid} rechazado y eliminado`);
  } catch (error) {
    console.error("❌ Error al rechazar usuario:", error);
  }
}
