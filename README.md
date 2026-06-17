# Museo Marcelino

## 1. Descripción General

Museo Marcelino es una aplicación web privada destinada a la catalogación, gestión y consulta de una colección particular de antigüedades y documentación histórica.

El objetivo principal de la primera versión es proporcionar una plataforma segura que permita al propietario almacenar, organizar y consultar todos los elementos de su colección desde una única aplicación.

Debido al alto valor económico e histórico de los objetos almacenados, el acceso a la plataforma será inicialmente privado y restringido mediante autenticación de usuarios.

---

## 2. Tecnologías del Proyecto

### Frontend

* Angular 11.16.0

### Backend

* Java 21

### Base de Datos

* Docker (contenedor de base de datos)

---

## 3. Objetivos de la Primera Versión

La primera versión deberá permitir:

* Visualizar la colección mediante una interfaz web intuitiva.
* Organizar los elementos en familias y categorías.
* Consultar objetos mediante filtros avanzados.
* Gestionar usuarios y permisos.
* Crear, editar y eliminar elementos de la colección.
* Mantener un entorno privado y seguro para el propietario.

---

## 4. Gestión de Usuarios

### Administrador

El propietario dispondrá de permisos completos para:

* Crear usuarios.
* Modificar usuarios.
* Eliminar usuarios.
* Crear registros.
* Modificar registros.
* Eliminar registros.
* Gestionar permisos de acceso.

### Usuario Consulta

Podrá:

* Acceder a la colección.
* Consultar fichas.
* Realizar búsquedas y filtrados.

No podrá:

* Modificar información.
* Eliminar registros.
* Crear nuevos elementos.

# 4.1 Acceso Público y Privacidad

Aunque la aplicación estará disponible públicamente mediante una dirección web desde las primeras versiones, la información mostrada dependerá del tipo de usuario que acceda al sistema.

## Visitante Público

Cualquier visitante podrá:

- Navegar por las diferentes categorías de la colección.
- Consultar las fichas de los objetos.
- Visualizar fotografías de las piezas.
- Leer la historia, descripción y características de cada elemento.
- Realizar búsquedas mediante los filtros disponibles.

No podrá visualizar:

- Valoraciones económicas.
- Precios estimados.
- Ubicación exacta de las piezas.
- Información personal del propietario.
- Inventario interno.
- Información de seguridad.
- Datos reservados para la administración.

## Usuarios Autorizados

Los usuarios creados por el propietario podrán acceder a información adicional según los permisos asignados.

## Administrador

El administrador tendrá acceso completo a toda la información almacenada en el sistema, incluyendo:

- Valoraciones económicas.
- Ubicación de las piezas.
- Información privada de gestión.
- Herramientas de administración.
- Gestión de usuarios y permisos.

## Objetivo de Privacidad

La finalidad de esta restricción es permitir la divulgación cultural e histórica de la colección sin comprometer la seguridad de las piezas ni la privacidad del propietario.

El sistema deberá diseñarse de forma que toda la información sensible permanezca oculta para visitantes públicos y usuarios sin autorización específica.

## 5. Estructura General de la Aplicación

### 5.1 Portada

Pantalla inicial con:

* Nombre del museo.
* Imagen principal o presentación.
* Acceso al sistema.
* Información general de la colección.

### 5.2 Página Principal

Desde esta página el usuario podrá acceder a las principales familias de la colección:

* Antigüedades
* Papelería

Cada familia dispondrá de su propia sección y sistema de filtrado.

---

# 6. Familia: Antigüedades

La familia Antigüedades agrupa todos los objetos físicos históricos de la colección.

## 6.1 Cerámica

### Filtros

#### Año / Período

* Año específico (ej. 1910)
* Siglo XIX
* Siglo XX

#### País

* España
* Portugal
* Italia

#### Región

* Manises
* Lorca
* Talavera

#### Tipo de Pieza

* Plato
* Jarrón
* Tintero

---

## 6.2 Pintura

### Filtros

#### Año / Período

* Año específico
* Siglo XIX
* Siglo XX

#### País

* España
* Portugal
* Italia

#### Región

* Manises
* Lorca
* Talavera

#### Técnica

* Óleo
* Granulado
* Acuarela

---

## 6.3 Escultura

### Filtros

#### Año / Período

* Año específico
* Siglo XIX
* Siglo XX

#### País

* España
* Portugal
* Italia

#### Región

* Manises
* Lorca
* Talavera

#### Tipo

* Busto
* Figura
* Belén

---

## 6.4 Cristal

### Filtros

#### Año / Período

* Año específico
* Siglo XIX
* Siglo XX

#### País

* España
* Portugal
* Italia

#### Región

* Manises
* Lorca
* Talavera

#### Tipo

* Plato
* Jarrón
* Tintero

---

## 6.5 Varios

Categoría destinada a elementos que no encajen en las categorías anteriores.

### Filtros

* Año / Período
* País
* Región
* Tipo de elemento

---

# 7. Familia: Papelería

La sección de Papelería permitirá almacenar, catalogar y consultar toda la documentación histórica y material impreso perteneciente a la colección.

Cada categoría dispondrá de filtros específicos para facilitar la búsqueda y localización de elementos.

---

## 7.1 Filatelia

### Subcategorías

* Historia Postal
* Enteros Postales
* Sellos
* Prefilatelia
* Censura Postal

### Filtros

* Año / Período
* País
* Temática
* Descripción
* Fotografía

---

## 7.2 Fotografías

### Subcategorías

* Familiar
* Bodas
* Niños
* Hombres
* Mujeres
* Militar
* Etnografía

### Filtros

* Año / Período
* Lugar
* Temática
* Fotógrafo
* Personas representadas
* Fotografía digitalizada

---

## 7.3 Revistas y Periódicos

### Temáticas

* Motociclismo
* Automoción
* Política
* Historia
* Cultura

### Filtros

* Año / Período
* País
* Temática
* Editorial
* Título
* Estado de conservación

---

## 7.4 Documentos

### Subcategorías

* Folletos
* Partituras
* Escrituras
* Certificados
* Correspondencia
* Otros documentos

### Filtros

* Año / Período
* País
* Temática
* Título
* Autor
* Editor / Imprenta
* Edición
* Autografiado
* Valoración
* Fotografía

---

## 7.5 Libros

### Filtros

#### Año / Período

* Siglo XVII
* Siglo XVIII
* Siglo XIX
* Siglo XX
* Año específico

#### Temática

* Religión
* Militar
* Historia
* Novela
* Otras

#### Información bibliográfica

* Título
* Autor
* Editor / Imprenta
* Edición
* Autografiado
* Valoración
* Fotografía

---

# 8. Funcionalidades Iniciales

* Consulta de elementos catalogados.
* Búsqueda mediante filtros combinados.
* Visualización de imágenes.
* Ficha detallada de cada elemento.
* Sistema de autenticación.
* Gestión de usuarios y permisos.
* Creación de nuevos registros.
* Modificación de registros existentes.
* Eliminación de registros.
* Preparación para futuras ampliaciones.

---

# 9. Evolución Futura

Versiones posteriores podrán incluir:

* Acceso público controlado.
* Estadísticas de la colección.
* Exportación de datos.
* Gestión documental avanzada.
* Valoraciones económicas.
* Historial de movimientos.
* Auditoría de cambios.
* Copias de seguridad automatizadas.
* Aplicación móvil.


