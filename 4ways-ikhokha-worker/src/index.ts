export interface Env {
  IKHOKHA_APP_ID: string;
  IKHOKHA_APP_SECRET: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400"
};

const IKHOKHA_URL =
  "https://api.ikhokha.com/public-api/v1/api/payment";

const IKHOKHA_PATH =
  "/public-api/v1/api/payment";

function response(
  data: unknown,
  status = 200
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );
}

async function createSignature(
  body: string,
  secret: string
): Promise<string> {

  // iKhokha requires the API path + request body
  // to be escaped before generating the HMAC.
  const payload =
    IKHOKHA_PATH + body;

  const escapedPayload =
    payload
      .replace(/[\\"']/g, "\\$&")
      .replace(/\u0000/g, "\\0");

  const encoder =
    new TextEncoder();

  const cryptoKey =
    await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret.trim()),
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      false,
      ["sign"]
    );

  const signature =
    await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      encoder.encode(escapedPayload)
    );

  return Array.from(
    new Uint8Array(signature)
  )
    .map(
      byte =>
        byte.toString(16).padStart(2, "0")
    )
    .join("");
}

export default {
  async fetch(
    request: Request,
    env: Env
  ): Promise<Response> {

    /*
     * CORS
     */
    if (request.method === "OPTIONS") {

      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    /*
     * GET health check
     */
    if (request.method === "GET") {

      return response({
        success: true,
        message:
          "4Ways iKhokha Worker is running"
      });
    }

    /*
     * Only POST
     */
    if (request.method !== "POST") {

      return response(
        {
          success: false,
          error: "Method not allowed"
        },
        405
      );
    }

    try {

      /*
       * Read request from Angular.
       */
      const incoming =
        await request.json() as {
          amount: number;
          externalTransactionID: string;
          requesterUrl?: string;
          callbackUrl?: string;
          successPageUrl?: string;
          failurePageUrl?: string;
          cancelUrl?: string;
        };

      /*
       * Validate.
       */
      if (
        !incoming.amount ||
        incoming.amount <= 0
      ) {

        return response(
          {
            success: false,
            error: "Invalid amount"
          },
          400
        );
      }

      if (
        !incoming.externalTransactionID
      ) {

        return response(
          {
            success: false,
            error:
              "externalTransactionID is required"
          },
          400
        );
      }

      /*
       * Convert Rands to cents.
       *
       * R70 -> 7000
       */
      const amount =
        Math.round(
          incoming.amount * 100
        );

      /*
       * iKhokha request.
       *
       * Keep this object simple.
       */
      const paymentRequest = {
        entityID:
          env.IKHOKHA_APP_ID,

        externalEntityID:
          "4WAYS-BUTCHERY",

        amount:
          amount,

        currency:
          "ZAR",

        requesterUrl:
          incoming.requesterUrl,

        mode:
          "live",

        description:
          `4Ways Online Order - ${incoming.externalTransactionID}`,

        externalTransactionID:
          incoming.externalTransactionID,

        urls: {
          callbackUrl:
            incoming.callbackUrl,

          successPageUrl:
            incoming.successPageUrl,

          failurePageUrl:
            incoming.failurePageUrl,

          cancelUrl:
            incoming.cancelUrl
        }
      };

      /*
       * Convert object to REAL JSON.
       */
      const requestBody =
        JSON.stringify(paymentRequest);

      /*
       * Log the exact body.
       *
       * DO NOT log the secret.
       */
      console.log(
        "JSON being sent to iKhokha:"
      );

      console.log(
        requestBody
      );

      /*
       * Generate signature from
       * the exact same JSON string.
       */
      const signature =
        await createSignature(
          requestBody,
          env.IKHOKHA_APP_SECRET
        );

      /*
       * Send request to iKhokha.
       */
      const ikhokhaResponse =
        await fetch(
          IKHOKHA_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Accept":
                "application/json",

              "IK-APPID":
                env.IKHOKHA_APP_ID.trim(),

              "IK-SIGN":
                signature
            },

            /*
             * THIS IS THE EXACT JSON
             * WE GENERATED ABOVE.
             */
            body:
              requestBody
          }
        );

      /*
       * Read response.
       */
      const responseText =
        await ikhokhaResponse.text();

      console.log(
        "iKhokha status:",
        ikhokhaResponse.status
      );

      console.log(
        "iKhokha response:"
      );

      console.log(
        responseText
      );

      let result: unknown;

      try {

        result =
          JSON.parse(responseText);

      } catch {

        result = {
          rawResponse:
            responseText
        };
      }

      /*
       * iKhokha error.
       */
      if (!ikhokhaResponse.ok) {

        return response(
          {
            success: false,

            error:
              "iKhokha rejected the request",

            status:
              ikhokhaResponse.status,

            details:
              result
          },
          502
        );
      }

      /*
       * Success.
       */
      return response(
        {
          success: true,
          result
        }
      );

    } catch (error) {

      console.error(
        "Worker error:",
        error
      );

      return response(
        {
          success: false,

          error:
            "Unable to create iKhokha payment",

          details:
            error instanceof Error
              ? error.message
              : String(error)
        },
        500
      );
    }
  }
};