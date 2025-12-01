## **C. Definición de las reglas de negocio (delimitar problema)**

1. Cada hotel pertenece a la cadena y debe estar clasificado en una categoría (una a cinco estrellas).  
2. Un hotel puede cambiar de categoría con el tiempo, y cada cambio debe quedar registrado con su respectiva fecha.  
3. Cada hotel dispone de varios tipos de habitaciones (individual, doble, suite, etc.), y cada habitación tiene un identificador único dentro del hotel.  
4. Una reserva puede ser realizada directamente por un huésped o por una agencia de viajes en nombre de un huésped responsable.  
5. Toda reserva debe registrar:  
    - Fecha de creación, inicio y fin de la estadía.  
    - Cantidad de personas y de habitaciones solicitadas.  
    - Tipo de habitación y servicios adicionales requeridos.  
6. Se permite el pago anticipado del 20% hasta 24 horas antes del inicio de la reserva. Si no se realiza, la reserva se cancela automáticamente.  
7. El 80% restante se cancela al momento del registro de llegada (check-in).  
8. El registro de entrada puede realizarse entre las 3:00 p.m. y las 7:00 p.m. del día de inicio de la reserva. Pasado este tiempo, la habitación se libera y no se reembolsa el dinero del anticipo.  
9. En el registro de llegada, se debe registrar la identificación y nombre de cada huésped alojado bajo la reserva y la habitación asignada a cada uno.  
10. Al finalizar la estadía, los huéspedes deben cancelar los servicios adicionales antes de efectuar el check-out.  
11. El sistema debe permitir la consulta de reservas por período de tiempo y generar reportes de:  
    - Reservas canceladas sin anticipo.  
    - Reservas con anticipo pero no utilizadas.  
    - Reservas con registro a tiempo.  
    - Reservas que incluyan menores de edad o mascotas.  
    - Reservas que hayan utilizado servicios adicionales.

### **Reglas de negocio adicionales**

1. **Reservas presenciales:** Si un huésped llega directamente al hotel, se omite el pago del 20% anticipado; se paga el 100% al hacer check-in inmediato.  
2. **Capacidad máxima por habitación:** No se permite exceder la capacidad del tipo de habitación (ej: Individual: 1, Doble: 2, Suite: 4). Si hay sobrecupo, se asigna otra habitación o se cobra una penalidad del 30% sobre el valor de la reserva por persona extra.  
3. **Menores de edad:** Un menor (\<18 años) debe estar acompañado por un adulto registrado en la misma habitación. Se exige documento de identidad del adulto responsable.  
4. **Cambios de fecha:** Solo permitidos si hay disponibilidad y con 12h de anticipación. Se recalcula tarifa.  
5. **Cancelación Voluntaria:** Cancelaciones con más de 12h de antelación reciben reembolso del 50% del anticipo.  
6. **Noches adicionales post-check-in:** Si un huésped extiende su estadía, se paga el 100% de las noches extras al momento de la extensión (con tarifa vigente ese día).  
7. **Servicios no declarados:** Si se detecta una mascota no registrada o número de huéspedes superior al declarado, se cobra penalidad del 50% del valor de la habitación por noche.  
8. **Reembolsos excepcionales:** Si el hotel cancela la reserva por fuerza mayor (ej: desastre natural), se devuelve el 100% del dinero.  
9. **Check-in:** Un responsable puede registrar varias habitaciones bajo la misma reserva; cada huésped puede estar asignado a distintas habitaciones dentro de la misma reserva, con control individual de asignaciones.  
10. **Agencia:** Cada agencia debe contar con datos como: Nombre, dirección, teléfono, correo electrónico y el costo de comisión.  
11. **Registro de llegada:** El registro de llegada se aplica individualmente sobre los huéspedes de una reserva.