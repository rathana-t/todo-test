import { MainService } from "./mainService";

export default class TodoService extends MainService {
//   endpoint = "/todo";

  constructor() {
    super("/todo");
  }
}
