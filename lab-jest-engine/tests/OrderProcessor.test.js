const OrderProcessor = require('../src/OrderProcessor');

describe('OrderProcessor', () => {
  let processor;
  let paymentGateway;
  let emailService;

  beforeEach(() => {
    paymentGateway = {
      charge: jest.fn(),
    };
    emailService = {
      sendReceipt: jest.fn(),
      sendFailureNotification: jest.fn(),
    };

    processor = new OrderProcessor(paymentGateway, emailService);

    jest.clearAllMocks();
  });

  describe('Validação de Entrada', () => {

    test('deve rejeitar se user for null', async () => {
      await expect(processor.processOrder(null, 100))
        .rejects.toThrow('Usuário inválido');

      expect(paymentGateway.charge).not.toHaveBeenCalled();
    });

    test('deve rejeitar se user não tiver email', async () => {
      await expect(processor.processOrder({ id: 1 }, 100))
        .rejects.toThrow('Usuário inválido');

      expect(paymentGateway.charge).not.toHaveBeenCalled();
    });
  });

  describe('Caminho Feliz — pagamento aprovado', () => {

    test('deve retornar { status: SUCCESS } e enviar recibo', async () => {
      const user = { id: 42, email: 'joao@email.com' };
      const amount = 250;

      paymentGateway.charge.mockResolvedValue(true);
      emailService.sendReceipt.mockResolvedValue(undefined);

      const result = await processor.processOrder(user, amount);

      expect(result).toEqual({ status: 'SUCCESS' });

      expect(emailService.sendReceipt)
        .toHaveBeenCalledWith('joao@email.com', 250);

      expect(emailService.sendFailureNotification).not.toHaveBeenCalled();
    });
  });

  describe('Caminho de Recusa — pagamento negado', () => {

    test('deve lançar erro e enviar notificação de falha', async () => {
      const user = { id: 7, email: 'maria@email.com' };

      paymentGateway.charge.mockResolvedValue(false);
      emailService.sendFailureNotification.mockResolvedValue(undefined);

      await expect(processor.processOrder(user, 300))
        .rejects.toThrow('Pagamento recusado');

      expect(emailService.sendFailureNotification)
        .toHaveBeenCalledWith('maria@email.com');

      expect(emailService.sendReceipt).not.toHaveBeenCalled();
    });
  });

  describe('Erro de Infraestrutura', () => {

    test('deve propagar erro de rede do gateway (Timeout)', async () => {
      const user = { id: 99, email: 'ana@email.com' };

      paymentGateway.charge.mockRejectedValue(new Error('Timeout'));

      await expect(processor.processOrder(user, 500))
        .rejects.toThrow('Timeout');
    });
  });
});