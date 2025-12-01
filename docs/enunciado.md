### ENUNCIADO

La cadena de hoteles TRANQUIDESCANSO S.A. desea administrar los datos de sus operaciones a través de una base de datos relacional. Dentro de esta cadena hotelera existen varios hoteles registrados a nivel nacional, de cada uno de estos hoteles se cuenta con su nombre, dirección, teléfonos, año de inauguración, antigüedad y categoría. De acuerdo con la reglamentación hotelera nacional, todos los hoteles deben estar clasificados en una categoría (cinco estrellas, cuatro estrellas…), es posible que el hotel pueda disminuir o aumentar de categoría y es importante dejar registrado el momento en que realiza cambio de categoría. Además, los hoteles ofrecen a sus huéspedes diferentes tipos de habitaciones (individual, doble, suite…) en donde cada una de ellas tiene una identificación particular para lograr diferenciarlas en el momento de asignarlas.

Las habitaciones pueden ser reservadas por los huéspedes directamente, en cuyo caso se requiere registrar número de identificación, nombre, dirección y teléfonos de contacto de quien realiza la reserva y quedará como responsable de la misma. Si la reserva es realizada por una agencia de viajes, es importante que se registren los datos del huésped responsable de la reserva (identificación, nombre, dirección y teléfonos) y los datos de la agencia que realiza la reserva incluyendo la identificación y el nombre. Es importante dejar el registro de la fecha en la cual se realiza la reserva, la fecha en la que iniciaría y finalizaría la reserva, cantidad de personas, cantidad de habitaciones, el tipo de habitación y servicios adicionales que pudiera requerir como por ejemplo parqueadero, cuido de mascotas, entre otros.   La cadena hotelera da la opción de pagar el 20% del valor de la reserva hasta 24 horas antes, si esto no se notifica al hotel la reserva se cancelará y las habitaciones quedarán disponibles para ser asignadas a otros huéspedes. Por otra parte, el 80% restante del valor de la reserva se deberá cancelar en el momento de realizar el registro de llegada al hotel. La hora en la que inicia el registro de entrada de los huéspedes es a las 3:00 pm y se darán máximo 4 horas adicionales para este proceso. Si pasadas las cuatro horas, es decir, si a las 7:00 pm del día en el que inicia la reserva no se ha realizado el registro en el hotel, las habitaciones quedarán disponibles para ser asignadas y el huésped no podrá pedir reintegro del dinero abonado a la reserva.

Una vez se ha realizado el registro de llegada, es importante diligenciar la identificación y nombre de cada una de las personas que se hospedarán en el hotel bajo el número de reserva y la habitación a la cual queda asignado cada uno de estos huéspedes. Así mismo, es importante recordar que debe quedar pagado el saldo existente para la reserva. Una vez se ha completado este proceso, se puede hacer entrega de las llaves de las habitaciones y los huéspedes podrán hacer uso de los servicios con que cuenta el hotel.   Una vez culmina la estadía de los huéspedes en el hotel, para hacer entrega de la habitación primero es importante pagar los servicios adicionales que hayan consumido y así con el paz y salvo podrán abandonar las instalaciones del hotel.  Al hotel le interesa que a partir de los datos registrados en la base de datos sea posible obtener información como la siguiente:
- Reservas realizadas en un período de tiempo.
- Reservas que fueron canceladas sin pagar el valor del 20% de anticipo.
- Reservas que no fueron utilizadas y pagaron el 20% de anticipo.
- Reservas que tuvieron registro de llegada de los huéspedes a tiempo.
- Reservas que registraron huéspedes menores de edad y/o mascotas.
- Reservas que pagaron servicios adicionales.
- Datos de los huéspedes correspondientes a una reserva particular

### ELEMENTOS A EVALUAR EN LA ENTREGA DEL PROYECTO

#### Documento:

1. Definición del problema
    - Descripción de funcionalidades (aplicación)
    - Descripción del entorno de ejecución (S.O., Motor de BD…..)
    - Definición de las reglas de negocio (delimitar problema)
2. Diagrama del modelo Entidad Relación
3. Diagrama del modelo relacional
4. Diccionario de datos
    - Descripción de tablas y columnas
    - Descripción de vistas
    - Descripción de procedimientos y triggers
5. Código fuente
    - Estructura de la base de datos
    - Inserción de datos
    - Conexión de la aplicación a la BD

6. Descripción de la aplicación (Manual de usuario)

#### Software:

1. Bases de datos implementada en MySQL, PostgreSQL o SQL Server
2. Aplicación funcional con conexión a base de datos