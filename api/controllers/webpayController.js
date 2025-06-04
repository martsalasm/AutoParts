import transbank from 'transbank-sdk';

const {
  WebpayPlus,
  Options,
  Environment,
  IntegrationCommerceCodes,
  IntegrationApiKeys,
} = transbank;

// Crear instancia de Transaction con opciones para ambiente integración
const tx = new WebpayPlus.Transaction(
  new Options(
    IntegrationCommerceCodes.WEBPAY_PLUS,  // CODIGO COMERCIO
    IntegrationApiKeys.WEBPAY,             // APIKEY
    Environment.Integration                 // Ambiente de prubeas/integracion
  )
);

const iniciarPago = async (req, res) => {
  try {
    const { monto, ordenId, sessionId, returnUrl } = req.body;

    // Crear transacción en Webpay
    const response = await tx.create(
      ordenId,      // Identificador único de la orden (buy_order)
      sessionId,    // Identificador de sesión (session_id)
      monto,        // Monto de la transacción
      returnUrl     // URL de retorno después del pago
    );

    res.json({
      url: response.url,
      token: response.token,
    });
  } catch (error) {
    console.error('Error iniciando pago Webpay:', error);
    res.status(500).json({ error: 'Error al iniciar el pago' });
  }
};

const confirmarPago = async (req, res) => {
  try {
    const { token_ws } = req.query;

    // Confirmar transacción
    const result = await tx.commit(token_ws);

    if (result.response_code === 0) {
        return res.redirect(`http://localhost:5501/front-end/pago-exitoso.html?token=${token_ws}`);
    } else {
      return res.json({
        success: false,
        message: 'Pago rechazado o error',
        data: result,
      });
    }
  } catch (error) {
    console.error('Error confirmando pago Webpay:', error);
    res.status(500).json({ error: 'Error al confirmar el pago' });
  }
};

export default {
  iniciarPago,
  confirmarPago,
};
