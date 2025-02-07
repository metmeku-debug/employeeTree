import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase.service';

export interface Employee {
  id: string;  
  name: string;
  description: string;
  parentId: string;  
}

export class AddEmployee {
  static readonly type = '[Employee] Add';
  constructor(public payload: Employee) {}
}

export class UpdateEmployee {
  static readonly type = '[Employee] Update';
  constructor(public id: string, public payload: Employee) {} 
}

export class DeleteEmployee {
  static readonly type = '[Employee] Delete';
  constructor(public id: string) {}  
}

export class FetchEmployees {
  static readonly type = '[Employee] Fetch';
}

export class UpdateEmployeeParent {
  static readonly type = '[Employee] Update Employee Parent';
  constructor(public id: string, public parentId: string) {}
}

export interface EmployeeStateModel {
  employees: Employee[];
}

@State<EmployeeStateModel>({
  name: 'employees',
  defaults: {
    employees: []
  }
})
@Injectable()
export class EmployeeState {
  
  constructor(private firebaseService: FirebaseService) {}

  @Selector()
  static getEmployees(state: EmployeeStateModel) {
    return state.employees;
  }

  @Action(AddEmployee)
  add({ getState, patchState }: StateContext<EmployeeStateModel>, { payload }: AddEmployee) {
    const state = getState();
    patchState({
      employees: [...state.employees, payload]
    });
    this.firebaseService.addEmployee(payload);
  }

  @Action(UpdateEmployee)
  update({ getState, setState }: StateContext<EmployeeStateModel>, { id, payload }: UpdateEmployee) {
    const state = getState();
    const employees = [...state.employees];
    const index = employees.findIndex(emp => emp.id === id);
    employees[index] = payload;
    setState({
      employees
    });
    this.firebaseService.updateEmployee(id, payload);
  }

  @Action(DeleteEmployee)
  delete({ getState, setState }: StateContext<EmployeeStateModel>, { id }: DeleteEmployee) {
    const state = getState();
    setState({
      employees: state.employees.filter(emp => emp.id !== id)
    });
    this.firebaseService.deleteEmployee(id);
  }

  @Action(FetchEmployees)
  async fetchEmployees({ setState }: StateContext<EmployeeStateModel>) {
    try {
      const employees = await this.firebaseService.getEmployees();
      setState({ employees });
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }

  @Action(UpdateEmployeeParent)
  updateEmployeeParent(ctx: StateContext<EmployeeStateModel>, action: UpdateEmployeeParent) {
    const state = ctx.getState();
    const employees = state.employees.map(emp =>
      emp.id === action.id ? { ...emp, parentId: action.parentId } : emp
    );
    ctx.setState({
      ...state,
      employees
    });
    this.firebaseService.updateEmployee(action.id, { ...state.employees.find(emp => emp.id === action.id), parentId: action.parentId });
  }
}
