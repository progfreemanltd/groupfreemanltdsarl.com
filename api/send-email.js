import { Resend } from 'resend';

// Assurez-vous de créer un fichier .env avec votre clé
const resend = new Resend(process.env.VITE_RESEND_API_KEY);

export default async function handler(request, response) {
  // 1. Vérifier que la méthode est POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 2. Récupérer les données du formulaire
    const { firstName, email, requestType, message } = request.body;

    // 3. Envoyer l'email avec Resend
    const { data, error } = await resend.emails.send({
      from: 'Contact FreemanLTD <noreply@groupfreemanltdsarl.com>',
      to: ['contactus@groupfreemanltdsarl.com'],
      subject: `Nouveau message de ${firstName} via freeman-ltd.com`,
      html: `
        <p><strong>Prénom:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Type de demande:</strong> ${requestType}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      return response.status(400).json(error);
    }

    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({ message: 'Internal Server Error' });
  }
}