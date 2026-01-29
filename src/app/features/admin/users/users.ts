import { ChangeDetectorRef, Component, OnInit, afterNextRender } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { UserService } from '../../../core/services/user.service';
import { TableAction, TableColumn } from '../../../shared/components/data-table.component';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
  standalone: false
})
export class Users implements OnInit {
  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'active', label: 'Status', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true }
  ];

  actions: TableAction[] = [
    { label: 'Edit', icon: '✏️', handler: (row: any) => this.editUser(row), class: 'text-blue-600' },
    { label: 'Delete', icon: '🗑️', handler: (row: any) => this.deleteUser(row), class: 'text-red-600' }
  ];

  users: User[] = [];

  loading = false;
  isModalOpen = false;
  selectedUser?: User;

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.loadUsers();
    });
  }

  ngOnInit(): void {
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('UsersComponent: Error loading users', error);
        this.toastService.error('Failed to load users');
        this.loading = false;
      }
    });
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
      this.loading = true;
      this.userService.delete(String(user.id!)).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.toastService.success('User deleted successfully');
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.toastService.error('Failed to delete user');
          this.loading = false;
        }
      });
    }
  }

  onRowClick(user: User): void {
    console.log('User clicked:', user);
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
    this.loading = true;
    
    if (user.id) {
      // Update existing user
      this.userService.update(String(user.id), user).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.toastService.success('User updated successfully');
          this.onModalClose();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.toastService.error('Failed to update user');
          this.loading = false;
        }
      });
    } else {
      // Create new user
      this.userService.create(user).subscribe({
        next: (newUser) => {
          this.users = [...this.users, newUser];
          this.toastService.success('User created successfully');
          this.onModalClose();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.toastService.error('Failed to create user');
          this.loading = false;
        }
      });
    }
    this.onModalClose();
  }
}
