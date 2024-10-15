export abstract class IFileService {
  abstract execute(linha: string): Promise<void>;
}
