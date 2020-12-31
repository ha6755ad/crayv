// eslint-disable-next-line no-unused-vars
const {box, randomBytes, secretbox} = require('tweetnacl');
// eslint-disable-next-line no-unused-vars
const {decodeUTF8, encodeUTF8, encodeBase64, decodeBase64} = require('tweetnacl-util');

const getPairFromSecret = (secret) => {
  return box.keyPair.fromSecretKey(secret);
};

const getNonce = () => {
  return randomBytes(box.nonceLength);
};

const encryptString = (string, nonce, publicKey, privateKey) => {
  return box(string, nonce, publicKey, privateKey);
};

const decryptString = (string, nonce, publicKey, privateKey) => {
  return box.open(string, nonce, publicKey, privateKey);
};

const getSharedKey = (theirPublicKey, mySecretKey) => {
  box.before(theirPublicKey, mySecretKey);
};

const getKeyPair = () => {
  return box.keyPair();
};

const getSharedEncryption = (message, nonce, sharedKey) => {
  return box.after(message, nonce, sharedKey);
};

const openSharedEncryption = (message, nonce, sharedKey) => {
  return box.open.after(message, nonce, sharedKey);
};

const createSecretMessage = (message, nonce, key) => {
  return secretbox(message, nonce, key);
};

const openSecretMessage = (secret_message, nonce, key) => {
  return secretbox.open(secret_message, nonce, key);
};

const convertUint8ToBase64 = (uint8) => {
  return decodeBase64(encodeUTF8(uint8));
};

const convertBase64ToUint8 = (base64) => {
  return decodeUTF8(encodeBase64(base64));
};


module.exports = {
  getPairFromSecret,
  encryptString,
  decryptString,
  getNonce,
  getSharedKey,
  encodeUTF8,
  decodeUTF8,
  encodeBase64,
  decodeBase64,
  getSharedEncryption,
  openSharedEncryption,
  createSecretMessage,
  openSecretMessage,
  getKeyPair,
  convertBase64ToUint8,
  convertUint8ToBase64
};
