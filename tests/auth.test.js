import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import authenticate from '../src/middlewares/authenticate.js';
import authorize from '../src/middlewares/authorize.js';
import authService from '../src/services/AuthService.js';
import userRepository from '../src/repositories/UserRepository.js';
import roleRepository from '../src/repositories/RoleRepository.js';

function response() {
  return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}

test('rechaza solicitudes sin token o con firma incorrecta', () => {
  process.env.JWT_SECRET = 'test-secret-only';
  for (const headers of [{}, { authorization: `Bearer ${jwt.sign({ sub: '123' }, 'wrong-secret')}` }]) {
    const res = response();
    authenticate({ headers }, res, () => assert.fail('No debe autorizar'));
    assert.equal(res.statusCode, 401);
  }
});

test('acepta token valido y rechaza rol user en ruta admin', () => {
  process.env.JWT_SECRET = 'test-secret-only';
  const token = jwt.sign({ sub: '123', roles: ['user'] }, process.env.JWT_SECRET);
  const req = { headers: { authorization: `Bearer ${token}` } };
  let passed = false;
  authenticate(req, response(), () => { passed = true; });
  assert.equal(passed, true);
  assert.equal(req.userId, '123');
  const res = response();
  authorize(['admin'])(req, res, () => assert.fail('No debe autorizar'));
  assert.equal(res.statusCode, 403);
});

test('registro publico ignora rol admin enviado y guarda hash', async (t) => {
  process.env.BCRYPT_SALT_ROUNDS = '4';
  t.mock.method(userRepository, 'findByEmail', async () => null);
  t.mock.method(roleRepository, 'findByName', async (name) => {
    assert.equal(name, 'user');
    return { _id: 'user-role' };
  });
  let saved;
  t.mock.method(userRepository, 'create', async (data) => { saved = data; return { ...data, _id: '123' }; });
  const result = await authService.signUp({ email: ' TEST@EXAMPLE.COM ', password: 'sample-test-password', name: 'Test', roles: ['admin'] });
  assert.deepEqual(saved.roles, ['user-role']);
  assert.equal(saved.email, 'test@example.com');
  assert.notEqual(saved.password, 'sample-test-password');
  assert.equal(await bcrypt.compare('sample-test-password', saved.password), true);
  assert.equal(result.password, undefined);
});
