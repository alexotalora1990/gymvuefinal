

import { createRouter, createWebHashHistory } from 'vue-router';
import { useUsuariosStore } from '../store/usuarios.js'; 

import Login from '../components/Login.vue';
import Productos from '../components/productos.vue';
import Usuarios from '../components/usuarios.vue';
import Clientes from '../components/clientes.vue';
import Ingresos from '../components/ingresos.vue';
import Sedes from '../components/sedes.vue';
import Mantenimientos from '../components/mantenimientos.vue';
import Maquinas from '../components/maquinas.vue';
import Pagos from '../components/pagos.vue';
import Planes from '../components/planes.vue';
import Ventas from '../components/ventas.vue';
import Home from "../components/home.vue"

const auth = (to, from, next) => {
  if (checkAuth()) {
      const userUsuario = useUsuariosStore()
      const rol = userUsuario.user.roll
      if (!to.meta.rol.includes(rol)) {
          return next({ name: 'login' })
      }
      next()
  } else {
      return next({ name: 'login' })
  }
}

const checkAuth = () => {
  const useUsuario = useUsuariosStore()

  const token = useUsuario.token

  if (!token) return false
  return true
};

const routes = [
  { path: '/',name:"login", component: Login },
  { path: '/home', component: Home, children:[

    { path: '/productos', component: Productos, beforeEnter: auth, meta: { rol: ['Administrador','Recepcion' ] } },
    { path: '/usuarios', component: Usuarios, beforeEnter: auth, meta: { rol: ['Administrador' ] } },
    { path: '/clientes', component: Clientes,beforeEnter: auth, meta: { rol: ['Administrador','Recepcion','Instructor' ] } },
    { path: '/ingresos', component: Ingresos, beforeEnter: auth, meta: { rol: ['Administrador','Recepcion' ] } },
    { path: '/sedes', component: Sedes, beforeEnter: auth, meta: { rol: ['Administrador' ] } },
    { path: '/mantenimientos', component: Mantenimientos, beforeEnter: auth, meta: { rol: ['Administrador' ] }},
    { path: '/maquinas', component: Maquinas, beforeEnter: auth, meta: { rol: ['Administrador' ] } },
    { path: '/pagos', component: Pagos,beforeEnter: auth, meta: { rol: ['Administrador' ] } },
    { path: '/planes', component: Planes,beforeEnter: auth, meta: { rol: ['Administrador','Recepcion' ] } },
    { path: '/ventas', component: Ventas, beforeEnter: auth, meta: { rol: ['Administrador','Recepcion' ] } }
  ]},
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const usuariosStore = useUsuariosStore();
  if (to.matched.some(record => record.meta.requiresAuth) && !usuariosStore.token) {
    next({ path: '/' }); 
  } else {
    next();
  }
});

export default router;

// import { createRouter, createWebHashHistory } from 'vue-router';
// import { useUsuariosStore } from '../store/usuarios.js'; 

// import Login from '../components/Login.vue';
// import Productos from '../components/productos.vue';
// import Usuarios from '../components/usuarios.vue';
// import Clientes from '../components/clientes.vue';
// import Ingresos from '../components/ingresos.vue';
// import Sedes from '../components/sedes.vue';
// import Mantenimientos from '../components/mantenimientos.vue';
// import Maquinas from '../components/maquinas.vue';
// import Pagos from '../components/pagos.vue';
// import Planes from '../components/planes.vue';
// import Ventas from '../components/ventas.vue';
// import Home from "../components/home.vue";

// const auth = (to, from, next) => {
//   const usuariosStore = useUsuariosStore();
//   const token = usuariosStore.token;
//   const role = usuariosStore.user.role;

//   if (!token) {
//     return next({ name: 'login' });
//   }

//   if (to.meta && to.meta.roles && !to.meta.roles.includes(role)) {
//     return next({ name: 'login' });
//   }

//   next();
// };

// const routes = [
//   { path: '/', name: 'login', component: Login },
//   { path: '/home', component: Home, meta: { requiresAuth: true }, children: [
//     { path: 'productos', component: Productos, beforeEnter: auth, meta: { roles: ['Administrador', 'Recepcion'] } },
//     { path: 'usuarios', component: Usuarios, beforeEnter: auth, meta: { roles: ['Administrador'] } },
//     { path: 'clientes', component: Clientes, beforeEnter: auth, meta: { roles: ['Administrador', 'Recepcion', 'Instructor'] } },
//     { path: 'ingresos', component: Ingresos, beforeEnter: auth, meta: { roles: ['Administrador', 'Recepcion'] } },
//     { path: 'sedes', component: Sedes, beforeEnter: auth, meta: { roles: ['Administrador'] } },
//     { path: 'mantenimientos', component: Mantenimientos, beforeEnter: auth, meta: { roles: ['Administrador'] } },
//     { path: 'maquinas', component: Maquinas, beforeEnter: auth, meta: { roles: ['Administrador'] } },
//     { path: 'pagos', component: Pagos, beforeEnter: auth, meta: { roles: ['Administrador'] } },
//     { path: 'planes', component: Planes, beforeEnter: auth, meta: { roles: ['Administrador', 'Recepcion'] } },
//     { path: 'ventas', component: Ventas, beforeEnter: auth, meta: { roles: ['Administrador', 'Recepcion'] } }
//   ] }
// ];

// const router = createRouter({
//   history: createWebHashHistory(),
//   routes
// });

// router.beforeEach((to, from, next) => {
//   const usuariosStore = useUsuariosStore();
//   if (to.meta.requiresAuth && !usuariosStore.token) {
//     return next({ name: 'login' });
//   }
//   next();
// });

// export default router;
