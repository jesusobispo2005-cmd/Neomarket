import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {
        path:'',
        children:[
            {
                path:'',
                component:LoginComponent
            },
            {
                path:'register',
                component:RegisterComponent
            }
        ]
    }
];
