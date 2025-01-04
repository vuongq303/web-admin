import axios from "axios";
import { ketNoi } from "../data/module";
import { getRoleNguoiDung } from "../services/utils";

export async function POST(path) {
  const URL = ketNoi.url + path;
  const DEFAULT = { response: "Error", type: false };

  try {
    const { status, data } = await axios.post(URL, {
      headers: getRoleNguoiDung(),
    });

    if (status === 200) {
      return data;
    }

    return DEFAULT;
  } catch (error) {
    console.error(error.message);
    return DEFAULT;
  }
}

export async function GET(path) {
  const URL = ketNoi.url + path;

  try {
    const { status, data } = await axios.get(URL, {
      headers: {
        Authorization: getRoleNguoiDung(),
        "Content-Type": "application/json",
      },
    });

    if (status === 200) {
      return data;
    }

    return [];
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

export async function GET_PARAMS(path, params) {
  const URL = ketNoi.url + path;

  try {
    const { status, data } = await axios.get(URL, { params: params });

    if (status === 200) {
      return data;
    }

    return [];
  } catch (error) {
    console.error(error.message);
    return [];
  }
}
