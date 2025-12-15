import { FastifyTypedInstance } from "../main/types.js";
import { uploadImageController, deleteImageController } from "../controllers/upload.controller.js";

export async function uploadRoutes(app: FastifyTypedInstance) {
    app.post('/upload', {
        preHandler: [app.authenticate]
    }, uploadImageController);

    app.delete<{ Params: { publicId: string } }>('/upload/:publicId', {
        preHandler: [app.authenticate]
    }, deleteImageController);
}
