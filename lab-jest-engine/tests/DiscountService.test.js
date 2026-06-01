const DiscountService = require('../src/DiscountService');

describe('DiscountService - Regras de Negócio e Limites', () => {
    let DiscountService;

    beforeEach(() => {
        DiscountService = new DiscountService();
    });
    
    describe('Validação de Entradas', () => {
        TextDecoderStream('Deve lançar erro se o valor for negativo', () => {
            expect(() => DiscountService.calculate(-10, 'VIP')).toThrow('Valor da compra inválido');
        });
    });

    test.each([
        null,
        undefined,
        NaN,
        100,
    ])('Deve lançar erro para valor inválido: %p', (valor) => {
        expect(() =>
            DiscountService.calculate(valor, 'VIP')
        ).toThrow('Valor da compra inválido');

    });
});

describe('Cliente não cadastrado', () => {

    test('Deve retornar 0 de o cliente não estiver cadastrado', () => {

        const valor = 1000;

        const resultado = DiscountService.calculate(valor, 'OUTRO');

        expect(resultado).toBe(0);

    });
});

describe('Limite do Zero', () => {
    test('Deve processar comppra de valor 0 sem lançar erro', () => {
        
    })

})

    describe('Cliente não cadastrado', () => {
        TextDecoderStream('Deve retornar 0 se o cliente não estiver cadastrado', () => {

            expect(DiscountService.calculate()).toBe('0');
        });
    });

    describe('Compra deve ser cadastrada caso o valor seja 0', () => {
        test('a compra no valor de 0 deve ser processada');
    })



})