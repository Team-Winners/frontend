import api from './api';

export interface User {
  id: string;
  email: string;
  username: string;
  created_at?: string;
  onboarding_completed?: boolean;
  profile_complete?: boolean;
  experience?: string;
  interests?: string[];
  goals?: string;
  name?: string; // Keep for backward compatibility
}

export interface AuthResponse {
  status: string;
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface OnboardingData {
  experienceLevel: string;
  goals: string;
  weakTopics: string[];
  strongTopics: string[];
  preferredLanguages: string[];
}

export interface Skill {
  category: string;
  score: number;
  details: {
    name: string;
    score: number;
  }[];
}

export interface BackendSkill {
  id: string;
  name: string;
  category: string;
  proficiency_level: number;
  last_practiced?: string;
  total_questions?: number;
  correct_answers?: number;
}

const authService = {
  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    
    // Backend returns: { status, message, token, user }
    const user: User = {
      id: response.data.user.id,
      email: response.data.user.email,
      username: response.data.user.username,
      profile_complete: response.data.user.profile_complete || false,
      name: response.data.user.username // Use username as name for backward compatibility
    };
    
    const authResponse: AuthResponse = {
      status: response.data.status,
      token: response.data.token,
      user: user
    };
    
    this.setSession(response.data.token, user);
    return authResponse;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    
    // Backend returns: { status, message, id, username, email, token }
    const user: User = {
      id: response.data.id,
      email: response.data.email,
      username: response.data.username,
      profile_complete: false, // New users don't have complete profiles
      name: response.data.username // Use username as name for backward compatibility
    };
    
    const authResponse: AuthResponse = {
      status: response.data.status,
      token: response.data.token,
      user: user
    };
    
    this.setSession(response.data.token, user);
    return authResponse;
  },

  async completeOnboarding(data: OnboardingData): Promise<{ user: User }> {
    const response = await api.post<{ status: string; user: User }>('/users/onboarding', data);
    // Update the stored user data
    const currentUser = this.getUser();
    if (currentUser) {
      this.setUser({ ...currentUser, ...response.data.user });
    }
    return { user: response.data.user };
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get('/auth/me');
      // Backend returns: { status, id, username, email, profile_complete }
      const user: User = {
        id: response.data.id,
        email: response.data.email,
        username: response.data.username,
        profile_complete: response.data.profile_complete || false,
        name: response.data.username
      };
      this.setUser(user);
      return user;
    } catch {
      return null;
    }
  },

  async getUserSkills(): Promise<Skill[]> {
    try {
      const response = await api.get('/users/skills');
      return response.data.skills || [];
    } catch (error) {
      console.error('Error fetching user skills:', error);
      return [];
    }
  },

  setSession(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear session storage as well
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    // Force reload to ensure clean state
    window.location.href = '/';
  }
};

export default authService;
