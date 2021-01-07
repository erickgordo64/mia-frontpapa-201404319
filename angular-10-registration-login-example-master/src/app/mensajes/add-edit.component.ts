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
    categoria=null;
    producto=null;
    users=null;
    user = null;
    idhijo: string;
    idchat: string;
    idadmin: string;

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
        
        // password not required in edit mode
        this.form = this.formBuilder.group({
            comentario: ['', Validators.required],
        });
        
        this.accountService.getMensajeById(this.id)
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

        this.idhijo=this.users[0].idhijo;
        this.idchat=this.users[0].idchat;
        this.idadmin=this.users[0].idadmin;
        console.log(this.idhijo);
        console.log(this.idchat);
        console.log(this.idadmin);
        console.log(this.f.comentario.value);
       
    }
}