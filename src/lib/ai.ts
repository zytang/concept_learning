import OpenAI from "openai";

export interface GeneratedConceptData {
    definition: string;
    explanation: string;
    realWorldExample: string;
    miniCase: string;
    pitfalls: string[];
    relatedConcepts: string[];
    quizQuestion: string;
    quizOptions: string[];
    quizCorrectAnswer: string;
}

export async function generateConceptContent(term: string): Promise<GeneratedConceptData | null> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.error("❌ Configuration Error: OPENAI_API_KEY is missing from process.env");
        return null;
    }

    const openai = new OpenAI({
        apiKey: apiKey,
    });

    try {
        console.log(`📡 Generating content for: "${term}" using model: gpt-4o-mini`);

        const prompt = `
      Create comprehensive active learning content for the concept: "${term}".
      Target audience: College students.
      Return ONLY a JSON object with the following fields:
      - definition: concise academic definition (1-2 sentences)
      - explanation: student-friendly explanation (3-4 sentences)
      - realWorldExample: a concrete business scenario where this concept is applied
      - miniCase: a short 1-paragraph mini-case study description involving this concept
      - pitfalls: an array of strings listing common mistakes or misunderstandings
      - relatedConcepts: an array of strings (3-5) of related terms
      - quizQuestion: a scenario-based multiple choice question to test understanding (not just definition recall)
      - quizOptions: an array of 4 possible answers
      - quizCorrectAnswer: the exact string of the correct answer from options
    `;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are an expert professor. Output JSON only." },
                { role: "user", content: prompt }
            ],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            console.error("❌ API Error: Received empty content from OpenAI");
            return null;
        }

        return JSON.parse(content) as GeneratedConceptData;
    } catch (error: any) {
        console.error("❌ OpenAI API Request Failed:");
        console.error("   Message:", error.message);
        console.error("   Type:", error.type);
        console.error("   Code:", error.code);
        return null;
    }
}
