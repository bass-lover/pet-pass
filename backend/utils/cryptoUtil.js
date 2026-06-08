const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTED_PREFIX = 'enc:';

// 실제 서비스에서는 반드시 환경변수로 관리하는 것이 좋음
const SECRET_KEY =
  process.env.PETPASS_CRYPTO_KEY || 'pet-pass-demo-secret-key-2026';

const getKey = () => {
  return crypto.createHash('sha256').update(SECRET_KEY).digest();
};

const encryptText = (plainText) => {
  if (!plainText) {
    return null;
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(String(plainText), 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    ENCRYPTED_PREFIX,
    iv.toString('base64'),
    authTag.toString('base64'),
    encrypted.toString('base64'),
  ].join(':');
};

const decryptText = (encryptedText) => {
  if (!encryptedText) {
    return null;
  }

  const value = String(encryptedText);

  // 기존에 평문으로 저장된 데이터는 그대로 반환
  if (!value.startsWith(ENCRYPTED_PREFIX)) {
    return value;
  }

  try {
    const parts = value.split(':');

    const iv = Buffer.from(parts[1], 'base64');
    const authTag = Buffer.from(parts[2], 'base64');
    const encrypted = Buffer.from(parts[3], 'base64');

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  } catch (error) {
    console.error('복호화 오류:', error);
    return null;
  }
};

module.exports = {
  encryptText,
  decryptText,
};