import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Employee } from '../store/employee.state';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchQuery: string = '';
  newEmployee: Partial<Employee> = {};

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit(): Promise<void> {
    this.employees = await this.firebaseService.getEmployees();
    this.filteredEmployees = this.employees;
  }

  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredEmployees = this.employees; // Reset filter when search query is empty
    } else {
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      const foundEmployees = this.employees.filter(employee =>
        employee.name.toLowerCase().includes(lowerCaseQuery)
      );

      // Move found employees to the top of the list
      this.filteredEmployees = [...foundEmployees, ...this.employees.filter(emp => !foundEmployees.includes(emp))];
    }
  }

  focusSearchInput(): void {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }

  async addEmployee(): Promise<void> {
    if (this.newEmployee.name && this.newEmployee.description) {
      if (this.newEmployee.parentId !== null && this.newEmployee.parentId !== undefined) {
        this.newEmployee.parentId = String(this.newEmployee.parentId); // Convert parentId to string safely
      }
      await this.firebaseService.addEmployee(this.newEmployee as Employee);
      this.employees = await this.firebaseService.getEmployees();
      this.filteredEmployees = this.employees; // Update filtered employees
      this.newEmployee = {};
    }
  }

  async updateEmployee(employee: Employee): Promise<void> {
    if (employee.id) {
      if (employee.parentId !== null && employee.parentId !== undefined) {
        employee.parentId = String(employee.parentId); // Convert parentId to string safely
      }
      await this.firebaseService.updateEmployee(employee.id, employee);
      this.employees = await this.firebaseService.getEmployees();
      this.filteredEmployees = this.employees; // Update filtered employees
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.firebaseService.deleteEmployee(id);
    this.employees = await this.firebaseService.getEmployees();
    this.filteredEmployees = this.employees; // Update filtered employees
  }
}
