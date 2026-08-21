// Vercel Serverless Function: POST /api/verify-recaptcha
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { token } = req.body || {};
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // If secret key is not set (e.g. dev environment), allow verification to pass gracefully
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY is not set on server. Bypassing check.');
    return res.status(200).json({ success: true, score: 1.0, bypassed: true });
  }

  if (!token) {
    return res.status(400).json({ success: false, error: 'Missing reCAPTCHA token' });
  }

  try {
    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const googleRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await googleRes.json();

    // Check if Google verified and score >= 0.5
    if (data.success && typeof data.score === 'number' && data.score >= 0.5) {
      return res.status(200).json({ success: true, score: data.score });
    }

    console.warn('reCAPTCHA failed or low score:', { success: data.success, score: data.score, errors: data['error-codes'] });
    return res.status(200).json({
      success: false,
      score: data.score || 0,
      error: 'reCAPTCHA verification failed',
    });
  } catch (err) {
    console.error('Error verifying reCAPTCHA with Google:', err);
    return res.status(500).json({ success: false, error: 'Internal verification error' });
  }
}
