import { WebpayPlus } from 'transbank-sdk'
WebpayPlus.configureForIntegration('597055555532', 'test', 'https://webpay3gint.transbank.cl');

const crearTransaccion = async (req, res) => {
  const { amount, buyOrder, sessionId, returnUrl } = req.body;

  try {
    const response = await WebpayPlus.Transaction.create(
      buyOrder,
      sessionId,
      amount,
    returnUrl
    );

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    res.status(500).json({ error: 'Error al crear la transacción' });
  }
};

const confirmarTransaccion = async (req, res) => {
  const { token_ws } = req.body;

  try {
    const result = await WebpayPlus.Transaction.commit(token_ws);
    console.log("Pago confirmado:", result);

    // Aquí podrías guardar la compra en base de datos, etc.
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al confirmar transacción:", error);
    res.status(500).json({ error: "No se pudo confirmar la transacción" });
  }
};

export default{
    crearTransaccion,
    confirmarTransaccion
}