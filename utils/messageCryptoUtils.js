const crypto = require('crypto');


const secretKey = process.env.SECRET_KEY || "12345678901234567890098765432123"



// Encryption function
function encryptMessage(message) {
    const iv = crypto.randomBytes(16); // Generate a random initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(message, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // return IV and encrypted message combined
}



function decryptMessage(encryptedMessage) {
    try {

        if (!encryptedMessage || !secretKey) {
            throw new Error("Missing encrypted message or secret key");
        }

        if (!encryptedMessage.includes(':')) {
            throw new Error("Invalid encrypted message format (missing IV)");
        }

        const [iv, encrypted] = encryptedMessage.split(':');

        if (!iv || !encrypted) {
            throw new Error("IV or encrypted text is undefined");
        }

        const key = Buffer.from(secretKey, 'utf-8'); // Convert key to Buffer

        if (key.length !== 32) {
            throw new Error("Invalid key length. Must be 32 bytes for AES-256");
        }

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString('utf-8');
    } catch (error) {
        console.error("🚨 Decryption Error:", error.message);
        return "Error: Failed to decrypt";
    }
}


module.exports = { encryptMessage, decryptMessage };
