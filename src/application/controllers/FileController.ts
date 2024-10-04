import { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";
import { FileService } from "../services/FileService";
import { Container } from "typescript-ioc";

const fileService: FileService = Container.get(FileService);

export const fileRoutes = async (server: FastifyInstance) => {
  server.post("/upload", async (request, reply) => {
    try {
      // Obtém o arquivo da requisição
      const data = await request.file();

      // Verifica se um arquivo foi enviado
      if (!data) {
        reply.code(400).send({ error: "Nenhum arquivo enviado" });
        return;
      }

      // Verifica se o arquivo é do tipo TXT
      if (data.mimetype !== "text/plain") {
        reply.code(400).send({
          error:
            "Tipo de arquivo inválido. Apenas arquivos TXT são permitidos.",
        });
        return;
      }

      // Define o caminho para salvar o arquivo
      const uploadPath = path.join(__dirname, "uploads", data.filename);

      // Cria um stream de escrita para o arquivo
      const writeStream = fs.createWriteStream(uploadPath);

      // Faz o pipe do conteúdo do arquivo para o stream de escrita
      data.file.pipe(writeStream);

      // Aguarda o término da escrita do arquivo
      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      // Processa o arquivo após a escrita completa
      await fileService.processFile(uploadPath);

      // Retorna uma resposta de sucesso
      reply
        .code(200)
        .send({ message: "Arquivo enviado e processado com sucesso!" });
    } catch (error) {
      // Em caso de erro, retorna uma resposta de erro
      console.error(error);
      reply.code(500).send({ error: "Erro ao processar o arquivo" });
    }
  });
};