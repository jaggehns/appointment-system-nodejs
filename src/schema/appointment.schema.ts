import { type TypeOf, object, string, number } from 'zod'

export const createAppointmentSchema = object({
  body: object({
    date: string({ required_error: 'Date is required' }).refine((value) => !isNaN(Date.parse(value)), {
      message: 'Invalid date format'
    }),
    time: string({
      required_error: 'Time is required'
    }).regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM expected)'),
    slots: number({
      required_error: 'Number of slots is required'
    })
      .min(1, 'Must book at least 1 slot')
      .max(5, 'Cannot book more than 5 slots')
  })
})

export type CreateAppointmentInput = TypeOf<typeof createAppointmentSchema>

export interface AppointmentInput {
  date: CreateAppointmentInput['body']['date']
  time: CreateAppointmentInput['body']['time']
  slots: CreateAppointmentInput['body']['slots']
}
