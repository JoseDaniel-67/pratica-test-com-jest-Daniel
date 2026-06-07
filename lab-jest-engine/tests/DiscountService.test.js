const DiscountService = require('../src/DiscountService');

describe('DiscountService', () => {
  let service;

  beforeEach(() => {
    service = new DiscountService();
  });

  describe('Validação de Entradas', () => {

    test('deve retornar 0 para cliente não cadastrado (tipo desconhecido)', () => {
      
      const amount = 300;
      const customerType = 'GUEST';

      const discount = service.calculate(amount, customerType);

      expect(discount).toBe(0);
    });

    test('deve processar compra de R$0,00 sem lançar exceção', () => {
      expect(() => service.calculate(0, 'VIP')).not.toThrow();
      expect(service.calculate(0, 'VIP')).toBe(0);
    });

    test('deve lançar erro se amount for null', () => {
      expect(() => service.calculate(null, 'VIP')).toThrow('Valor da compra inválido');
    });

    test('deve lançar erro se amount for undefined', () => {
      expect(() => service.calculate(undefined, 'VIP')).toThrow('Valor da compra inválido');
    });

    test('deve lançar erro se amount for NaN', () => {
      expect(() => service.calculate(NaN, 'VIP')).toThrow('Valor da compra inválido');
    });

    test('deve lançar erro se amount for uma String', () => {
      expect(() => service.calculate('100', 'VIP')).toThrow('Valor da compra inválido');
    });

    test('deve lançar erro se amount for negativo', () => {
      expect(() => service.calculate(-1, 'VIP')).toThrow('Valor da compra inválido');
    });
  });

  describe('Regras de Desconto — Análise de Valor Limite', () => {

    test.each([
      // [descrição, perfil, valor, desconto esperado]
      ['VIP abaixo do limite',   'VIP',     999.99, 999.99 * 0.10],
      ['VIP no limite exato',    'VIP',     1000,   1000   * 0.20],
      ['REGULAR abaixo do limite', 'REGULAR', 499.99, 0],
      ['REGULAR no limite exato',  'REGULAR', 500,    500   * 0.05],
    ])('%s: calculate(%f, %s) deve retornar %f', (_, customerType, amount, expected) => {
      expect(service.calculate(amount, customerType)).toBeCloseTo(expected, 2);
    });
  });

  describe('Regras VIP', () => {
    test('VIP com compra abaixo de R$1000 recebe 10% de desconto', () => {
      expect(service.calculate(500, 'VIP')).toBe(50);
    });

    test('VIP com compra igual a R$1000 recebe 20% de desconto', () => {
      expect(service.calculate(1000, 'VIP')).toBe(200);
    });
  });

  describe('Regras REGULAR', () => {
    test('REGULAR com compra abaixo de R$500 não recebe desconto', () => {
      expect(service.calculate(300, 'REGULAR')).toBe(0);
    });

    test('REGULAR com compra igual a R$500 recebe 5% de desconto', () => {
      expect(service.calculate(500, 'REGULAR')).toBe(25);
    });
  });
});