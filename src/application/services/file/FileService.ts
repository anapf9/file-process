import fs from "fs";
import readline from "readline";
import { ProcessFileUseCase } from "../../../domain/usecases/ProcessFileUseCase";
import { Container, Inject } from "typescript-ioc";
import { IProcessFileUseCase } from "../../../domain/interfaces/usecases/IProcessFileUsecase";
import { IFileService } from "./IFileService.interface";

export interface UserOrderDTO {
  user_id: number;
  name: string;
  order_id: number;
  date: string;
  product_id: number;
  value: string;
}

export class FileService implements IFileService {
  // constructor(
  //   @Inject
  //   private readonly processFileUseCase: IProcessFileUseCase
  // ) {}
  private readonly processFileUseCase: IProcessFileUseCase =
    Container.get(ProcessFileUseCase);

  async execute(filePath: string): Promise<void> {
    let contadorLinhas = 0;

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    for await (const linha of rl) {
      contadorLinhas++;
      const registro: UserOrderDTO = {
        user_id: parseInt(this.obterIdUsuario(linha), 10),
        name: this.obterNome(linha),
        order_id: parseInt(this.obterIdPedido(linha), 10),
        date: this.obterDataCompra(linha),
        product_id: parseInt(this.obterIdProduto(linha), 10),
        value: this.obterValorProduto(linha),
      };

      await this.processFileUseCase.execute(registro);
    }

    console.log(`Total de linhas processadas: ${contadorLinhas}`);

    fs.unlinkSync(filePath);

    console.log("Leitura do arquivo concluída e deleção do arquivo.");
  }

  private obterIdUsuario(registro: string): string {
    return this.extractZeros(registro.substring(0, 10).trim());
  }

  private obterNome(registro: string): string {
    return registro.substring(10, 55).trim();
  }

  private obterIdPedido(registro: string): string {
    return this.extractZeros(registro.substring(55, 65).trim());
  }

  private obterIdProduto(registro: string): string {
    return this.extractZeros(registro.substring(65, 75).trim());
  }

  private obterValorProduto(registro: string): string {
    return registro.substring(75, 87).trim();
  }

  private obterDataCompra(registro: string): string {
    return this.formataData(registro.substring(87, 95).trim());
  }

  private formataData(dataBruta: string): string {
    const ano = dataBruta.substring(0, 4);
    const mes = dataBruta.substring(4, 6);
    const dia = dataBruta.substring(6, 8);

    return `${ano}-${mes}-${dia}`;
  }

  private extractZeros(input: string): string {
    const match = RegExp(/^00(\d{1,9})/).exec(input);
    const withoutZeros = match ? String(parseInt(match[1], 10)) : null; // Remove zeros à esquerda

    return withoutZeros ?? "";
  }
}
