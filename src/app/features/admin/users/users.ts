import { Component, OnInit } from '@angular/core';
import { TableAction, TableColumn } from '../../../shared/components/data-table/data-table';

interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt?: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
  standalone: false
})
export class Users implements OnInit {
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'active', label: 'Status', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true }
  ];

  actions: TableAction[] = [
    { label: 'Edit', icon: '✏️', action: (row) => this.editUser(row), color: 'primary' },
    { label: 'Delete', icon: '🗑️', action: (row) => this.deleteUser(row), color: 'danger' }
  ];

  users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'ADMIN', active: true, createdAt: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'WAREHOUSE_MANAGER', active: true, createdAt: '2024-01-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'CLIENT', active: false, createdAt: '2024-02-10' }
  ];

  loading = false;
  isModalOpen = false;
  selectedUser?: User;

  ngOnInit(): void {
    // Load users from API
  }

  getActiveUsersCount(): number {
    return this.users.filter(u => u.active).length;
  }

  getAdminUsersCount(): number {
    return this.users.filter(u => u.role === 'ADMIN').length;
  }

  getInactiveUsersCount(): number {
    return this.users.filter(u => !u.active).length;
  }

  editUser(user: User): void {
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.users = this.users.filter(u => u.id !== user.id);
      console.log('User deleted:', user);
    }
  }

  onRowClick(user: User): void {
    console.log('User clicked:', user);
    // Navigate to user detail page
  }

  addUser(): void {
    this.selectedUser = undefined;
    this.isModalOpen = true;
  }

  onModalClose(): void {
    this.isModalOpen = false;
    this.selectedUser = undefined;
  }

  onUserSave(user: User): void {
    if (user.id) {
      // Update existing user
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users[index] = { ...user, createdAt: this.users[index].createdAt };
      }
    } else {
      // Create new user
      const maxId = Math.max(0, ...this.users.map(u => u.id || 0));
      const newUser = {
        ...user,
        id: maxId + 1,
        createdAt: new Date().toISOString().split('T')[0]
      };
      this.users = [...this.users, newUser];
    }
    this.onModalClose();
  }
}
