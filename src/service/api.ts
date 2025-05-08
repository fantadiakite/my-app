export const analyzePlantImage = async (imageUri: string, assisted: boolean) => {
    // En réalité, vous enverriez l'image à votre backend Flask
    // Ceci est une simulation
    
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'plant.jpg',
    } as any);
    formData.append('assisted', String(assisted));
  
    try {
      // Simulation de l'appel API
      console.log('Envoi de l\'image pour analyse...');
      
      // En production, vous utiliseriez quelque chose comme:
      /*
      const response = await fetch('http://votre-backend-flask/api/analyze', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse');
      }
      
      return await response.json();
      */
      
      // Simulation de réponse
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        status: Math.random() > 0.5 ? 'healthy' : 'diseased',
        confidence: Math.floor(Math.random() * 30) + 70,
        disease: Math.random() > 0.5 ? 'Mildiou' : 'Rouille',
        segmentedImageUri: imageUri, // En réalité, vous recevriez une nouvelle URI
      };
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  };
  
  export const chatWithAssistant = async (message: string) => {
    // Simulation de l'appel API au chatbot Flask
    try {
      // En production:
      /*
      const response = await fetch('http://votre-backend-flask/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur de chat');
      }
      
      return await response.json();
      */
      
      // Simulation de réponse
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responses = [
        "Je comprends votre préoccupation. Pouvez-vous me donner plus de détails?",
        "Les symptômes que vous décrivez pourraient correspondre à plusieurs maladies. Une photo aiderait.",
        "Je recommande de vérifier l'humidité du sol et l'exposition à la lumière.",
        "Ce problème est souvent lié à un excès d'arrosage. Essayez de réduire la fréquence.",
        "Merci pour ces informations. Je vais consulter ma base de données pour des solutions.",
      ];
      
      return {
        response: responses[Math.floor(Math.random() * responses.length)],
      };
    } catch (error) {
      console.error('Erreur de chat:', error);
      throw error;
    }
  };