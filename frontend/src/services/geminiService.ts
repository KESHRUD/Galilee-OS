
import { GoogleGenAI } from "@google/genai";

interface EnhancedTaskResult {
    description: string;
    tags: string[];
    subtasks: string[];
}

interface FlashcardResult {
    question: string;
    answer: string;
}

export const enhanceTaskDescription = async (title: string, currentDesc: string): Promise<EnhancedTaskResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not configured");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Tu es un assistant ingénieur pédagogique pour l'école Sup Galilée.
    Tâche : "${title}".
    Desc : "${currentDesc}".
    
    1. Améliore la description (technique, précise) en français.
    2. Suggère 3 tags courts (ex: Math, Physique, Info).
    3. Génère 3-5 sous-tâches concrètes.
    
    Retourne UNIQUEMENT un JSON : { "description": string, "tags": string[], "subtasks": string[] }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const generateFlashcards = async (topic: string, count: number = 5): Promise<FlashcardResult[]> => {
    if (!process.env.API_KEY) throw new Error("API Key Missing");

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
        Génère ${count} cartes de révision (Flashcards) niveau école d'ingénieur sur le sujet : "${topic}".
        Questions précises, Réponses concises mais techniques.
        Retourne UNIQUEMENT un JSON : [ { "question": "...", "answer": "..." }, ... ]
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '[]');
    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
}

export const generateDiagramCode = async (description: string): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key Missing");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Génère un diagramme MermaidJS (Flowchart ou SequenceDiagram) qui illustre ce processus technique :
    "${description}"
    
    Utilise des formes géométriques, des couleurs (style cyan/blue si possible).
    Retourne UNIQUEMENT le code brut MermaidJS sans markdown.
    Exemple: 
    graph TD
    A[Start] --> B{Is Valid?}
    B -- Yes --> C[Process]
    B -- No --> D[End]
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    // Strip markdown if present
    let text = response.text || '';
    text = text.replace(/```mermaid/g, '').replace(/```/g, '').trim();
    return text;
  } catch (error) {
      console.error("Gemini Diagram Error:", error);
      throw error;
  }
}
