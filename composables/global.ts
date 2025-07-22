import numeral from "numeral";
import swal from "sweetalert2";
import { AxiosError } from "axios";
import type { SweetAlertOptions } from "sweetalert2";
import { DefaultResponseModel } from "@/models/";

export const UseGetFormatDatePicker = (date: any) => {
  if (date) {
    const datenow = new Date(date);
    const day = datenow.getDate();
    const month = datenow.getMonth() + 1;
    const year = datenow.getFullYear();
    return `${numeral(day).format("00")}/${numeral(month).format(
      "00"
    )}/${year}`;
  } else {
    return date;
  }
};

export const goPath = (path: string | null) => {
  if (path !== null) {
    window.location.href = path;
  }
};

export const DefaultSwalError = (err: any) => {
  const errors = err as AxiosError;
  const response_data = errors?.response
    ?.data as DefaultResponseModel.DefaultErrorResponse;
  return swal.fire({
    icon: "error",
    title: "ຜິດພາດ",
    text: response_data?.error ?? "",
  });
};

export const FormatDatetime = (date: any) => {
  const dayjs = useDayjs();
  if (date) {
    return dayjs(new Date(date)).format("DD-MM-YYYY HH:mm:ss");
  }

  return date;
};

export const onLogout = () => {
  localStorage.clear();
  setTimeout(() => {
    goPath("/login");
  }, 1200);
};

export const GetAgencyType = () => {
  return [
    {
      title: "ຕົວແທນແບບແຂວງ (Province Agency)",
      value: "PROVINCE",
    },
    {
      title: "ຕົວແທນແບບເມືອງ (District Agency)",
      value: "DISTRICT",
    },
    {
      title: "ຕົວແທນແບບບຸກຄົນ (Unit Agency)",
      value: "UNIT",
    },
  ];
};

export const GetAgencyTypeLabel = (type: string): string => {
  const list_of_agency_label = {
    PROVINCE: "ຕົວແທນແບບແຂວງ (Province Agency)",
    DISTRICT: "ຕົວແທນແບບເມືອງ (District Agency)",
    UNIT: "ຕົວແທນແບບບຸກຄົນ (Unit Agency)",
  } as { [key: string]: string };

  return list_of_agency_label?.[type] ?? "N/A";
};

export const GetDefaultStatus = () => {
  return [
    { title: "ເປີດໃຊ້ງານ", value: 1 },
    {
      title: "ປິດໃຊ້ງານ",
      value: 0,
    },
  ];
};

export const CallSwal = (options: SweetAlertOptions) => {
  return swal.fire({
    ...options,
    customClass: {
      confirmButton: "custom-confirm-button",
    },
  });
};

export const GetImageUrl = (file: File | string | null) => {
  if (file) {
    if (typeof file === "object") {
      return URL.createObjectURL(file);
    } else {
      return file;
    }
  }

  return "";
};

export const GetIdentitiesList = () => {
  return [
    {
      title: "ບັດປະຈຳຕົວ",
      value: 1,
    },
    {
      title: "ພາສປອດ / Passport",
      value: 2,
    },
    {
      title: "ສຳມະໂນຄົວ",
      value: 3,
    },
  ];
};
export const GetIdentitiesLabel = (type: number): string => {
  const list_indetities_label = {
    1: "ບັດປະຈຳຕົວ",
    2: "ພາສປອດ / Passport",
    3: "ສຳມະໂນຄົວ",
  } as { [key: number]: string };
  return list_indetities_label?.[type] ?? "N/A";
};

export const formatnumber = (value: number | string) => {
  if (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return 0;
  }
};

export const GetItemPerPageOptions = () => {
  return [
    {
      title: "2",
      value: 2,
    },
    {
      title: "5",
      value: 5,
    },
    {
      title: "10",
      value: 10,
    },
    {
      title: "20",
      value: 20,
    },
    {
      title: "30",
      value: 30,
    },
    {
      title: "50",
      value: 50,
    },
    {
      title: "100",
      value: 100,
    },
    {
      title: "200",
      value: 200,
    },
  ];
};

export const delayGoPath = (path: string) => {
  if (!path) {
    return;
  }

  return setTimeout(() => {
    window.location.href = path;
  }, 1200);
};
