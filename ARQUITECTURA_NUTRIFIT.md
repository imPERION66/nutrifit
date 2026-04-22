# Arquitectura sostenible de NutriFit

## Objetivo
Dejar el proyecto con una base facil de mantener, evitando HTML gigantes con CSS y JS embebidos, rutas inconsistentes y duplicacion innecesaria.

## Estructura recomendada
```text
NutriFit/
├── login.html
├── css/
│   ├── style.css
│   ├── login.css
│   └── dashboard.css
├── js/
│   ├── auth.js
│   ├── calculadora.js
│   ├── script.js
│   └── dashboard.js
├── pages/
│   ├── login.html
│   ├── dashboard.html
│   ├── calculadora.html
│   ├── nutrientes.html
│   ├── recomendador.html
│   ├── seguimiento.html
│   ├── catalogo.html
│   ├── contacto.html
│   └── registro-alimentos.html
├── img/
└── assets/
```

## Reglas para que sea manejable
1. Cada pagina en `pages/` debe contener solo HTML y referencias a archivos externos.
2. Los estilos repetidos deben vivir en `css/style.css`.
3. La logica compartida debe vivir en `js/auth.js` o modulos pequenos por pagina.
4. Los enlaces internos deben ser relativos al archivo actual.
5. Evita rutas absolutas como `/calculadora.html` si el proyecto se abre en local o dentro de subcarpetas.
6. En la raiz debe quedar `login.html` como punto de entrada principal, y las vistas reales del sistema deben vivir en `pages/`.

## Problemas corregidos en esta iteracion
- Se corrigieron enlaces absolutos rotos en `pages/dashboard.html`.
- Se dejo `login.html` en la raiz como entrada principal.
- Se limpiaron los HTML duplicados de la raiz para que la estructura sea mas mantenible.
- Se movio el CSS repetido de varias paginas internas a `css/style.css`.
- Se movio la validacion de sesion compartida a `js/auth.js`.
- Se separo la logica de IMC en `js/calculadora.js`.

## Siguiente refactor recomendado
1. Extraer el CSS inline de `pages/dashboard.html` a `css/dashboard.css`.
2. Extraer el JS inline de `pages/dashboard.html` a `js/dashboard.js`.
3. Mantener `login.html` de la raiz como vista principal de acceso y dejar `pages/login.html` solo como compatibilidad si fuera necesario.
4. Unificar meta tags y tipografias entre todas las paginas.
5. Crear una vista `404.html` si luego publicas el proyecto en hosting.
