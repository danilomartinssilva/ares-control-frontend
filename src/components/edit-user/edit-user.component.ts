import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { UsersResponse } from '../../types/users/users';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionCheckmarkCircle } from '@ng-icons/ionicons';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { ModalEditUserService } from '../../services/modal-edit-user/modal-edit-user.service';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const repeatedPassword = control.get('repeatedPassword')?.value;

  if (!password && !repeatedPassword) {
    return null;
  }

  if ((password && !repeatedPassword) || (!password && repeatedPassword)) {
    return { mismatch: true };
  }

  return password === repeatedPassword ? null : { mismatch: true };
};

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [NgIcon, CommonModule, ReactiveFormsModule],
  viewProviders: [
    provideIcons({
      ionCheckmarkCircle,
    }),
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
})
export class EditUserComponent implements OnInit, OnDestroy {
  isVisible: boolean = false;
  userSelected: UsersResponse | null = null;

  private modalEditUserService = inject(ModalEditUserService);
  private userService = inject(UsersService);
  private toastService = inject(ToastrService);
  modalSubscription!: Subscription;
  editForm!: FormGroup;
  title: string = 'Editar Usuário';
  message: string = 'Preencha os campos para atualizar os dados do usuário.';

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.modalSubscription = this.modalEditUserService
      .getModalState()
      .subscribe((state) => {
        this.isVisible = state.show;
        this.userSelected = state.userSelected;

        if (state.show) {
          this.populateForm();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  private initForm() {
    this.editForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.minLength(10)]],

        password: ['', [Validators.minLength(6)]],
        repeatedPassword: ['', [Validators.minLength(6)]],
      },
      {
        validators: [passwordMatchValidator],
      }
    );
  }

  close() {
    this.editForm.reset();
    this.modalEditUserService.hide();
  }

  confirm() {
    if (this.editForm.valid) {
      this.userService
        .updateUser(this.userSelected!.id, {
          name: this.editForm.value.name,
          email: this.editForm.value.email,
          phone: this.editForm.value.phone,
        })
        .subscribe({
          next: () => {
            this.toastService.success(
              'Usuário atualizado com sucesso!',
              'Sucesso'
            );
          },
        });
      this.close();
    } else {
      this.editForm.markAllAsTouched();
      console.error('Formulário de edição inválido.');
    }
  }

  private populateForm() {
    this.editForm.reset();

    if (this.userSelected) {
      this.editForm.patchValue({
        name: this.userSelected.name,
        email: this.userSelected.email,
        phone: this.userSelected.phone,
      });
    }
  }
}
