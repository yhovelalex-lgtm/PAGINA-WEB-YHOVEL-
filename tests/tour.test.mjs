import test from 'node:test';
import assert from 'node:assert/strict';
import { nextTourStop } from '../src/hooks/useIdleTour.js';

test('el recorrido visita secciones largas en tramos con solapamiento', () => {
  assert.equal(nextTourStop(0, 1000, 6000, [1700, 2500]), 650);
});
test('se detiene en una sección próxima en vez de saltar su inicio', () => {
  assert.equal(nextTourStop(1300, 1000, 6000, [1700, 2500]), 1700);
});
test('ignora capítulos anteriores y respeta el final de página', () => {
  assert.equal(nextTourStop(5800, 1000, 6000, [0, 1700]), 6000);
  assert.equal(nextTourStop(6000, 1000, 6000, []), 6000);
});
