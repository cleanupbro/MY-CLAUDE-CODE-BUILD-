import { Submission, SubmissionStatus, SubmissionType, SubmissionData } from '../types';

const FAILED_SUBMISSIONS_KEY = 'cleanUpBrosFailedSubmissions';

export const getFailedSubmissions = (): Submission[] => {
  try {
    const submissionsJson = localStorage.getItem(FAILED_SUBMISSIONS_KEY);
    return submissionsJson ? JSON.parse(submissionsJson) : [];
  } catch (error) {
    console.error("Failed to parse failed submissions from localStorage", error);
    return [];
  }
};

export const saveFailedSubmission = (submission: { type: SubmissionType, data: SubmissionData }): void => {
  const failedSubmissions = getFailedSubmissions();
  const newFailedSubmission: Submission = {
    ...submission,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: Date.now(),
    status: SubmissionStatus.Pending,
  };
  failedSubmissions.push(newFailedSubmission);
  localStorage.setItem(FAILED_SUBMISSIONS_KEY, JSON.stringify(failedSubmissions));
};

export const removeFailedSubmission = (id: string): Submission[] => {
    const failedSubmissions = getFailedSubmissions();
    const updatedSubmissions = failedSubmissions.filter(sub => sub.id !== id);
    localStorage.setItem(FAILED_SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
    return updatedSubmissions;
};

export const clearFailedSubmissions = (): void => {
    localStorage.removeItem(FAILED_SUBMISSIONS_KEY);
};