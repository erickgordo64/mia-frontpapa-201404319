import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    users=null;
    estado ="true";
    aumneto =0;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        this.accountService.geElementosCartaByID(this.id)
        .pipe(first())
        .subscribe(users => this.users = users);
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    quitarproducto(iddetalle: string, recompensa: number, bastones: number){
        this.accountService.updateDetalleAccion(iddetalle,this.estado)
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Update successful', { keepAfterRouteChange: true });
                window.location.reload();
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });

        this.aumneto=recompensa+bastones;

        this.accountService.updateBastonesHijo(this.id, this.aumneto)
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Update successful', { keepAfterRouteChange: true });
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
        
    }

    private createUser() {
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateUser() {
        this.accountService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}