import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const cartasModule = () => import('./cartas/cartas.module').then(x=>x.CartasModule);
const hijoModule=() =>import('./hijo/hijo.module').then(x=>x.HijoModule);
const mensajesModule =() => import ('./mensajes/mensajes.module').then(x=>x.MensajesModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'cartas', loadChildren: cartasModule, canActivate: [AuthGuard] },
    { path: 'hijos', loadChildren: hijoModule, canActivate: [AuthGuard] },
    { path: 'mensajes', loadChildren: mensajesModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }