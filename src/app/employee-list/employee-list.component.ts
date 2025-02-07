import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { EmployeeState, Employee } from '../store/employee.state';
import { FetchEmployees, UpdateEmployee } from '../store/employee.state'; // Import UpdateEmployee action
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { FirebaseService } from '../firebase.service'; // Import Firebase service

interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
  parentId?: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  @Select(EmployeeState.getEmployees) employees$!: Observable<Employee[]>;
  nodes: TreeNode[] = [];

  constructor(private store: Store, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.store.dispatch(new FetchEmployees());
    this.employees$.subscribe(employees => {
      this.nodes = this.buildTree(employees);
    });
  }

  buildTree(employees: Employee[]): TreeNode[] {
    const map = new Map<string, TreeNode>();
    employees.forEach(emp => {
      map.set(emp.id, {
        title: emp.name,
        key: emp.id,
        children: [],
      });
    });

    const tree: TreeNode[] = [];

    employees.forEach(emp => {
      const node = map.get(emp.id);
      if (node) {
        if (emp.parentId === null) {
          tree.push(node);
        } else {
          const parent = map.get(emp.parentId);
          if (parent) {
            parent.children!.push(node);
          }
        }
      }
    });

    return tree;
  }

  onDrop(event: NzFormatEmitEvent): void {
    const node = event.node;
    const dragNode = event.dragNode;
    if (dragNode && node) {
      dragNode.origin['parentId'] = node.key;
      this.updateParentId(dragNode.key, node.key);
    }
  }

  updateParentId(id: string, parentId: string): void {
    const employee = { parentId } as Partial<Employee>;
    this.firebaseService.updateEmployee(id, employee as Employee).then(() => {
      console.log(`Successfully updated parentId of ${id} to ${parentId}`);
      this.store.dispatch(new UpdateEmployee(id, { ...employee } as Employee));
    }).catch(error => {
      console.error(`Error updating parentId of ${id}:`, error);
    });
  }
}
