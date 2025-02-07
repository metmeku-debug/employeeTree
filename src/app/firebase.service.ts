import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Employee } from './store/employee.state';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore, Firestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore) {}

  async getEmployees(): Promise<Employee[]> {
    const querySnapshot = await getDocs(collection(this.firestore, 'employees'));
    return querySnapshot.docs.map(document => ({
      ...document.data() as Omit<Employee, 'id'>,
      id: document.id,
    }));
  }

  async addEmployee(employee: { name: string; description: string; parentId: string }) { 
    await addDoc(collection(this.firestore, 'employees'), employee);
  }

  async updateEmployee(id: string, employee: Partial<Employee>) { 
    const employeeDoc = doc(this.firestore, 'employees', id);
    await updateDoc(employeeDoc, employee);
  }

  async deleteEmployee(id: string) {
    const employeeDoc = doc(this.firestore, 'employees', id);
    await deleteDoc(employeeDoc);
  }
}
