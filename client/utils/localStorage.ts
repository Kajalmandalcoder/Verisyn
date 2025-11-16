export interface FileEntry {
  id: string;
  originalImage: string;
  transformedImage: string;
  style: string;
  timestamp: number;
  secureLink: string;
}

export interface RecipientEntry {
  id: string;
  fileId: string;
  email: string;
  dateShared: number;
  status: 'active' | 'expired';
}

export interface SharingSettings {
  fileId: string;
  hasPassword: boolean;
  password?: string;
  viewOnly: boolean;
  expiryHours: number;
  createdAt: number;
}

const MY_FILES_KEY = 'crypture_myFiles';
const RECIPIENTS_LOG_KEY = 'crypture_recipientsLog';
const SHARING_SETTINGS_KEY = 'crypture_sharingSettings';

export const getMyFiles = (): FileEntry[] => {
  try {
    const data = localStorage.getItem(MY_FILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading myFiles:', error);
    return [];
  }
};

export const saveFile = (file: FileEntry): void => {
  try {
    const files = getMyFiles();
    const existingIndex = files.findIndex(f => f.id === file.id);
    if (existingIndex >= 0) {
      files[existingIndex] = file;
    } else {
      files.push(file);
    }
    localStorage.setItem(MY_FILES_KEY, JSON.stringify(files));
  } catch (error) {
    console.error('Error saving file:', error);
  }
};

export const getFile = (id: string): FileEntry | null => {
  const files = getMyFiles();
  return files.find(f => f.id === id) || null;
};

export const deleteFile = (id: string): void => {
  try {
    const files = getMyFiles();
    const filtered = files.filter(f => f.id !== id);
    localStorage.setItem(MY_FILES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

export const getRecipients = (): RecipientEntry[] => {
  try {
    const data = localStorage.getItem(RECIPIENTS_LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading recipients log:', error);
    return [];
  }
};

export const addRecipient = (recipient: RecipientEntry): void => {
  try {
    const recipients = getRecipients();
    recipients.push(recipient);
    localStorage.setItem(RECIPIENTS_LOG_KEY, JSON.stringify(recipients));
  } catch (error) {
    console.error('Error adding recipient:', error);
  }
};

export const getRecipientsByFileId = (fileId: string): RecipientEntry[] => {
  return getRecipients().filter(r => r.fileId === fileId);
};

export const getSharingSettings = (fileId: string): SharingSettings | null => {
  try {
    const data = localStorage.getItem(SHARING_SETTINGS_KEY);
    if (!data) return null;
    const allSettings: Record<string, SharingSettings> = JSON.parse(data);
    return allSettings[fileId] || null;
  } catch (error) {
    console.error('Error reading sharing settings:', error);
    return null;
  }
};

export const saveSharingSettings = (settings: SharingSettings): void => {
  try {
    const data = localStorage.getItem(SHARING_SETTINGS_KEY);
    const allSettings: Record<string, SharingSettings> = data ? JSON.parse(data) : {};
    allSettings[settings.fileId] = settings;
    localStorage.setItem(SHARING_SETTINGS_KEY, JSON.stringify(allSettings));
  } catch (error) {
    console.error('Error saving sharing settings:', error);
  }
};

export const generateSecureLink = (fileId: string): string => {
  return `${window.location.origin}/share/${fileId}`;
};
