import axios from "axios";
import { apiBaseUrl } from "./config";

export async function getAllTours() {
  const tours = await axios.get(`${apiBaseUrl}/tours`);
  return tours.data;
}

export async function getToursByParams({
  place,
  date,
  persons,
}: {
  place: string;
  date: string;
  persons: string;
}) {
  try {
    const tours = await axios.post(`${apiBaseUrl}/tours/byPlace`, {
      place,
      date,
      persons,
    });
    return tours.data;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error in finding tours by params: ${error.message}`
        : `unknown error in finding tour by params`;
    throw new Error(errorMsg);
  }
}

export async function getToursById(id: string) {
  try {
    const tour = await axios.get(`${apiBaseUrl}/tours/${id}`);
    return tour.data;
  } catch (error) {
    const errorMsg =
      error instanceof Error
        ? `error at getting tour by id: ${error.message}`
        : `unknown error at getting tour by id`;
    throw new Error(errorMsg);
  }
}
