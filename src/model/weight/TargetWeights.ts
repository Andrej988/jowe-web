export interface TargetWeight {
  userId: string;
  recordId: string;
  timestamp: number;
  date: Date;
  targetWeight: number;
  lastModified?: number;
}

export interface TargetWeights {
  targetWeights: TargetWeight[];
}
