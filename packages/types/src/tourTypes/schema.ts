import { type } from "arktype";

export const createTourDTOSchema = type({
  minimumPeople: "number.integer & number > 0",
  price: "number > 0",
  startDate: "Date",
  endDate: "Date",
  agentId: "bigint",
});

export const frontendCreateTourDTOSchema = type({
  minimumPeople: "number.integer & number > 0",
  price: "number > 0",
  startDate: "Date",
  endDate: "Date",
});
