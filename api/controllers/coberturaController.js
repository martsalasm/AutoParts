import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const apiKeyCobertura = process.env.KEY_COBERTURA;
const coberturaApiUrl = 'http://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas';

const validarCobertura =  async (req, res) => {

  const { region, comuna, regionCode } = req.body;

  if (!regionCode || !comuna) {
    return res.status(400).json({ error: 'Se requiere el código de región y la comuna.' });
  }

  const url = `${coberturaApiUrl}?RegionCode=${regionCode}&type=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': apiKeyCobertura,
      },
    });

    if (!response.ok) {
      console.error(`Error de la API de Chilexpress: ${response.status}`);
      return res.status(500).json({ error: 'Error al consultar la API de Chilexpress.' });
    }

    const data = await response.json();
    console.log('Respuesta de la API de Cobertura:', data);
    if (data && data.coverageAreas) {
      const coberturaEncontrada = data.coverageAreas.find(
        (coverage) => coverage.countyName.toLowerCase() === comuna.toLowerCase()
      );

      if (coberturaEncontrada) {
        return res.json({ tieneCobertura: true, countyCode: coberturaEncontrada.countyCode });
      } else {
        return res.json({ tieneCobertura: false });
      }
    } else {
      console.error('Respuesta de la API de Cobertura inesperada:', data);
      return res.status(500).json({ error: 'Respuesta de la API de Cobertura inválida.' });
    }
  } catch (error) {
    console.error('Error al llamar a la API de Cobertura:', error);
    return res.status(500).json({ error: 'Error interno al validar la cobertura.' });
  }
};

export default {
  validarCobertura,
};