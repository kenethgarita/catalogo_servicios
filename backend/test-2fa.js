// test-2fa.js
// Ejecuta esto con: node test-2fa.js

import speakeasy from 'speakeasy';

// ✅ Genera un nuevo secret de prueba
const secret = speakeasy.generateSecret({
  name: 'Test IFAM',
  issuer: 'IFAM Test'
});

console.log('🔑 Secret generado:');
console.log('   Base32:', secret.base32);
console.log('   OTP URL:', secret.otpauth_url);
console.log('');

// ✅ Genera códigos de prueba
console.log('📱 Generando códigos TOTP:');
for (let i = 0; i < 5; i++) {
  const token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32'
  });
  console.log(`   Código ${i + 1}: ${token}`);
}
console.log('');

// ✅ Simula verificación con diferentes windows
const testCode = speakeasy.totp({
  secret: secret.base32,
  encoding: 'base32'
});

console.log(`🧪 Probando código: ${testCode}`);
console.log('');

// Prueba con window 2 (60 segundos)
const verify1 = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: testCode,
  window: 2
});
console.log(`   ✓ Window 2 (60 seg): ${verify1 ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);

// Prueba con window 6 (3 minutos)
const verify2 = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: testCode,
  window: 6
});
console.log(`   ✓ Window 6 (3 min): ${verify2 ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
console.log('');

// ✅ Simula códigos de respaldo
console.log('🎫 Códigos de respaldo (formato hexadecimal):');
const backupCodes = Array.from({ length: 10 }, () => 
  require('crypto').randomBytes(4).toString('hex').toUpperCase()
);
backupCodes.forEach((code, i) => {
  console.log(`   ${i + 1}. ${code}`);
});
console.log('');

console.log('💡 INSTRUCCIONES:');
console.log('   1. Copia el "OTP URL" de arriba');
console.log('   2. Pégalo en Google Authenticator manualmente');
console.log('   3. Compara el código que genera con los de arriba');
console.log('   4. Si coinciden, el problema NO es el código');
console.log('   5. Si NO coinciden, verifica la sincronización de hora');