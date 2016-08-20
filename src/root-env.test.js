import test from 'ava';
import * as GLISP from './index';
import * as I from 'immutable';

test('or should work on more than one arg', (assert) => {
  const result = run(GLISP.RootEnv, `
    (or false "" false false false true)
  `);

  assert.true(result);
});

test('or should return the first truthy object', (assert) => {
  const result = run(GLISP.RootEnv, `
    (or false {})
  `);

  assert.true(I.is(result, I.Map()));
});

test('and should work on more than one arg', (assert) => {
  const result = run(GLISP.RootEnv, `
    (and true {} #{} (Stack) true false)
  `);

  assert.false(result);
});

test('and should return the first falsey object', (assert) => {
  const result = run(GLISP.RootEnv, `
    (and true true true true true "")
  `);

  assert.is(result, '');
});

test('Map? should tell if an object is a Map', (assert) => {
  assert.true(run(GLISP.RootEnv, '(Map? {})'));
  assert.false(run(GLISP.RootEnv, '(Map? #{})'));
  assert.false(run(GLISP.RootEnv, '(Map? ())'));
  assert.false(run(GLISP.RootEnv, '(Map? [])'));
  assert.false(run(GLISP.RootEnv, '(Map? 0)'));
  assert.false(run(GLISP.RootEnv, '(Map? "")'));
});

test('List? should tell if an object is a List', (assert) => {
  assert.true(run(GLISP.RootEnv, '(List? [])'));
  assert.false(run(GLISP.RootEnv, '(List? #{})'));
  assert.false(run(GLISP.RootEnv, '(List? ())'));
  assert.false(run(GLISP.RootEnv, '(List? {})'));
  assert.false(run(GLISP.RootEnv, '(List? 0)'));
  assert.false(run(GLISP.RootEnv, '(List? "")'));
});

test('Set? should tell if an object is a Set', (assert) => {
  assert.true(run(GLISP.RootEnv, '(Set? #{})'));
  assert.false(run(GLISP.RootEnv, '(Set? [])'));
  assert.false(run(GLISP.RootEnv, '(Set? ())'));
  assert.false(run(GLISP.RootEnv, '(Set? {})'));
  assert.false(run(GLISP.RootEnv, '(Set? 0)'));
  assert.false(run(GLISP.RootEnv, '(Set? "")'));
});

test('Stack? should tell if an object is a Stack', (assert) => {
  assert.true(run(GLISP.RootEnv, '(Stack? ())'));
  assert.false(run(GLISP.RootEnv, '(Stack? [])'));
  assert.false(run(GLISP.RootEnv, '(Stack? #{})'));
  assert.false(run(GLISP.RootEnv, '(Stack? {})'));
  assert.false(run(GLISP.RootEnv, '(Stack? 0)'));
  assert.false(run(GLISP.RootEnv, '(Stack? "")'));
});

test('Seq? should tell if an object is a Seq', (assert) => {
  assert.true(run(GLISP.RootEnv, '(Seq? ((fn [& args] args) 1 2 3))'));
  assert.false(run(GLISP.RootEnv, '(Seq? ())'));
  assert.false(run(GLISP.RootEnv, '(Seq? [])'));
  assert.false(run(GLISP.RootEnv, '(Seq? #{})'));
  assert.false(run(GLISP.RootEnv, '(Seq? {})'));
  assert.false(run(GLISP.RootEnv, '(Seq? 0)'));
  assert.false(run(GLISP.RootEnv, '(Seq? "")'));
});

function run(env, code) {
  return GLISP.evaluate(env, GLISP.parse(code));
}