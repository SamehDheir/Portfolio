import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  private readonly API_URL = 'https://router.huggingface.co/v1/chat/completions';
  private cachedContext: string = '';
  private lastCacheTime: number = 0;

  constructor(private prisma: PrismaService) {}

  async getAiResponse(userMessage: string) {
    const context = await this.getDynamicContext();

    const systemPrompt = `
      You are Sameh Dheir's (سامح ضهير) Expert AI Assistant. 
      
      STRICT RULES:
      1. LANGUAGE: Detect the user's language. If they speak Arabic, respond in Arabic. If English, respond in English.
      2. NO CHINESE: Never use Chinese characters.
      3. TECHNICAL TERMS: Keep terms like "Full-stack", "NestJS", "Microservices" in English even in Arabic responses.
      4. IDENTITY: You represent Sameh, a Full-stack Developer and IT Master's student.
      
      DATA FROM SAMEH'S DATABASE:
      ${context}
    `;

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.1-8B-Instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      const result = await response.json();
      return { text: result.choices[0].message.content.trim() };
    } catch (error) {
      return { text: "I'm sorry, I'm having trouble accessing Sameh's database right now." };
    }
  }

  private async getDynamicContext(): Promise<string> {
    const now = Date.now();
    if (this.cachedContext && now - this.lastCacheTime < 10 * 60 * 1000) {
      return this.cachedContext;
    }

    const user = await this.prisma.user.findFirst({
      where: { email: 'sameh.dheir1@gmail.com' }, 
      include: {
        projects: { select: { title: true, description: true, techStack: true } },
        skills: { select: { name: true, category: true } },
        posts: { where: { published: true }, select: { title: true, category: true } },
      },
    });

    if (!user) return "No data available for Sameh yet.";

    const projectsStr = user.projects.map(p => `- **${p.title}**: ${p.description} (Stack: ${p.techStack.join(', ')})`).join('\n');
    const skillsStr = user.skills.map(s => `${s.name} (${s.category})`).join(', ');
    const postsStr = user.posts.map(p => `- ${p.title} [Topic: ${p.category}]`).join('\n');

    this.cachedContext = `
      [BIO]
      ${user.bio}

      [TECHNICAL SKILLS]
      ${skillsStr}

      [PORTFOLIO PROJECTS]
      ${projectsStr}

      [PUBLISHED ARTICLES]
      ${postsStr}
    `;

    this.lastCacheTime = now;
    return this.cachedContext;
  }
}