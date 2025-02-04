const crypto = require('crypto');

// Encryption function
function encryptMessage(message, secretKey) {
    const iv = crypto.randomBytes(16); // Generate a random initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(message, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // return IV and encrypted message combined
}

// Decryption function
function decryptMessage(encryptedMessage, secretKey) {
    const [iv, encrypted] = encryptedMessage.split(':'); // Split IV and encrypted message
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

// Example usage
// const secretKey = '12345678901234567890123456789012'; // 32-byte key for AES-256
// const message = 'Hello, this is a secret message!';

// const encryptedMessage = encryptMessage(message, secretKey);
// console.log('Encrypted:', encryptedMessage);

// const decryptedMessage = decryptMessage(encryptedMessage, secretKey);
// console.log('Decrypted:', decryptedMessage);

module.exports = { encryptMessage, decryptMessage };
