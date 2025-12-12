import { FastifyTypedInstance } from "../main/types.js";
import { FastifyRequest, FastifyReply } from "fastify";
import { uploadImage, deleteImage } from "../services/cloudinary.js";

export async function uploadRoutes(app: FastifyTypedInstance) {
    // Rota para upload de imagem
    app.post('/upload', {
        preHandler: [app.authenticate]
    }, async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const data = await request.file();

            if (!data) {
                return reply.status(400).send({ message: 'Nenhum arquivo enviado' });
            }

            // Verifica se é uma imagem
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedMimeTypes.includes(data.mimetype)) {
                return reply.status(400).send({ 
                    message: 'Tipo de arquivo não permitido. Use: JPG, PNG, WEBP ou GIF' 
                });
            }

            // Converte o stream para buffer
            const chunks: Buffer[] = [];
            for await (const chunk of data.file) {
                chunks.push(chunk);
            }
            const fileBuffer = Buffer.concat(chunks);

            // Limita tamanho do arquivo (5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (fileBuffer.length > maxSize) {
                return reply.status(400).send({ 
                    message: 'Arquivo muito grande. Tamanho máximo: 5MB' 
                });
            }

            // Faz upload para o Cloudinary
            const result = await uploadImage(fileBuffer, 'complaints');

            return reply.status(200).send({
                message: 'Upload realizado com sucesso',
                url: result.url,
                publicId: result.publicId
            });
        } catch (error) {
            console.error('Erro no upload:', error);
            return reply.status(500).send({ message: 'Erro ao fazer upload da imagem' });
        }
    });

    // Rota para deletar imagem
    app.delete<{ Params: { publicId: string } }>('/upload/:publicId', {
        preHandler: [app.authenticate]
    }, async (request, reply) => {
        try {
            const { publicId } = request.params;

            if (!publicId) {
                return reply.status(400).send({ message: 'Public ID não informado' });
            }

            // O publicId vem codificado na URL, precisa decodificar
            const decodedPublicId = decodeURIComponent(publicId);

            await deleteImage(decodedPublicId);

            return reply.status(200).send({ message: 'Imagem deletada com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar imagem:', error);
            return reply.status(500).send({ message: 'Erro ao deletar imagem' });
        }
    });
}
