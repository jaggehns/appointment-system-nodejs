import { object, string, number, array, type TypeOf } from 'zod'

export const updateConfigurationSchema = object({
  body: object({
    slotDuration: number({
      required_error: 'Slot duration is required'
    })
      .min(5, 'Slot duration must be at least 5 minutes')
      .max(120, 'Slot duration must not exceed 120 minutes'),
    maxSlots: number({
      required_error: 'Max slots per appointment is required'
    })
      .min(1, 'Max slots must be at least 1')
      .max(5, 'Max slots must not exceed 5'),
    startHour: string({
      required_error: 'Start hour is required'
    }).regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM expected)'),
    endHour: string({
      required_error: 'End hour is required'
    }).regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM expected)'),
    daysOff: array(
      object({
        date: string({
          required_error: 'Date is required'
        }).refine((value) => !isNaN(Date.parse(value)), {
          message: 'Invalid date format'
        }),
        description: string({
          required_error: 'Description is required'
        })
      })
    ).optional(),
    unavailableHours: array(
      object({
        dayOfWeek: string({
          required_error: 'Day of week is required'
        }).regex(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/, 'Invalid day of week'),
        startTime: string({
          required_error: 'Start time is required'
        }).regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM expected)'),
        endTime: string({
          required_error: 'End time is required'
        }).regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM expected)')
      })
    ).optional()
  })
})

export type UpdateConfigurationInput = TypeOf<typeof updateConfigurationSchema>
