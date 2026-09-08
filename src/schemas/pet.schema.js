import { z } from "zod";

export const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  species: z.enum(["Dog", "Cat", "Bird", "Rabbit", "Other"], {
    errorMap: () => ({ message: "Please choose a species" }),
  }),
  breed: z.string().optional(),
  gender: z.enum(["Male", "Female", "Unknown"]).optional(),
  dateOfBirth: z.string().optional(),
  weight: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v))),
  color: z.string().optional(),
  description: z.string().optional(),
});

export const vaccinationSchema = z.object({
  vaccineName: z.string().min(1, "Vaccine name is required"),
  dateAdministered: z.string().min(1, "Date administered is required"),
  nextDueDate: z.string().optional(),
  notes: z.string().optional(),
});
