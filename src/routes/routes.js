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
import Home from '../components/home.vue'; // Asegúrate de que esta ruta es correcta

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
  { path: '/', name: 'login', component: Login },
  {
    path: '/home',
    component: Home,
    children: [
      { path: '/productos', name: 'productos', component: Productos, beforeEnter: auth, meta: { rol: ['Administrador', 'Recepcion'] } },
      { path: '/usuarios', name: 'usuarios', component: Usuarios, beforeEnter: auth, meta: { rol: ['Administrador'] } },
      { path: '/clientes', name: 'clientes', component: Clientes, beforeEnter: auth, meta: { rol: ['Administrador', 'Recepcion', 'Instructor'] } },
      { path: '/ingresos', name: 'ingresos', component: Ingresos, beforeEnter: auth, meta: { rol: ['Administrador', 'Recepcion'] } },
      { path: '/sedes', name: 'sedes', component: Sedes, beforeEnter: auth, meta: { rol: ['Administrador'] } },
      { path: '/mantenimientos', name: 'mantenimientos', component: Mantenimientos, beforeEnter: auth, meta: { rol: ['Administrador'] } },
      { path: '/maquinas', name: 'maquinas', component: Maquinas, beforeEnter: auth, meta: { rol: ['Administrador'] } },
      { path: '/pagos', name: 'pagos', component: Pagos, beforeEnter: auth, meta: { rol: ['Administrador'] } },
      { path: '/planes', name: 'planes', component: Planes, beforeEnter: auth, meta: { rol: ['Administrador', 'Recepcion'] } },
      { path: '/ventas', name: 'ventas', component: Ventas, beforeEnter: auth, meta: { rol: ['Administrador', 'Recepcion'] } }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export { routes, router };

export default router;
