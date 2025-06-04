import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const apiKeyCobertura = process.env.KEY_COBERTURA;
const coberturaApiUrl = 'http://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas';

const validarCobertura = async (req, res) => {
  const { region, comuna, regionCode } = req.body;

  if (!regionCode || !comuna) {
    return res.status(400).json({ error: 'Se requiere el código de región y la comuna.' });
  }

  const url = `${coberturaApiUrl}?RegionCode=${regionCode}&type=1`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': apiKeyCobertura,
      },
    });

    const data = response.data;
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
    console.error('Error al llamar a la API de Cobertura:', error.message);
    return res.status(500).json({ error: 'Error interno al validar la cobertura.' });
  }
};

export default {
  validarCobertura,
};
