// src/controllers/dashboard/dashboard.controller.js
const repo = require('../../repository/dashboard/dashboard.repository')

module.exports = {
  // Dashboard principal con buscador de hoteles
  index: async (req, res) => {
    try {
      const hoteles = await repo.findAllHotels()
      res.render('layouts/public', {
        view: '../dashboard/index',
        data: { hoteles }
      })
    } catch (error) {
      console.error('Error en dashboard index:', error)
      res.status(500).send('Error al cargar el dashboard')
    }
  },

  // Habitaciones disponibles de un hotel
  hotelRooms: async (req, res) => {
    try {
      const hotelId = req.params.id
      const habitaciones = await repo.findAvailableRooms(hotelId)
      const hoteles = await repo.findAllHotels()
      const hotelActual = hoteles.find(h => h.id_hotel == hotelId)

      res.render('layouts/public', {
        view: '../dashboard/habitaciones',
        data: { habitaciones, hotel: hotelActual }
      })
    } catch (error) {
      console.error('Error al cargar habitaciones:', error)
      res.status(500).send('Error al cargar habitaciones')
    }
  },

  // Detalle de una habitación específica
  roomDetails: async (req, res) => {
    try {
      const roomId = req.params.id
      const habitacion = await repo.findRoomById(roomId)
      const servicios = await repo.findAllServices()

      if (!habitacion) {
        return res.status(404).send('Habitación no encontrada')
      }

      res.render('layouts/public', {
        view: '../dashboard/detalle',
        data: { habitacion, servicios }
      })
    } catch (error) {
      console.error('Error al cargar detalle:', error)
      res.status(500).send('Error al cargar detalle de habitación')
    }
  },

  // Formulario de reserva
    // Formulario de reserva
  bookingForm: async (req, res) => {
    try {
      const roomId = req.params.id
      const habitacion = await repo.findRoomById(roomId)
      const servicios = await repo.findAllServices()

      if (!habitacion) {
        return res.status(404).send('Habitación no encontrada')
      }

      res.render('layouts/public', {
        view: '../dashboard/reserva',
        data: { habitacion, servicios }
      })
    } catch (error) {
      console.error('Error al procesar reserva:', error)
      res.status(500).send('Error al procesar reserva')
    }
  },


  // Confirmar pago y crear reserva
  processPayment: async (req, res) => {
    try {
      const { metodo_pago } = req.body
      const reservaData = req.session.reservaTemp

      if (!reservaData) {
        return res.status(400).send('No hay reserva pendiente')
      }

      // Crear reserva completa
      const reserva = await repo.createCompleteReservation(reservaData)

      // Procesar pago del anticipo
      await repo.processPayment(reserva.id_reserva, reservaData.anticipo, metodo_pago)

      // Obtener detalles completos de la reserva
      const reservaCompleta = await repo.getReservationDetails(reserva.id_reserva)

      // Limpiar sesión
      delete req.session.reservaTemp

      res.render('layouts/public', {
        view: '../dashboard/confirmacion',
        data: { reserva: reservaCompleta }
      })
    } catch (error) {
      console.error('Error al procesar pago:', error)
      res.status(500).send('Error al procesar pago: ' + error.message)
    }
  }
}
