import { HTTPMethod } from "@/app/constants/HTTPMethod";
import { BaseResponse } from "../models/BaseReponse";

export class MainService {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = `/api${endpoint}`;
  }

  public async get<T>() {
    const res = await fetch(this.endpoint, {
      ...this.buildRequest(HTTPMethod.GET),
    });

    return (await res.json()) as BaseResponse<T[]>;
  }

  public async post<T, U>(body: T) {
    const res = await fetch(this.endpoint, {
      ...this.buildRequest(HTTPMethod.POST, body),
    });

    return (await res.json()) as BaseResponse<U>;
  }

  public async put<T, U>(id: string, body: T) {
    const res = await fetch(`${this.endpoint}/${id}`, {
      ...this.buildRequest(HTTPMethod.PUT, body),
    });

    return (await res.json()) as BaseResponse<U>;
  }

  public async delete<T>(id: string) {
    const res = await fetch(`${this.endpoint}/${id}`, {
      ...this.buildRequest(HTTPMethod.DELETE),
    });

    return (await res.json()) as BaseResponse<T>;
  }

  private buildRequest<T>(method: string, body?: T) {
    return {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
  }
}
