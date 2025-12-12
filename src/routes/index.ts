import { FastifyTypedInstance } from "../main/types.js";
import { userRoutes } from "./user.routes.js";
import { complaintRoutes } from "./complaint.routes.js";
import { authRoutes } from "./auth.routes.js";
import { uploadRoutes } from "./upload.routes.js";

export async function registerRoutes(app: FastifyTypedInstance) {
    app.get('/health', async () => {
        return {
            status: "ok",
            timestamp: new Date().toISOString()
        };
    });

    app.get("/", async () => {
        return {
            name: "CadeALuzMaraba API",
            version: "1.0.0",
            timestamp: new Date().toISOString(),
            status: "success"
        };
    });

    app.register(authRoutes);
    app.register(userRoutes);
    app.register(complaintRoutes);
    app.register(uploadRoutes);
}
