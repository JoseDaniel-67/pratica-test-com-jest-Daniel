class DiscountService {
    calculate(amount, customerType) {
        if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
            throw new Error('Valor da compra inválido');
        }
        if (customerType === 'VIP') {
            return amount >= 1000 ? amount * 0.20 : amount * 0.10;
        }
        if (customerType === 'REGULAR') {
            return amount >= 500 ? amount * 0.05 : 0;
        }
        return 0;
    }
}
module.exports = DiscountService;