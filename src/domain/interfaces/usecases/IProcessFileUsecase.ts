import { UserOrderDTO } from "../../../application/services/file/FileService";

export abstract class IProcessFileUseCase {
  abstract execute(userOrder: UserOrderDTO): Promise<void>;
}
