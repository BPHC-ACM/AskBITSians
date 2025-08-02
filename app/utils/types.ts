export interface Student {
  id: string;
  name: string;
  email: string;
  identifier?: string;
  cgpa?: number;
}

export interface Alumnus {
  id: string;
  name: string;
  email: string;
  company?: string;
  job_title?: string;
  graduation_year?: number;
  linkedin_profile_url?: string;
  areas_of_expertise?: string[];
}

export interface Message {
  timestamp: string;
  id: string;
  content: string;
  roomid: string;
}

export interface Chat {
  roomid: string;
  alumnus_id?: string;
  student_id?: string;
  created_at: string;
  messages: Message[];
}

export interface Request {
  id: string;
  student_id?: string;
  alumnus_id?: string;
  subject?: string;
  details?: string;
  status: string;
  created_at: string;
}

export interface ForumPost {
  id: string;
  query: string;
  title?: string;
  created_at: string;
  name: string;
  identifier: string;
  tags?: string[];
}

export interface ForumReply {
  id: number;
  post_id?: string;
  name: string;
  answer: string;
  timestamp: string;
  identifier?: string;
}
