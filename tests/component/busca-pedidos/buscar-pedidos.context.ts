import Axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";

export class ConsultarPedidosContext {
  private _response: AxiosResponse<any> | null = null;

  private constructor() {
    // no-op
  }
  public static getInstance() {
    return new ConsultarPedidosContext();
  }

  public async request({ params }: AxiosRequestConfig) {
    const url = `${process.env.API_BASE_URL}/orders${params}`;

    await Axios.get<any>(url)
      .then((response) => {
        this._response = response;
      })
      .catch((err: AxiosError<any>) => {
        this._response = err.response ?? null;
      });
  }

  public get response(): AxiosResponse<any> | null {
    return this._response;
  }
}
