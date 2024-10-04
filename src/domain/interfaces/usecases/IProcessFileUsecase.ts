import { UserOrderDTO } from "../../../application/services/FileService";

export abstract class IProcessFileUseCase {
  abstract execute(userOrder: UserOrderDTO): Promise<void>;
}
