class OrderProcessor {
    constructor(paymentGateway, emailService) {
        this.paymentGateway = paymentGateway;
        this.emailService = emailService;
    }
    async processOrder(user, amount) {
        if (!user || !user.email) throw new Error('Usuário inválido');
        const isPaid = await this.paymentGateway.charge(user.id, amount);
        if (isPaid) {
            await this.emailService.sendReceipt(user.email, amount);
            return { status: 'SUCCESS' };
        } else {
            await this.emailService.sendFailureNotification(user.email);
            throw new Error('Pagamento recusado');
        }
    }
}

module.exports = OrderProcessor;    