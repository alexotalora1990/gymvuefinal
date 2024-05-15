import Login from "../components/Login.vue"
import productos from "../components/productos.vue"
import usuarios from "../components/usuarios.vue"
import clientes from "../components/clientes.vue"
import ingresos from "../components/ingresos.vue"
import sedes from "../components/sedes.vue"
import mantenimientos from "../components/mantenimientos.vue"
import maquinas from "../components/maquinas.vue"
import pagos from "../components/pagos.vue"
import planes from "../components/planes.vue"
import ventas from "../components/ventas.vue"

import { createRouter, createWebHashHistory } from "vue-router"

const routes=[
{path:"/",component:Login},
{path:"/productos",component:productos},
{path:"/usuarios",component:usuarios},
{path:"/clientes",component:clientes},
{path:"/ingresos",component:ingresos},
{path:"/sedes",component:sedes},
{path:"/mantenimientos",component:mantenimientos},
{path:"/maquinas",component:maquinas},
{path:"/pagos",component:pagos},
{path:"/planes",component:planes},
{path:"/ventas",component:ventas}

]
export const router=createRouter({
history:createWebHashHistory(),
routes
})