import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const apiKeyCobertura = process.env.KEY_COBERTURA;
const apiKeyDespacho = process.env.KEY_DESPACHO;

const coberturaApiUrl = 'http://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas';
const cotizadorApiUrl = "http://testservices.wschilexpress.com/rating/api/v1.0/rates/courier";

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


const calcularDespacho = async (req, res) => {
  const {
    originCountyCode,
    destinationCountyCode,
    package: packageData,
    productType,
    declaredWorth,
  } = req.body;

  if (
    !originCountyCode ||
    !destinationCountyCode ||
    !packageData ||
    !productType ||
    !declaredWorth
  ) {
    return res
      .status(400)
      .json({ error: "Faltan datos necesarios para calcular el despacho." });
  }
  try {
    const response = await axios.post(
      cotizadorApiUrl,
      {
        originCountyCode,
        destinationCountyCode,
        package: {
          weight: packageData.weight,
          height: packageData.height,
          width: packageData.width,
          length: packageData.length,
        },
        productType,
        declaredWorth,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Ocp-Apim-Subscription-Key": apiKeyDespacho,
        },
      }
    );
    return res.json(response.data);
  } catch (error) {
    console.error("Error al calcular el despacho:", error.message);
    return res
      .status(500)
      .json({ error: "Error interno al calcular el despacho." });
  }
};






export default {
  validarCobertura,
  calcularDespacho
};
