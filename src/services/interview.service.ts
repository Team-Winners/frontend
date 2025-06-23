import api from './api';

export interface Topic {
  id: string;
  name: string;
  description: string;
}

export interface TopicsResponse {
  status: string;
  algorithms: Topic[];
  backend: Topic[];
  frontend: Topic[];
  database: Topic[];
}

export interface Question {
  id: string;
  text: string;
  difficulty: string;
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  analysis: string;
}

export interface InterviewSummary {
  score: number;
  questionsAnswered: number;
  topStrengths: string[];
  topImprovements: string[];
  overallFeedback: string;
}

export interface InterviewResult {
  id: string;
  topic: string;
  level: string;
  score: number;
  startedAt: string;
  completedAt: string;
  questions: {
    id: string;
    text: string;
    answer: string;
    score: number;
    feedback: string;
  }[];
  summary: {
    topStrengths: string[];
    topImprovements: string[];
    overallFeedback: string;
  };
}

export interface InterviewResultData {
  id: string;
  topic: string;
  overallScore: number;
  completed_at: string;
  skills: Array<{
    name: string;
    score: number;
  }>;
  questions: Array<{
    question: string;
    answer: string;
    feedback: string;
    score: number;
  }>;
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    title: string;
    url?: string;
  }>;
}

export interface DashboardStats {
  total_interviews: number;
  avg_score: number;
  topics_covered: number;
  total_hours: number;
}

export interface RecentInterview {
  id: string;
  topic: string;
  level: string;
  score: number;
  completed_at: string;
}

export interface RecommendedInterview {
  id: string;
  topic: string;
  description: string;
}

export interface DashboardData {
  status: string;
  user: {
    username: string;
    email: string;
    experienceLevel: string;
  };
  activityData: Array<{ date: string; count: number }>;
  skillRatings: Array<{ name: string; rating: number; topicId: string }>;
  recentInterviews: Array<{
    id: string;
    topic: string;
    date: string;
    score: number;
  }>;
  recommendedInterviews: Array<{
    id: string;
    topic: string;
    description: string;
  }>;
}

const interviewService = {
  async getTopics(): Promise<TopicsResponse> {
    const response = await api.get('/topics');
    return response.data;
  },

  async startInterview(topicId: string): Promise<{ interviewId: string; firstQuestion: Question }> {
    const response = await api.post<{ status: string; interviewId: string; firstQuestion: Question }>(
      '/interviews/start',
      { topicId }
    );
    return {
      interviewId: response.data.interviewId,
      firstQuestion: response.data.firstQuestion
    };
  },

  async getNextQuestion(
    interviewId: string, 
    previousQuestionId: string, 
    userAnswer: string
  ): Promise<{ question: Question; isLastQuestion: boolean }> {
    const response = await api.post<{ status: string; question: Question; isLastQuestion: boolean }>(
      '/interviews/question',
      { interviewId, previousQuestionId, userAnswer }
    );
    return {
      question: response.data.question,
      isLastQuestion: response.data.isLastQuestion
    };
  },

  async completeInterview(
    interviewId: string,
    finalQuestionId: string,
    userAnswer: string
  ): Promise<{ redirectTo: string; interviewResultId: string }> {
    const response = await api.post<{ status: string; redirectTo: string; interviewResultId: string }>(
      '/interviews/complete',
      { interviewId, finalQuestionId, userAnswer }
    );
    return {
      redirectTo: response.data.redirectTo,
      interviewResultId: response.data.interviewResultId
    };
  },

  async getInterviewResults(interviewId: string): Promise<InterviewResultData> {
    const response = await api.get(`/interviews/${interviewId}/results`);
    return response.data;
  },

  async getDashboard(): Promise<DashboardData> {
    const response = await api.get('/users/dashboard');
    return {
      status: response.data.status || 'success',
      user: {
        username: response.data.user?.username || 'Unknown User',
        email: response.data.user?.email || '',
        experienceLevel: response.data.user?.experienceLevel || 'Not specified'
      },
      activityData: response.data.activityData || [],
      skillRatings: response.data.skillRatings || [],
      recentInterviews: response.data.recentInterviews || [],
      recommendedInterviews: response.data.recommendedInterviews || []
    };
  },

  async analyzeSpeech(audioBlob: Blob, questionId: string): Promise<{ 
    transcription: string;
    clarity: number;
    technicalAccuracy: number;
    completeness: number;
    confidence: number;
    feedback: string;
  }> {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('questionId', questionId);

    const response = await api.post<{ 
      status: string; 
      analysis: {
        transcription: string;
        clarity: number;
        technicalAccuracy: number;
        completeness: number;
        confidence: number;
        feedback: string;
      }
    }>('/speech/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.analysis;
  },

  async getRecommendedInterviews(): Promise<Topic[]> {
    try {
      const response = await api.get('/interviews/recommended');
      return response.data.topics || [];
    } catch (error) {
      console.error('Error fetching recommended interviews:', error);
      // Fallback to regular topics if recommended endpoint doesn't exist
      const topicsResponse = await this.getTopics();
      // Flatten all topics into a single array
      return [
        ...topicsResponse.algorithms,
        ...topicsResponse.backend,
        ...topicsResponse.frontend,
        ...topicsResponse.database
      ];
    }
  },

  async generateAIQuestion(
    topic: string,
    level: string,
    previousQuestions: string[],
    userPerformance: string
  ): Promise<{ question: Question; sampleAnswer?: string }> {
    try {
      const response = await api.post('/ai/question/generate', {
        topic,
        level,
        previousQuestions,
        userPerformance
      });
      return {
        question: response.data.question,
        sampleAnswer: response.data.question.sampleAnswer
      };
    } catch (error) {
      console.error('Error generating AI question:', error);
      // Fallback to predefined questions
      return {
        question: {
          id: `fallback-${Date.now()}`,
          text: `Can you explain a key concept or best practice in ${topic}?`,
          difficulty: level
        }
      };
    }
  },
};

export default interviewService;
