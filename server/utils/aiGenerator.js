const { GoogleGenerativeAI } = require("@google/generative-ai");

class SQLPrepAIGenerator {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing API Key. Check your .env file.");
      throw new Error("Gemini API key is missing. Please check your .env file.");
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      this.lastGeneratedResponse = null; // Store last response
      console.log("✅ Gemini AI Initialized Successfully!");
    } catch (error) {
      console.error("❌ Failed to initialize Gemini AI:", error);
      throw new Error("Could not initialize Gemini AI. Check your API key.");
    }
  }

  async generateSQLPrepPlan(userInput) {
    try {
      this.validateInput(userInput);

      const prompt = this.constructPrompt(userInput);
      console.log("\n📝 Generated Prompt:\n", prompt, "\n");

      const result = await this.model.generateContent(prompt);
      console.log("📩 Raw API Response:", result);

      if (!result || !result.response) {
        throw new Error("❌ Invalid API response. Response is missing.");
      }

      const aiResponse = result.response.text();
      console.log("\n📜 AI Response Text:\n", aiResponse);
      
      // Store the raw text response
      this.lastGeneratedResponse = aiResponse;

      if (!aiResponse || aiResponse.trim().length === 0) {
        throw new Error("❌ Received empty response from Gemini AI.");
      }

      const parsedPlan = this.parseAIPlan(aiResponse);
      
      if (parsedPlan.length === 0) {
        console.warn("⚠️ Failed to parse AI response, using default questions");
        return this.getDefaultQuestions();
      }
      
      return parsedPlan;
      
    } catch (error) {
      console.error("🚨 Detailed AI Generation Error:", {
        message: error.message,
        stack: error.stack,
        userInput: JSON.stringify(userInput),
      });
      return this.getDefaultQuestions();
    }
  }

  validateInput(userInput) {
    const requiredFields = ["yearsOfExperience", "currentCTC", "targetCompanies", "timeCommitment"];
    for (let field of requiredFields) {
      if (!userInput[field]) {
        throw new Error(`❌ Missing required field: ${field}`);
      }
    }
  }

  constructPrompt(userInput) {
    return `Create a comprehensive SQL interview preparation plan for a data engineering role with these specifications:
    - Experience Level: ${userInput.yearsOfExperience} years
    - Current Compensation: ${userInput.currentCTC}
    - Target Companies: ${userInput.targetCompanies.join(", ")}
    - Weekly Study Time: ${userInput.timeCommitment}

    Generate exactly 25 SQL interview questions with this STRICT format for EACH question:
    Title: [Descriptive Title]
    Difficulty: [Easy/Medium/Hard]
    Concepts: [Comma-separated SQL concepts]
    Description: [Detailed problem description with context]`;
  }

  parseAIPlan(aiResponse) {
    console.log("Attempting to parse AI response");
    const questions = [];
    const markdownRegex = /\*\*(\d+)\.\s*Title:\*\*\s*(.*?)\s*\*\*Difficulty:\*\*\s*(.*?)\s*\*\*Concepts:\*\*\s*(.*?)\s*\*\*Description:\*\*\s*(.*?)(?=\*\*\d+\.|$)/gs;
    
    let match;
    while ((match = markdownRegex.exec(aiResponse)) !== null) {
      questions.push({
        title: match[2].trim(),
        difficulty: match[3].trim(),
        concepts: match[4].split(',').map(c => c.trim()),
        description: match[5].trim(),
        category: "Problem Solving",
        completed: false
      });
    }
    
    console.log(`Found ${questions.length} questions using markdown regex`);
    return questions;
  }

  getDefaultQuestions() {
    console.warn("⚠️ Using Default Questions as a Fallback.");
    return [
      {
        title: "Advanced SQL Join Techniques",
        difficulty: "Hard",
        concepts: ["Joins", "Complex Aggregations"],
        description: "Solve complex data integration problems using advanced join strategies.",
        category: "Problem Solving",
        completed: false,
      },
      {
        title: "Indexing and Performance Optimization",
        difficulty: "Medium",
        concepts: ["Indexes", "Query Optimization"],
        description: "Improve query performance by analyzing different indexing strategies.",
        category: "Performance Tuning",
        completed: false,
      },
    ];
  }
}

module.exports = new SQLPrepAIGenerator();
