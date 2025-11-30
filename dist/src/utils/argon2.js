import argon2 from "argon2";
export async function hashPassword(password) {
    const hash = await argon2.hash(password);
    return hash;
}
export async function verifyPassword(hash, password) {
    return await argon2.verify(hash, password);
}
//# sourceMappingURL=argon2.js.map