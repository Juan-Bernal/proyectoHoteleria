# Sistema de información para la cadena hotelera TRANQUIDESCANSO S.A. 
Éste proyecto es una implementación hecha para la **Universidad Distrital Francisco José de Caldas University** en la clase de *Bases de datos Avanzada*

### Enunciado del problema

El enunciado de la aplicacion implementada es dada por el siguiente [documento](/docs/enunciado.md).

## Solución propuesta

Nosotros proponemos una solución constuida con El lenguaje de programación [JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript) y el Sistema Gestror de Base de datos [PostgreSQL](https://www.postgresql.org/) 

Para llegar a la solucón seguimos una serie de pasos metodicos:

#### Diseño de la solución
- Creación de las [relgas de negocio](./docs/reglas-negocio.md) para la delimitación del problema.
- Diseño del [diagrama Entidad Relación](./docs/img/diagrama-er.png) como modelo lógico de la base de datos.
- Diseño del [diagrama relacional](/docs/img/diagrama-relacional-normalizado.png) para la base de datos
- Vizualización de la [arquitectura empleada](./docs/img/Arquitectura.png) para la implementación en código.

### Implementación de la solución
- Creación del [script](./database/DDL.sql) de creación de la base de datos. 
- [Implementación del sistema](./src/) en el lenguaje JavaScript

El [documento completo](/docs/DefinicionProblema.pdf) del proyecto da más información académica al respecto. 

<img src="/docs/img/acciones.png">

## Cómo ejecutar el proyecto

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/XhuaShell/db_avanzada_proyecto_hoteleria.git
cd db_avanzada_proyecto_hoteleria
npm install
```

### Configuración de variables de entorno

Debes crear un archivo `.env` en la **raíz del proyecto**, junto al `package.json` y la carpeta `src`.

Configuración por defecto:

```js
# Servidor
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PASSWORD=123456
DB_DATABASE=cadena_hotelera1

# Base de datos
DATABASE_URL=postgres://postgres:admin123@localhost:5432/proyectoHoteleria
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proyectoHoteleria
DB_USER=postgres
DB_PASSWORD=admin123

PGSSL=false
```

### Usar Docker para la base de datos (opcional)

Si deseas ejecutar la base de datos con Docker, usa:

```bash
docker compose up -d
```

El archivo `docker-compose.yml` usa los valores definidos en `.env`, así que asegúrate de configurarlo antes.

### Ejecutar la aplicación

```bash
npm start
```