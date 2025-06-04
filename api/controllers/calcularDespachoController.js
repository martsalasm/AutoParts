import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const apiKeyDespacho = process.env.KEY_DESPACHO;
const cotizadorApiUrl =
  "http://testservices.wschilexpress.com/rating/api/v1.0/rates/courier";

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
  calcularDespacho,
};