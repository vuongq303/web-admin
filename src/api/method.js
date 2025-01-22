import axios from "axios";
import { baseURL } from "../data/module";

export const REQUEST = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
