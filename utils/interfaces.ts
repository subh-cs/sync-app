export interface IJob {
    created_at: string;
    job_id: string;
    thumbnail_url: string;
    user_email: string;
}

export interface IFile {
    strategy?: UploadStrategy;
    uri: string;
    name?: string;
    type: "video" | "audio";
    data: string;
}

export enum UploadStrategy {
    UPLOAD = "UPLOAD",
    YOUTUBE = "YOUTUBE",
    OTHER_URL = "OTHER_URL"
}

export interface ApiResponse {
    id: string;
    url: string;
    original_audio_url: string;
    original_video_url: string;
    status: string;
    synergize: boolean;
    credits_deducted: number;
}

export interface IUser {
    email: string;
    family_name: string;
    given_name: string;
    id: string;
    locale: string;
    name: string;
    picture: string;
    verified_email: boolean;
  }
  