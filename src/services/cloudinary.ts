import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export interface UploadResult {
    url: string;
    publicId: string;
}

/**
 * Faz upload de uma imagem para o Cloudinary
 * @param fileBuffer - Buffer do arquivo
 * @param folder - Pasta no Cloudinary (opcional)
 * @returns URL e public_id da imagem
 */
export const uploadImage = async (fileBuffer: Buffer, folder: string = 'complaints'): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' }, // Limita tamanho máximo
                    { quality: 'auto' }, // Qualidade automática
                    { fetch_format: 'auto' } // Formato automático (webp se suportado)
                ]
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                } else {
                    reject(new Error('Upload falhou sem retornar resultado'));
                }
            }
        ).end(fileBuffer);
    });
};

/**
 * Deleta uma imagem do Cloudinary
 * @param publicId - Public ID da imagem no Cloudinary
 */
export const deleteImage = async (publicId: string): Promise<void> => {
    await cloudinary.uploader.destroy(publicId);
};

/**
 * Gera URL otimizada para exibição
 * @param publicId - Public ID da imagem
 * @param width - Largura desejada
 * @param height - Altura desejada
 */
export const getOptimizedUrl = (publicId: string, width: number = 800, height: number = 600): string => {
    return cloudinary.url(publicId, {
        width,
        height,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto'
    });
};

export default cloudinary;
