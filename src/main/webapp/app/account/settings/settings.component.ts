import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  account!: Account;
  success = false;
  settingsForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    phone: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    address: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(250)]],
  });

  constructor(private accountService: AccountService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue({
          firstName: account.fullName,
          phone: account.phone,
          email: account.email,
          address: account.address
        });

        this.account = account;
      }
    });
  }

  save(): void {
    this.success = false;

    this.account.fullName = this.settingsForm.get('firstName')!.value;
    this.account.phone = this.settingsForm.get('phone')!.value;
    this.account.email = this.settingsForm.get('email')!.value;
    this.account.address = this.settingsForm.get('address')!.value;

    this.accountService.save(this.account).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(this.account);
    });
  }
}
