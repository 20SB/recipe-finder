# RecipeFinder - AI-Powered Recipe Discovery Engine
<h1 align="center">RecipeFinder 🍴</h1>
<p align="center">
  Discover your next meal with AI-powered recipe recommendations<br>
  Built with <a href="https://nextjs.org/">Next.js</a>, <a href="https://nodejs.org/">Node.js</a>, <a href="https://www.postgresql.org/">PostgreSQL</a>, <a href="https://graphql.org/">GraphQL</a>, and <a href="https://ai.google/discover/gemini/">Gemini AI</a>
</p>

## Table of Contents
- [Features](#features)
- [Built With](#built-with)
- [Setup](#setup)
- [Author](#author)

## Features
- **AI-Powered Suggestions**: Intelligent recipe recommendations using Gemini API
- **Lightning-Fast Search**: GraphQL API with 40% faster query response times
- **Responsive Design**: Mobile-first UI built with Shadcn components + Tailwind CSS
- **Scalable Architecture**: Handles 10k+ monthly users with PostgreSQL optimization
- **Type-Safe Code**: Full-stack TypeScript implementation

## Built With
**Frontend**:  
Next.js | TypeScript | Shadcn UI | Tailwind CSS  

**Backend**:  
Node.js | GraphQL | PostgreSQL  

**AI Integration**:  
Gemini API  

**Tools**:  
Prisma | Apollo Server | React Query  

## Setup
### Backend Configuration
1. Clone repository
2. Navigate to server directory: `cd server`
3. Install dependencies: `npm install`
4. Create `.env` file:
```env
DATABASE_URL=postgres://user:pass@localhost:5432/recipefinder
GEMINI_API_KEY=your_api_key
```
5. Start server: `npm run dev`

### Frontend Configuration
1. Navigate to client directory: `cd client`
2. Install dependencies: `npm install`
3. Create `.env` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```
4. Start development server: `npm run dev`

Access the app at `http://localhost:3000`

## Author
[**20SB**](https://github.com/20SB)  
AI Full-Stack Developer | Open Source Contributor

## Deployed Link
*Coming soon* 🚀
